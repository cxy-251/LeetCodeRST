import fs from "node:fs/promises";
import path from "node:path";
import {
  createRunContextFromManifest,
  writeLatestRun,
  writeRunSummary,
} from "./lib/run-artifacts";
import type {
  ProductionManifest,
  RenderManifest,
  RenderScene,
  SceneTiming,
  SubtitleSegment,
} from "@paper-to-video/shared-types";

const DEFAULT_INPUT = path.resolve("data/manifests/demo-paper.json");
const DEFAULT_OUTPUT = path.resolve("data/generated-meta/demo-paper-001.render.json");

const msToFrames = (ms: number, fps: number) => Math.max(1, Math.round((ms / 1000) * fps));

const estimateSceneDurationMs = (text: string) => {
  const estimatedNarration = Math.max(1800, text.trim().length * 240);
  return Math.max(2500, estimatedNarration + 700);
};

const buildContent = (scene: ProductionManifest["scenes"][number]) => {
  if (scene.content) {
    return scene.content;
  }

  switch (scene.type) {
    case "hero":
      return {
        title: "这篇论文到底解决了什么问题？",
        body: scene.narrationText,
      };
    case "paper-intro":
      return {
        title: "论文背景",
        body: scene.narrationText,
      };
    case "summary":
      return {
        title: "核心总结",
        body: scene.narrationText,
      };
    case "ending":
      return {
        title: "结论",
        body: scene.narrationText,
      };
    default:
      return {
        title: scene.id,
        body: scene.narrationText,
      };
  }
};

const buildSubtitles = (
  sceneId: string,
  fromFrame: number,
  narrationText: string,
  durationInFrames: number,
) => {
  const parts = narrationText
    .split(/[。！？!?]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const safeParts = parts.length > 0 ? parts : [narrationText.trim()];
  const segmentFrames = Math.max(1, Math.floor(durationInFrames / safeParts.length));

  return safeParts.map<SubtitleSegment>((text, index) => {
    const startFrame = fromFrame + index * segmentFrames;
    const endFrame =
      index === safeParts.length - 1 ? fromFrame + durationInFrames : startFrame + segmentFrames;

    return {
      id: `${sceneId}-subtitle-${index + 1}`,
      sceneId,
      text,
      startFrame,
      endFrame,
      emphasisLevel: index === 0 ? 2 : 1,
    };
  });
};

const main = async () => {
  const args = process.argv.slice(2);
  const requestedRunIdIndex = args.indexOf("--run-id");
  const requestedRunId =
    requestedRunIdIndex >= 0 && args[requestedRunIdIndex + 1]
      ? args[requestedRunIdIndex + 1]
      : undefined;
  const positionalArgs = args.filter((arg, index) => {
    if (requestedRunIdIndex < 0) {
      return true;
    }

    return index !== requestedRunIdIndex && index !== requestedRunIdIndex + 1;
  });
  const input = positionalArgs[0] ? path.resolve(positionalArgs[0]) : DEFAULT_INPUT;
  const output = positionalArgs[1] ? path.resolve(positionalArgs[1]) : undefined;
  const raw = await fs.readFile(input, "utf-8");
  const manifest = JSON.parse(raw) as ProductionManifest;
  const runContext = await createRunContextFromManifest(manifest, requestedRunId);

  let cursor = 0;
  const scenes: RenderScene[] = [];
  const subtitleSegments: SubtitleSegment[] = [];

  for (const scene of manifest.scenes) {
    const sceneDurationMs =
      scene.durationStrategy === "fixed" && scene.fixedDurationMs
        ? scene.fixedDurationMs
        : estimateSceneDurationMs(scene.narrationText);

    const durationInFrames = msToFrames(sceneDurationMs, manifest.output.fps);
    const enterFrames = Math.min(12, Math.max(8, Math.floor(durationInFrames * 0.12)));
    const exitFrames = Math.min(12, Math.max(8, Math.floor(durationInFrames * 0.08)));
    const timing: SceneTiming = {
      enterFrames,
      holdFrames: Math.max(1, durationInFrames - enterFrames - exitFrames),
      exitFrames,
      audioOffsetFrames: 0,
    };

    const renderScene: RenderScene = {
      id: scene.id,
      type: scene.type,
      fromFrame: cursor,
      durationInFrames,
      backgroundPresetId: scene.backgroundPresetId,
      motionPresetId: scene.motionPresetId,
      imageAssetIds: scene.imageAssetId ? [scene.imageAssetId] : [],
      audioSegmentIds: [`audio-${scene.id}`],
      subtitleSegmentIds: [],
      content: buildContent(scene),
      timing,
    };

    const sceneSubtitles = buildSubtitles(
      scene.id,
      renderScene.fromFrame,
      scene.narrationText,
      renderScene.durationInFrames,
    );
    renderScene.subtitleSegmentIds = sceneSubtitles.map((segment) => segment.id);
    subtitleSegments.push(...sceneSubtitles);
    scenes.push(renderScene);
    cursor += durationInFrames;
  }

  const renderManifest: RenderManifest = {
    projectId: manifest.projectId,
    seed: manifest.seed,
    fps: manifest.output.fps,
    width: manifest.output.width,
    height: manifest.output.height,
    totalFrames: cursor,
    coverImage: manifest.coverImage,
    paper: manifest.paper,
    theme: manifest.theme,
    voice: manifest.voice,
    scenes,
    audioAssets: [],
    imageAssets: [],
    subtitleSegments,
  };

  await fs.writeFile(
    runContext.productionManifestPath,
    JSON.stringify(manifest, null, 2),
    "utf-8",
  );

  const finalOutput = output ?? runContext.renderManifestPath;
  await fs.mkdir(path.dirname(finalOutput), {recursive: true});
  await fs.writeFile(finalOutput, JSON.stringify(renderManifest, null, 2), "utf-8");

  if (finalOutput !== runContext.renderManifestPath) {
    await fs.writeFile(runContext.renderManifestPath, JSON.stringify(renderManifest, null, 2), "utf-8");
  }

  await writeLatestRun(runContext);
  await writeRunSummary(runContext, {
    projectId: manifest.projectId,
    runId: runContext.runId,
    sourceManifestPath: input,
    productionManifestPath: runContext.productionManifestPath,
    renderManifestPath: runContext.renderManifestPath,
    stage: "manifest-composed",
  });

  console.log(`Run ${runContext.runId} manifest written to ${runContext.renderManifestPath}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
