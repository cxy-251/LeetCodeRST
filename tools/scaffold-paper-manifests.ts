import fs from "node:fs/promises";
import path from "node:path";
import {slugify} from "./lib/run-artifacts";
import type {ProductionManifest} from "@paper-to-video/shared-types";

type SourceBundle = {
  papers: Array<{
    arxivId: string;
    title: string;
    summary: string;
    categories: string[];
    publishedAt: string;
    localPdfPath: string;
    localTextPath?: string;
    suggestedCoverImagePath: string | null;
  }>;
};

const INPUT_PATH = path.resolve("data/source-bundles/latest-ai-batch.json");
const OUTPUT_DIR = path.resolve("data/manifests/ingest");

const sentenceParts = (text: string) =>
  text
    .split(/(?<=[.?!])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

const takeSentences = (text: string, count: number) => sentenceParts(text).slice(0, count).join(" ");

const buildManifest = (paper: SourceBundle["papers"][number], index: number): ProductionManifest => {
  const shortSummary = takeSentences(paper.summary, 3) || paper.summary;
  const hook = takeSentences(paper.summary, 1) || paper.title;
  const ending = `如果你在关注 ${paper.categories.join(" / ")} 方向，这篇 ${paper.arxivId} 值得进一步展开。`;

  return {
    projectId: `arxiv-${paper.arxivId.replace(/[^\w]+/g, "-").toLowerCase()}`,
    seed: 100 + index,
    locale: "zh-CN",
    template: {
      id: "paper-digest-v1",
      path: "data/templates/paper-digest-v1.json",
    },
    coverImage: paper.suggestedCoverImagePath
      ? {
          source: "local",
          path: path.relative(path.resolve("."), paper.suggestedCoverImagePath),
          alt: paper.title,
        }
      : undefined,
    output: {
      width: 1080,
      height: 1920,
      fps: 30,
      platform: "douyin",
    },
    paper: {
      source: "arxiv",
      paperId: paper.arxivId,
      title: paper.title,
      pdfUrl: `https://arxiv.org/pdf/${paper.arxivId}.pdf`,
      localPdfPath: paper.localPdfPath,
      categories: paper.categories,
      publishedAt: paper.publishedAt,
    },
    theme: {
      id: "clean-tech",
      paletteId: "teal-slate",
      fontPackId: "modern-cn",
    },
    voice: {
      provider: "edge-tts",
      name: "zh-CN-XiaoxiaoNeural",
      rate: "+80%",
      pitch: "+0Hz",
    },
    effectProfile: {
      id: index % 2 === 0 ? "life-game" : "snake-grid",
    },
    modules: {
      backgroundMotion: {
        overscanPercent: 36,
        panTravelPercent: 0.82,
      },
      cellularEffect: {
        cellColumns: 44,
        cellRows: 78,
        stepEveryFrames: 2,
        cellPadding: 0.5,
        cornerRadius: 0.45,
        edgeMode: "wrap",
        primaryColor: "#b6ffea",
        secondaryColor: "#fffaf1",
        birthColor: "#addcff",
        launchClickRatio: 0.22,
        launchSettleRatio: 0,
        minLaunchClickFrames: 8,
        maxLaunchClickFrames: 28,
        minLaunchSettleFrames: 0,
        maxLaunchSettleFrames: 1,
      },
      typography: {
        kickerSize: "clamp(0.88rem, 1.15vw + 0.5rem, 1.62rem)",
        titleSize: "clamp(2.52rem, 5.15vw + 0.74rem, 5.72rem)",
        bodySize: "clamp(1.22rem, 2vw + 0.56rem, 2.48rem)",
        bulletSize: "clamp(1.12rem, 1.82vw + 0.54rem, 2.16rem)",
        subtitleSize: "clamp(1.14rem, 1.55vw + 0.56rem, 1.98rem)",
      },
    },
    scenes: [
      {
        id: "scene-hero",
        type: "hero",
        contentRef: "hook",
        narrationText: hook,
        content: {
          title: paper.title,
          body: `arXiv ${paper.arxivId}`,
        },
        backgroundPresetId: "aurora",
        backgroundImageLayoutId: "cover-full",
        backgroundEffectId: "aurora",
        motionPresetId: "fade-up",
        durationStrategy: "auto-by-audio",
      },
      {
        id: "scene-problem",
        type: "paper-intro",
        contentRef: "problem",
        narrationText: shortSummary,
        content: {
          title: "论文核心摘要",
          body: takeSentences(shortSummary, 2),
        },
        backgroundPresetId: "cover-grid-drift",
        backgroundImageLayoutId: "cover-focus-tl",
        backgroundEffectId: "cellular-launch",
        motionPresetId: "slide-up",
        durationStrategy: "auto-by-audio",
      },
      {
        id: "scene-method",
        type: "summary",
        contentRef: "method",
        narrationText: shortSummary,
        content: {
          title: "关键信息",
          bullets: sentenceParts(shortSummary).slice(0, 3),
        },
        backgroundPresetId: "cover-cellular-mask",
        backgroundImageLayoutId: "cover-focus-tr",
        backgroundEffectId: "cellular-life",
        motionPresetId: "fade-up",
        durationStrategy: "auto-by-audio",
      },
      {
        id: "scene-ending",
        type: "ending",
        contentRef: "ending",
        narrationText: ending,
        content: {
          title: "一句话结论",
          body: ending,
        },
        backgroundPresetId: "cover-soft-focus",
        backgroundImageLayoutId: "cover-focus-bl",
        backgroundEffectId: "cellular-life",
        motionPresetId: "fade-up",
        durationStrategy: "auto-by-audio",
      },
    ],
  };
};

const main = async () => {
  const bundle = JSON.parse(await fs.readFile(INPUT_PATH, "utf-8")) as SourceBundle;
  await fs.mkdir(OUTPUT_DIR, {recursive: true});

  for (const [index, paper] of bundle.papers.entries()) {
    const manifest = buildManifest(paper, index);
    const outputPath = path.join(OUTPUT_DIR, `${slugify(manifest.projectId)}.json`);
    await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2), "utf-8");
  }

  console.log(`Scaffolded ${bundle.papers.length} manifests into ${OUTPUT_DIR}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
