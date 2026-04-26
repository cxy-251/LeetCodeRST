import fs from "node:fs/promises";
import path from "node:path";
import {spawn} from "node:child_process";
import type {AudioAsset, ProductionManifest, RenderManifest} from "@paper-to-video/shared-types";

const DEFAULT_PRODUCTION_MANIFEST = path.resolve("data/manifests/demo-paper.json");
const DEFAULT_RENDER_MANIFEST = path.resolve("data/generated-meta/demo-paper-001.render.json");
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

const estimateSegments = (text: string) => {
  const sentences = text
    .split(/[。！？!?]/)
    .map((item) => item.trim())
    .filter(Boolean);
  const safeSentences = sentences.length > 0 ? sentences : [text.trim()];

  let cursor = 0;
  return safeSentences.map((sentence, index) => {
    const durationMs = Math.max(900, sentence.length * 220);
    const segment = {
      id: `seg-${index + 1}`,
      text: sentence,
      startMs: cursor,
      endMs: cursor + durationMs,
      role: "narration" as const,
    };
    cursor += durationMs;
    return segment;
  });
};

const createMockAudioAsset = async (sceneId: string, text: string) => {
  const segments = estimateSegments(text);
  const durationMs = segments.length > 0 ? segments[segments.length - 1].endMs : 1000;

  return {
    id: `audio-${sceneId}`,
    filePath: "",
    durationMs,
    sceneId,
    segments,
  } satisfies AudioAsset;
};

const main = async () => {
  const args = process.argv.slice(2);
  const mockMode = args.includes("--mock");
  const positionalArgs = args.filter((arg) => arg !== "--mock");
  const productionManifestPath = positionalArgs[0]
    ? path.resolve(positionalArgs[0])
    : DEFAULT_PRODUCTION_MANIFEST;
  const renderManifestPath = positionalArgs[1]
    ? path.resolve(positionalArgs[1])
    : DEFAULT_RENDER_MANIFEST;

  const [productionRaw, renderRaw] = await Promise.all([
    fs.readFile(productionManifestPath, "utf-8"),
    fs.readFile(renderManifestPath, "utf-8"),
  ]);

  const productionManifest = JSON.parse(productionRaw) as ProductionManifest;
  const renderManifest = JSON.parse(renderRaw) as RenderManifest;
  const audioAssets: AudioAsset[] = [];

  for (const scene of productionManifest.scenes) {
    if (mockMode) {
      const audioAsset = await createMockAudioAsset(scene.id, scene.narrationText);
      const outputMeta = path.resolve(`data/generated-meta/${scene.id}.audio.json`);
      await fs.writeFile(outputMeta, JSON.stringify(audioAsset, null, 2), "utf-8");
      audioAssets.push(audioAsset);
      continue;
    }

    const outputAudio = path.resolve(`data/generated-audio/${scene.id}.mp3`);
    const outputMeta = path.resolve(`data/generated-meta/${scene.id}.audio.json`);

    await run("conda", [
      "run",
      "-n",
      "kwai",
      "python",
      "services/tts-python/src/main.py",
      "--scene-id",
      scene.id,
      "--text",
      scene.narrationText,
      "--voice",
      productionManifest.voice.name,
      "--rate",
      productionManifest.voice.rate,
      "--pitch",
      productionManifest.voice.pitch,
      "--output-audio",
      outputAudio,
      "--output-meta",
      outputMeta,
    ]);

    const audioRaw = await fs.readFile(outputMeta, "utf-8");
    const audioAsset = JSON.parse(audioRaw) as AudioAsset;
    audioAssets.push(audioAsset);
  }

  const nextManifest: RenderManifest = {
    ...renderManifest,
    audioAssets,
  };

  await fs.writeFile(renderManifestPath, JSON.stringify(nextManifest, null, 2), "utf-8");
  console.log(
    `${mockMode ? "Mock audio assets" : "Audio assets"} written into ${renderManifestPath}`,
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
