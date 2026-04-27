import type {
  BackgroundEffectId,
  BackgroundImageLayoutId,
  RenderManifest,
  RenderScene,
  SubtitleSegment,
  TextMotionConfig,
} from "@paper-to-video/shared-types";
import type {EffectAtomId, ThemePalette} from "@paper-to-video/content-pipeline";

export type TemplateRoute = {
  description: string;
  href: string;
  id: string;
  loadManifest: () => Promise<RenderManifest>;
  title: string;
};

export type EffectRoute = {
  description: string;
  effectId: EffectAtomId;
  href: string;
  id: string;
  source: "default" | "latest";
  title: string;
};

export type TemplatePreviewState = {
  activeScene: RenderScene | null;
  activeSceneId: string;
  activeSubtitles: SubtitleSegment[];
  errorMessage: string | null;
  loading: boolean;
  manifest: RenderManifest | null;
  previewFrame: number;
  setActiveSceneId: (sceneId: string) => void;
};

export type EffectPreviewState = {
  errorMessage: string | null;
  isRunning: boolean;
  loading: boolean;
  manifest: RenderManifest | null;
  resetSimulation: () => void;
  scene: RenderScene | null;
  setIsRunning: (isRunning: boolean) => void;
  simulationFrame: number;
};

export type TemplateStageModel = {
  absolutePreviewFrame: number;
  activationFrame: number;
  backgroundEffectId: BackgroundEffectId;
  coverImageSrc: string | null;
  palette: ThemePalette;
  primaryNodes: React.ReactNode[];
  secondaryNodes: React.ReactNode[];
  stageBackground: string;
  textMotion: TextMotionConfig;
  visualLayout: {
    blurPx: number;
    brightness: number;
    opacity: number;
    saturation: number;
    scale: number;
    shade: string;
    translateX: number;
    translateY: number;
  };
};

export type EffectStageModel = {
  absolutePreviewFrame: number;
  activationFrame: number;
  coverImageSrc: string | null;
  effectId: EffectAtomId;
  palette: ThemePalette;
  stageBackground: string;
  visualLayout: {
    blurPx: number;
    brightness: number;
    opacity: number;
    saturation: number;
    scale: number;
    shade: string;
    translateX: number;
    translateY: number;
  };
};

export type AppRouteState = {
  currentPath: string;
  effectRoute: EffectRoute | null;
  navigate: (href: string) => void;
  templateRoute: TemplateRoute | null;
};

export type PreviewStageProps = {
  absolutePreviewFrame: number;
  activationFrame: number;
  children?: React.ReactNode;
  coverImageSrc: string | null;
  effectId: BackgroundEffectId;
  effectLayer?: React.ReactNode;
  manifest: RenderManifest;
  palette: ThemePalette;
  previewFrame: number;
  stageBackground: string;
  visualLayout: {
    blurPx: number;
    brightness: number;
    opacity: number;
    saturation: number;
    scale: number;
    shade: string;
    translateX: number;
    translateY: number;
  };
};

export type RouteLookup = {
  effectRoute: EffectRoute | null;
  templateRoute: TemplateRoute | null;
};

export type LegacyRedirectMap = Record<string, string>;

export type CoverLayoutConfig = {
  blurPx: number;
  brightness: number;
  objectPosition: string;
  opacity: number;
  saturation: number;
  scale: number;
  shade: string;
  translateX: number;
  translateY: number;
};

export type TemplateStageInput = {
  activeScene: RenderScene;
  activeSubtitles: SubtitleSegment[];
  manifest: RenderManifest;
  previewFrame: number;
};

export type EffectStageInput = {
  effectRoute: EffectRoute;
  isRunning: boolean;
  manifest: RenderManifest;
  scene: RenderScene;
  simulationFrame: number;
};

export type TemplateLayoutInput = {
  activeScene: RenderScene;
  manifest: RenderManifest;
  previewFrame: number;
};

export type LayoutResolution = {
  activationFrame: number;
  backgroundEffectId: BackgroundEffectId;
  coverImageSrc: string | null;
  palette: ThemePalette;
  stageBackground: string;
  textMotion: TextMotionConfig;
  visualLayout: CoverLayoutConfig;
};

export type EffectLayoutResolution = {
  absolutePreviewFrame: number;
  activationFrame: number;
  coverImageSrc: string | null;
  effectId: EffectAtomId;
  palette: ThemePalette;
  stageBackground: string;
  visualLayout: CoverLayoutConfig;
};

export type SceneSelectionResult = {
  activeScene: RenderScene | null;
  activeSubtitles: SubtitleSegment[];
};

export type EffectSelectionResult = {
  scene: RenderScene | null;
};

export type TemplateRouteCollection = TemplateRoute[];
export type EffectRouteCollection = EffectRoute[];

export type RouteCollections = {
  effectRoutes: EffectRouteCollection;
  templateRoutes: TemplateRouteCollection;
};

export type PreviewFrameController = {
  frame: number;
  reset: () => void;
  setRunning: (nextValue: boolean) => void;
};

export type CoverLayoutResolver = (
  currentLayoutId: BackgroundImageLayoutId,
  previousLayoutId: BackgroundImageLayoutId,
  previewFrame: number,
  sceneDuration: number,
  panTravelPercent: number,
) => CoverLayoutConfig;
