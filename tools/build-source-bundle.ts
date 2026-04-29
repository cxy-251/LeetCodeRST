import fs from "node:fs/promises";
import path from "node:path";
import {shuffleWithSeed} from "./lib/deterministic-random";

type PaperMetadata = {
  arxivId: string;
  title: string;
  summary: string;
  authors: string[];
  categories: string[];
  pdfUrl: string;
  publishedAt: string;
  updatedAt: string;
  localPdfPath: string;
};

type SourceBundle = {
  generatedAt: string;
  papers: Array<
    PaperMetadata & {
      localTextPath?: string;
      textExtracted: boolean;
      suggestedCoverImagePath: string | null;
    }
  >;
  backgroundImages: Array<{
    id: string;
    localPath: string;
  }>;
};

const OUTPUT_PATH = path.resolve("data/source-bundles/latest-ai-batch.json");
const PAPER_CACHE_ROOT = path.resolve("output/cache/papers");
const IMAGE_CACHE_ROOT = path.resolve("output/cache/images");

const readJson = async <T,>(targetPath: string) =>
  JSON.parse(await fs.readFile(targetPath, "utf-8")) as T;

const parseArgs = (args: string[]) => {
  const take = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  const paperIds = (take("--paper-ids") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    paperIds: paperIds.length > 0 ? new Set(paperIds) : null,
    output: take("--output") ? path.resolve(take("--output") as string) : OUTPUT_PATH,
    backgroundDir: take("--background-dir") ? path.resolve(take("--background-dir") as string) : undefined,
    seed: Number.parseInt(take("--seed") ?? "42", 10),
  };
};

const collectImageFiles = async (rootDir: string): Promise<string[]> => {
  const entries = await fs.readdir(rootDir, {withFileTypes: true});
  const files: string[] = [];

  for (const entry of entries) {
    const resolved = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectImageFiles(resolved)));
      continue;
    }

    if (/\.(png|jpg|jpeg|webp|svg)$/i.test(entry.name)) {
      files.push(resolved);
    }
  }

  return files.sort();
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const paperDirs = (await fs.readdir(PAPER_CACHE_ROOT, {withFileTypes: true}))
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(PAPER_CACHE_ROOT, entry.name))
    .sort();

  const backgroundImagePaths = options.backgroundDir
    ? await collectImageFiles(options.backgroundDir)
    : (await fs.readdir(IMAGE_CACHE_ROOT))
      .filter((name) => /\.(png|jpg|jpeg|webp)$/i.test(name))
      .sort()
      .map((name) => path.join(IMAGE_CACHE_ROOT, name));

  const randomizedBackgrounds = shuffleWithSeed(backgroundImagePaths, options.seed);
  const backgroundImages = randomizedBackgrounds.map((localPath, index) => ({
    id: `bg-${String(index + 1).padStart(2, "0")}`,
    localPath,
  }));

  const papers = await Promise.all(
    paperDirs.map(async (paperDir, index) => {
      const metadata = await readJson<PaperMetadata>(path.join(paperDir, "metadata.json"));
      const localTextPath = path.join(paperDir, "source.txt");
      let textExtracted = true;
      try {
        await fs.access(localTextPath);
      } catch {
        textExtracted = false;
      }

      return {
        ...metadata,
        localTextPath: textExtracted ? localTextPath : undefined,
        textExtracted,
        suggestedCoverImagePath: backgroundImages[index % Math.max(1, backgroundImages.length)]?.localPath ?? null,
      };
    }),
  );

  const filteredPapers = options.paperIds
    ? papers.filter((paper) => options.paperIds?.has(paper.arxivId))
    : papers;

  const bundle: SourceBundle = {
    generatedAt: new Date().toISOString(),
    papers: filteredPapers,
    backgroundImages,
  };

  await fs.mkdir(path.dirname(options.output), {recursive: true});
  await fs.writeFile(options.output, JSON.stringify(bundle, null, 2), "utf-8");
  console.log(`Source bundle written to ${options.output}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
