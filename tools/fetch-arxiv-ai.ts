import fs from "node:fs/promises";
import path from "node:path";
import {getPaperCacheDir, linkOrCopyFile} from "./lib/run-artifacts";

type ArxivPaper = {
  arxivId: string;
  title: string;
  summary: string;
  authors: string[];
  categories: string[];
  pdfUrl: string;
  publishedAt: string;
  updatedAt: string;
};

const DEFAULT_CATEGORY = "cs.AI";

const parseArgs = () => {
  const args = process.argv.slice(2);
  const getValue = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  return {
    category: getValue("--category") ?? DEFAULT_CATEGORY,
    limit: Number.parseInt(getValue("--limit") ?? "5", 10),
    downloadPdf: args.includes("--download-pdf"),
    latestOnly: args.includes("--latest-only"),
    runPaperDir: getValue("--run-paper-dir"),
  };
};

const decodeXml = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const getTag = (input: string, tag: string) => {
  const match = input.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return match ? decodeXml(match[1].trim()) : "";
};

const getTags = (input: string, tag: string) =>
  [...input.matchAll(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "g"))].map((match) =>
    decodeXml(match[1].trim()),
  );

const parseFeed = (xml: string): ArxivPaper[] => {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map((match) => match[1]);

  return entries.map((entry) => {
    const idUrl = getTag(entry, "id");
    const arxivId = idUrl.split("/abs/")[1] ?? idUrl;
    const pdfLinkMatch = entry.match(/<link[^>]+title="pdf"[^>]+href="([^"]+)"/);
    const categoryMatches = [...entry.matchAll(/<category[^>]+term="([^"]+)"/g)].map((match) => match[1]);

    return {
      arxivId,
      title: getTag(entry, "title").replace(/\s+/g, " ").trim(),
      summary: getTag(entry, "summary").replace(/\s+/g, " ").trim(),
      authors: getTags(entry, "name"),
      categories: categoryMatches,
      pdfUrl: pdfLinkMatch?.[1] ?? `https://arxiv.org/pdf/${arxivId}.pdf`,
      publishedAt: getTag(entry, "published"),
      updatedAt: getTag(entry, "updated"),
    };
  });
};

const downloadPdfIfMissing = async ({
  paper,
  runPaperDir,
}: {
  paper: ArxivPaper;
  runPaperDir?: string;
}) => {
  const paperCacheDir = getPaperCacheDir(paper.arxivId.replace("/", "_"));
  const pdfPath = path.join(paperCacheDir, "source.pdf");
  const metadataPath = path.join(paperCacheDir, "metadata.json");
  await fs.mkdir(paperCacheDir, {recursive: true});

  try {
    await fs.access(pdfPath);
  } catch {
    const response = await fetch(paper.pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to download PDF ${paper.pdfUrl}: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(pdfPath, buffer);
  }

  await fs.writeFile(metadataPath, JSON.stringify({...paper, localPdfPath: pdfPath}, null, 2), "utf-8");

  if (runPaperDir) {
    const targetPath = path.join(path.resolve(runPaperDir), `${paper.arxivId.replace("/", "_")}.pdf`);
    await linkOrCopyFile(pdfPath, targetPath);
  }

  return {
    ...paper,
    localPdfPath: pdfPath,
  };
};

const main = async () => {
  const options = parseArgs();
  const queryUrl =
    `http://export.arxiv.org/api/query?search_query=cat:${encodeURIComponent(options.category)}` +
    `&sortBy=submittedDate&sortOrder=descending&max_results=${options.limit}`;

  const response = await fetch(queryUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch arXiv feed: ${response.status}`);
  }

  const xml = await response.text();
  const parsed = parseFeed(xml);
  const papers = options.latestOnly ? parsed.slice(0, 1) : parsed;

  const results = [];
  for (const paper of papers) {
    results.push(
      options.downloadPdf
        ? await downloadPdfIfMissing({paper, runPaperDir: options.runPaperDir})
        : paper,
    );
  }

  console.log(JSON.stringify(results, null, 2));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
