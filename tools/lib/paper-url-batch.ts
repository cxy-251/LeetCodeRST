import fs from "node:fs/promises";
import path from "node:path";
import {makeRunId, slugify} from "./run-artifacts";

const IMAGE_FILE_PATTERN = /\.(png|jpg|jpeg|webp|svg)$/i;

export const readPaperUrlFile = async (filePath: string) => {
  const raw = await fs.readFile(filePath, "utf-8");
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
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
