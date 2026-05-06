import path from "node:path";
import {fetchLatestArxivPapers, parseArxivIdFromInput, toCanonicalArxivAbsUrl} from "./lib/arxiv";
import {
  normalizePaperUrlRecords,
  readPaperUrlCsvRecords,
  writePaperUrlCsvRecords,
  type PaperUrlRecord,
} from "./lib/paper-url-batch";

const DEFAULT_OUTPUT = path.resolve("data/papers/paper-urls.csv");
const DEFAULT_CATEGORY = "cs.AI";
const DEFAULT_LIMIT = 10;

const parseArgs = () => {
  const args = process.argv.slice(2);
  const take = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  return {
    output: path.resolve(take("--output") ?? DEFAULT_OUTPUT),
    category: take("--category") ?? DEFAULT_CATEGORY,
    limit: Number.parseInt(take("--limit") ?? String(DEFAULT_LIMIT), 10),
    dryRun: args.includes("--dry-run"),
  };
};

const main = async () => {
  const options = parseArgs();
  const latest = await fetchLatestArxivPapers({
    category: options.category,
    limit: Number.isFinite(options.limit) && options.limit > 0 ? options.limit : DEFAULT_LIMIT,
  });

  const latestUrls = latest.map((paper) => toCanonicalArxivAbsUrl(paper.arxivId));

  let existingRecords: PaperUrlRecord[] = [];
  try {
    existingRecords = await readPaperUrlCsvRecords(options.output);
  } catch {
    existingRecords = [];
  }

  const merged = normalizePaperUrlRecords([
    ...latestUrls.map((paperUrl) => ({paperUrl, status: "unprocessed" as const})),
    ...existingRecords,
  ]);
  const existingIds = new Set(
    existingRecords.map((record) => parseArxivIdFromInput(record.paperUrl)?.toLowerCase() ?? record.paperUrl.toLowerCase()),
  );
  const added = latestUrls.filter((value) => {
    const arxivId = parseArxivIdFromInput(value)?.toLowerCase() ?? value.toLowerCase();
    return !existingIds.has(arxivId);
  });

  if (!options.dryRun) {
    await writePaperUrlCsvRecords({
      filePath: options.output,
      records: merged,
    });
  }

  console.log(
    JSON.stringify(
      {
        output: options.output,
        category: options.category,
        latestFetched: latestUrls.length,
        added: added.length,
        total: merged.length,
        dryRun: options.dryRun,
        records: merged,
      },
      null,
      2,
    ),
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
