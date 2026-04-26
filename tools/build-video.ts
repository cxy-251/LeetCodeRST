import fs from "node:fs/promises";
import path from "node:path";
import {spawn} from "node:child_process";
import type {RenderManifest} from "@paper-to-video/shared-types";

const DEFAULT_RENDER_MANIFEST = path.resolve("data/generated-meta/demo-paper-001.render.json");
const DEFAULT_OUTPUT = path.resolve("output/videos/demo-paper-001.mp4");
const PUBLIC_DIR = path.resolve("public");

const run = (command: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {stdio: "inherit"});
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
    });
    child.on("error", reject);
  });

const prepareStaticAssets = async (manifest: RenderManifest): Promise<RenderManifest> => {
  const generatedAudioDir = path.join(PUBLIC_DIR, "generated-audio");
  const generatedImagesDir = path.join(PUBLIC_DIR, "generated-images");
  await fs.mkdir(generatedAudioDir, {recursive: true});
  await fs.mkdir(generatedImagesDir, {recursive: true});

  const audioAssets = await Promise.all(
    manifest.audioAssets.map(async (asset, index) => {
      if (!asset.filePath) {
        return asset;
      }

      const sourcePath = path.resolve(asset.filePath);
      const extension = path.extname(sourcePath) || ".mp3";
      const fileName = `${String(index + 1).padStart(2, "0")}-${asset.sceneId}${extension}`;
      const targetPath = path.join(generatedAudioDir, fileName);
      await fs.copyFile(sourcePath, targetPath);

      return {
        ...asset,
        filePath: `generated-audio/${fileName}`,
      };
    }),
  );

  const imageAssets = await Promise.all(
    manifest.imageAssets.map(async (asset, index) => {
      if (!asset.localPath) {
        return asset;
      }

      const sourcePath = path.resolve(asset.localPath);
      const extension = path.extname(sourcePath) || ".png";
      const fileName = `${String(index + 1).padStart(2, "0")}-${asset.id}${extension}`;
      const targetPath = path.join(generatedImagesDir, fileName);
      await fs.copyFile(sourcePath, targetPath);

      return {
        ...asset,
        localPath: `generated-images/${fileName}`,
      };
    }),
  );

  return {
    ...manifest,
    audioAssets,
    imageAssets,
  };
};

const main = async () => {
  const renderManifest = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_RENDER_MANIFEST;
  const output = process.argv[3] ? path.resolve(process.argv[3]) : DEFAULT_OUTPUT;
  const manifestRaw = await fs.readFile(renderManifest, "utf-8");
  const manifest = await prepareStaticAssets(JSON.parse(manifestRaw) as RenderManifest);

  await run("npx", [
    "remotion",
    "render",
    "apps/video-renderer/src/index.tsx",
    "PaperToVideo",
    output,
    "--props",
    JSON.stringify({
      manifest,
    }),
  ]);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
