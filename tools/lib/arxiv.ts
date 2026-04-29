import fs from "node:fs/promises";
import path from "node:path";
import {getPaperCacheDir, linkOrCopyFile} from "./run-artifacts";

export type ArxivPaper = {
  arxivId: string;
  title: string;
  summary: string;
  authors: string[];
  categories: string[];
  pdfUrl: string;
  publishedAt: string;
  updatedAt: string;
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

export const parseArxivIdFromInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const directIdMatch = trimmed.match(/^\d{4}\.\d{4,5}(?:v\d+)?$/i);
  if (directIdMatch) {
    return directIdMatch[0];
  }

  try {
    const url = new URL(trimmed);
    if (!/arxiv\.org$/i.test(url.hostname)) {
      return null;
    }

    const absMatch = url.pathname.match(/^\/abs\/([^/]+)$/i);
    if (absMatch) {
      return absMatch[1];
    }

    const pdfMatch = url.pathname.match(/^\/pdf\/([^/]+?)(?:\.pdf)?$/i);
    if (pdfMatch) {
      return pdfMatch[1];
    }
  } catch {
    return null;
  }

  return null;
};

export const parseFeed = (xml: string): ArxivPaper[] => {
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

export const fetchArxivPaperById = async (arxivId: string) => {
  const queryUrl =
    `http://export.arxiv.org/api/query?id_list=${encodeURIComponent(arxivId)}&max_results=1`;
  const response = await fetch(queryUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch arXiv paper ${arxivId}: ${response.status}`);
  }

  const xml = await response.text();
  const papers = parseFeed(xml);
  const paper = papers[0];

  if (!paper) {
    throw new Error(`No arXiv paper found for ${arxivId}`);
  }

  return paper;
};

export const downloadPdfIfMissing = async ({
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
