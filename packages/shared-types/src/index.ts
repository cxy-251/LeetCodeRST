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

export type BackgroundImageLayoutId =
  | "gradient-default"
  | "cover-full"
  | "cover-focus-tl"
  | "cover-focus-tr"
  | "cover-focus-br"
  | "cover-focus-bl";

export type BackgroundEffectId =
  | "none"
  | "aurora"
  | "grid-drift"
  | "noise-bloom"
  | "cellular-launch"
  | "cellular-life";

export type TextMotionId = "fade-up" | "slide-up" | "stagger-rise" | "hard-cut";

export type TextMotionConfig = {
  enterFrames: number;
  maxLiftPx: number;
  minOpacity: number;
  bodyDelayFrames: number;
  bulletsStaggerFrames: number;
};

export type BackgroundMotionConfig = {
  overscanPercent: number;
  panTravelPercent: number;
};

export type CellularEffectConfig = {
  cellColumns: number;
  cellRows: number;
  stepEveryFrames: number;
  activationDelayFrames: number;
  cellPadding: number;
  cornerRadius: number;
  edgeMode: "wrap";
};

export type VisualModuleConfig = {
  textMotions?: Partial<Record<TextMotionId, Partial<TextMotionConfig>>>;
  backgroundMotion?: Partial<BackgroundMotionConfig>;
  cellularEffect?: Partial<CellularEffectConfig>;
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
  content?: Record<string, unknown>;
  imagePrompt?: string;
  imageAssetId?: string;
  backgroundPresetId: string;
  backgroundImageLayoutId?: BackgroundImageLayoutId;
  backgroundEffectId?: BackgroundEffectId;
  motionPresetId: TextMotionId;
  durationStrategy: "auto-by-audio" | "fixed";
  fixedDurationMs?: number;
};

export type ProductionManifest = {
  projectId: string;
  seed: number;
  locale: "zh-CN";
  coverImage?: {
    source: "local" | "remote";
    path: string;
    alt?: string;
  };
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
  modules?: VisualModuleConfig;
  scenes: ProductionScene[];
};

export type ImageAsset = {
  id: string;
  prompt: string;
  localPath: string;
  provider: string;
  width?: number;
  height?: number;
  styleTag?: string;
};

export type CoverImageAsset = {
  source: "local" | "remote";
  path: string;
  alt?: string;
};

export type AudioSegment = {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  role: "narration" | "subtitle";
};

export type AudioAsset = {
  id: string;
  filePath: string;
  durationMs: number;
  sceneId: string;
  segments: AudioSegment[];
};

export type SubtitleSegment = {
  id: string;
  sceneId: string;
  text: string;
  startFrame: number;
  endFrame: number;
  emphasisLevel?: number;
};

export type SceneTiming = {
  enterFrames: number;
  holdFrames: number;
  exitFrames: number;
  audioOffsetFrames: number;
};

export type RenderScene = {
  id: string;
  type: ProductionScene["type"];
  fromFrame: number;
  durationInFrames: number;
  backgroundPresetId: string;
  backgroundImageLayoutId: BackgroundImageLayoutId;
  backgroundEffectId: BackgroundEffectId;
  motionPresetId: TextMotionId;
  imageAssetIds: string[];
  audioSegmentIds: string[];
  subtitleSegmentIds: string[];
  content: Record<string, unknown>;
  timing: SceneTiming;
};

export type RenderManifest = {
  projectId: string;
  seed: number;
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  coverImage?: CoverImageAsset;
  paper: ProductionManifest["paper"];
  theme: ProductionManifest["theme"];
  voice: ProductionManifest["voice"];
  modules?: VisualModuleConfig;
  scenes: RenderScene[];
  audioAssets: AudioAsset[];
  imageAssets: ImageAsset[];
  subtitleSegments: SubtitleSegment[];
};
