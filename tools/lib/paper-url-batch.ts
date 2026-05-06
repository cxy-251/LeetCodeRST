import fs from "node:fs/promises";
import path from "node:path";
import {parseArxivIdFromInput, toCanonicalArxivAbsUrl} from "./arxiv";
import {makeRunId, slugify} from "./run-artifacts";

const IMAGE_FILE_PATTERN = /\.(png|jpg|jpeg|webp|svg)$/i;

export const readPaperUrlFile = async (filePath: string) => {
  const raw = await fs.readFile(filePath, "utf-8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
};

export const readPaperUrlCsv = async (filePath: string) => {
  const raw = await fs.readFile(filePath, "utf-8");
  const rows = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  if (rows.length === 0) {
    return [];
  }

  const values = rows.map((row) => row.split(",").map((cell) => cell.trim()).filter(Boolean));
  const firstCell = values[0]?.[0]?.toLowerCase() ?? "";
  const hasHeader = firstCell === "paper_url" || firstCell === "url";
  const records = hasHeader ? values.slice(1) : values;

  return records
    .map((cells) => cells[0])
    .filter((value): value is string => Boolean(value));
};

export const normalizePaperUrlList = (values: string[]) => {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) {
      continue;
    }

    const arxivId = parseArxivIdFromInput(normalized);
    const canonical = arxivId ? toCanonicalArxivAbsUrl(arxivId) : normalized;
    const dedupeKey = arxivId ? arxivId.toLowerCase() : canonical.toLowerCase();

    if (seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);
    result.push(canonical);
  }

  return result;
};

export const writePaperUrlCsv = async ({
  filePath,
  urls,
}: {
  filePath: string;
  urls: string[];
}) => {
  const normalized = normalizePaperUrlList(urls);
  const raw = ["paper_url", ...normalized].join("\n");
  await fs.mkdir(path.dirname(filePath), {recursive: true});
  await fs.writeFile(filePath, `${raw}\n`, "utf-8");
};

const directoryHasImages = async (dirPath: string) => {
  try {
    const entries = await fs.readdir(dirPath, {withFileTypes: true});
    return entries.some((entry) => entry.isFile() && IMAGE_FILE_PATTERN.test(entry.name));
  } catch {
    return false;
  }
};

export const resolveDefaultBackgroundDir = async () => {
  const preferred = path.resolve("data/images/prepared");
  if (await directoryHasImages(preferred)) {
    return preferred;
  }

  const fallback = path.resolve("data/images");
  if (await directoryHasImages(fallback)) {
    return fallback;
  }

  return preferred;
};

export const makePaperUrlBatchId = (label = "paper-urls", date = new Date()) =>
  slugify(`${label}-${makeRunId(date)}`);

export const buildPaperUrlBatchPaths = (batchId: string) => ({
  sourceBundlePath: path.resolve("data/source-bundles/generated", `${batchId}.json`),
  analysisBundlePath: path.resolve("data/source-bundles/generated", `${batchId}.analysis.json`),
  manifestDir: path.resolve("data/manifests/generated", batchId),
  batchCsvPath: path.resolve("data/video-batches/generated", `${batchId}.csv`),
});
