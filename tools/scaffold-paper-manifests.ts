import fs from "node:fs/promises";
import path from "node:path";
import {buildDisplayScriptDraft} from "../services/summarizer/display-copy.service";
import {slugify} from "./lib/run-artifacts";
import type {ContentProfileDocument, ProductionManifest} from "@paper-to-video/shared-types";

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
    abstractSentences?: string[];
    sectionHeadings?: string[];
    scriptDraft?: {
      hook: string;
      problem: string;
      method: string;
      value: string;
      ending: string;
      bullets: string[];
    };
  }>;
};

const DEFAULT_INPUT_PATH = path.resolve("data/source-bundles/latest-ai-analysis.json");
const DEFAULT_OUTPUT_DIR = path.resolve("data/manifests/ingest");
const DEFAULT_CONTENT_PROFILE_DIR = path.resolve("data/content-profiles/generated");

const trimByChars = (value: string, limit: number) =>
  value.length <= limit ? value : value.slice(0, limit).replace(/[，、；：,.!?！？]+$/u, "").trim();

const buildHookTitle = (body: string, fallback: string) => {
  const source = `${body} ${fallback}`;
  if (/准确率/u.test(source) && /安全|高风险/u.test(source)) {
    return "高准确率不等于更安全";
  }

  if (/world model/i.test(source)) {
    return "World Model 不是一个词";
  }

  if (/不可判定|通用解|plan existence/i.test(source)) {
    return "这类规划题天生无通解";
  }

  const prefix = body.split(" ")[0]?.trim() ?? "";
  if (prefix && prefix.length >= 6 && prefix.length <= 18) {
    return prefix;
  }

  const firstSentence = body
    .split(/[。！？]/u)
    .map((item) => item.trim())
    .filter(Boolean)[0];

  const candidate = firstSentence || fallback;
  return trimByChars(candidate.replace(/\s+/g, " ").trim(), 22);
};

const stripHookTitlePrefix = (body: string, title: string) => {
  const normalizedBody = body.replace(/\s+/g, " ").trim();
  if (normalizedBody.startsWith(`${title} `)) {
    return normalizedBody.slice(title.length).trim();
  }

  return normalizedBody;
};

const buildContentProfile = (paper: SourceBundle["papers"][number]): ContentProfileDocument => {
  const draft = paper.scriptDraft ?? {
    hook: paper.summary,
    problem: paper.summary,
    method: paper.summary,
    value: paper.summary,
    ending: `如果你在关注 ${paper.categories.join(" / ")} 方向，这篇 ${paper.arxivId} 值得进一步展开。`,
    bullets: [paper.summary],
  };
  const displayDraft = buildDisplayScriptDraft({
    paper: {
      arxivId: paper.arxivId,
      title: paper.title,
      summary: paper.summary,
      categories: paper.categories,
      publishedAt: paper.publishedAt,
    },
    draft,
    context: {
      abstractSentences: paper.abstractSentences ?? [],
      sectionHeadings: paper.sectionHeadings ?? [],
    },
  });
  const hookTitle = buildHookTitle(displayDraft.hook.body, draft.hook);

  return {
    id: `arxiv-${paper.arxivId.replace(/[^\w]+/g, "-").toLowerCase()}`,
    paper: {
      source: "arxiv",
      paperId: paper.arxivId,
      title: paper.title,
      pdfUrl: `https://arxiv.org/pdf/${paper.arxivId}.pdf`,
      localPdfPath: paper.localPdfPath,
      categories: paper.categories,
      publishedAt: paper.publishedAt,
    },
    scenes: {
      hook: {
        narrationText: draft.hook,
        content: {
          kicker: paper.title,
          title: hookTitle,
          body: stripHookTitlePrefix(displayDraft.hook.body, hookTitle),
        },
      },
      problem: {
        narrationText: draft.problem,
        content: {
          title: "这篇论文在解决什么？",
          body: displayDraft.problem.body,
          bullets: displayDraft.problem.bullets,
        },
      },
      method: {
        narrationText: draft.method,
        content: {
          title: "核心方法",
          body: displayDraft.method.body,
          bullets: displayDraft.method.bullets,
        },
      },
      value: {
        narrationText: draft.value,
        content: {
          title: "技术价值",
          body: displayDraft.value.body,
          bullets: displayDraft.value.bullets,
        },
      },
      ending: {
        narrationText: draft.ending,
        content: {
          title: "一句话结论",
          body: displayDraft.ending.body,
        },
      },
    },
  };
};

const buildManifest = (
  paper: SourceBundle["papers"][number],
  index: number,
  contentProfileDir: string,
): ProductionManifest => {
  const profileId = `arxiv-${paper.arxivId.replace(/[^\w]+/g, "-").toLowerCase()}`;

  return {
    projectId: profileId,
    seed: 100 + index,
    locale: "zh-CN",
    template: {
      id: "paper-digest-v1",
      path: "data/templates/paper-digest-v1.json",
    },
    contentProfile: {
      id: profileId,
      path: path.relative(path.resolve("."), path.join(contentProfileDir, `${profileId}.json`)),
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
        bodySize: "clamp(1.02rem, 1.7vw + 0.5rem, 2.08rem)",
        bulletSize: "clamp(0.94rem, 1.45vw + 0.48rem, 1.78rem)",
        subtitleSize: "clamp(1.14rem, 1.55vw + 0.56rem, 1.98rem)",
      },
    },
    scenes: [
      {
        id: "scene-hero",
        type: "hero",
        contentRef: "hook",
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
        backgroundPresetId: "cover-cellular-mask",
        backgroundImageLayoutId: "cover-focus-tr",
        backgroundEffectId: "cellular-life",
        motionPresetId: "fade-up",
        durationStrategy: "auto-by-audio",
      },
      {
        id: "scene-value",
        type: "bullet",
        contentRef: "value",
        backgroundPresetId: "cover-cellular-mask",
        backgroundImageLayoutId: "cover-focus-br",
        backgroundEffectId: "cellular-life",
        motionPresetId: "stagger-rise",
        durationStrategy: "auto-by-audio",
      },
      {
        id: "scene-ending",
        type: "ending",
        contentRef: "ending",
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
  const args = process.argv.slice(2);
  const take = (flag: string) => {
    const index = args.indexOf(flag);
    return index >= 0 ? args[index + 1] : undefined;
  };

  const inputPath = take("--input") ? path.resolve(take("--input") as string) : DEFAULT_INPUT_PATH;
  const outputDir = take("--output-dir") ? path.resolve(take("--output-dir") as string) : DEFAULT_OUTPUT_DIR;
  const contentProfileDir = take("--content-profile-dir")
    ? path.resolve(take("--content-profile-dir") as string)
    : DEFAULT_CONTENT_PROFILE_DIR;

  const bundle = JSON.parse(await fs.readFile(inputPath, "utf-8")) as SourceBundle;
  await fs.mkdir(outputDir, {recursive: true});
  await fs.mkdir(contentProfileDir, {recursive: true});

  for (const [index, paper] of bundle.papers.entries()) {
    const contentProfile = buildContentProfile(paper);
    const manifest = buildManifest(paper, index, contentProfileDir);
    const contentProfilePath = path.join(contentProfileDir, `${slugify(manifest.projectId)}.json`);
    const outputPath = path.join(outputDir, `${slugify(manifest.projectId)}.json`);
    await fs.writeFile(contentProfilePath, JSON.stringify(contentProfile, null, 2), "utf-8");
    await fs.writeFile(outputPath, JSON.stringify(manifest, null, 2), "utf-8");
  }

  console.log(`Scaffolded ${bundle.papers.length} manifests into ${outputDir}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
