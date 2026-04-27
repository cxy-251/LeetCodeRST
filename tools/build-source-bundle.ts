import fs from "node:fs/promises";
import path from "node:path";

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

const main = async () => {
  const paperDirs = (await fs.readdir(PAPER_CACHE_ROOT, {withFileTypes: true}))
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(PAPER_CACHE_ROOT, entry.name))
    .sort();

  const backgroundImages = (await fs.readdir(IMAGE_CACHE_ROOT))
    .filter((name) => /\.(png|jpg|jpeg|webp)$/i.test(name))
    .sort()
    .map((name, index) => ({
      id: `bg-${String(index + 1).padStart(2, "0")}`,
      localPath: path.join(IMAGE_CACHE_ROOT, name),
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
        suggestedCoverImagePath: backgroundImages[index % backgroundImages.length]?.localPath ?? null,
      };
    }),
  );

  const bundle: SourceBundle = {
    generatedAt: new Date().toISOString(),
    papers,
    backgroundImages,
  };

  await fs.mkdir(path.dirname(OUTPUT_PATH), {recursive: true});
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(bundle, null, 2), "utf-8");
  console.log(`Source bundle written to ${OUTPUT_PATH}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
