export type PaperSource = {
  id: string;
  source: "arxiv";
  arxivId: string;
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  pdfUrl?: string;
  publishedAt?: string;
  fetchedAt: string;
};

export type ContentSection = {
  id: string;
  heading: string;
  narration: string;
  slideBullets: string[];
  imagePrompt: string;
};

export type ContentBrief = {
  projectId: string;
  sourcePaperId: string;
  language: "zh-CN";
  summary: {
    oneLiner: string;
    shortSummary: string;
    keyTakeaways: string[];
  };
  script: {
    hook: string;
    sections: ContentSection[];
    ending: string;
  };
};

export type ProductionScene = {
  id: string;
  type:
    | "hero"
    | "paper-intro"
    | "summary"
    | "bullet"
    | "image-focus"
    | "quote"
    | "ending";
  contentRef: string;
  narrationText: string;
  imagePrompt?: string;
  imageAssetId?: string;
  backgroundPresetId: string;
  motionPresetId: string;
  durationStrategy: "auto-by-audio" | "fixed";
  fixedDurationMs?: number;
};

export type ProductionManifest = {
  projectId: string;
  seed: number;
  locale: "zh-CN";
  output: {
    width: number;
    height: number;
    fps: number;
    platform: "douyin" | "xiaohongshu" | "bilibili-short";
  };
  paper: {
    source: "arxiv";
    paperId: string;
    title: string;
  };
  theme: {
    id: string;
    paletteId: string;
    fontPackId: string;
  };
  voice: {
    provider: "edge-tts";
    name: string;
    rate: string;
    pitch: string;
    volume?: string;
  };
  scenes: ProductionScene[];
};
