import React from "react";
import {
  getCoverLayoutConfig,
  getEffectAtomDefinition,
  getInterpolatedCoverLayoutConfig,
  getSceneTitle,
  getSceneVisualIds,
  getThemePalette,
  resolveBackgroundMotionConfig,
  resolveTextMotionConfig,
} from "@paper-to-video/content-pipeline";
import {renderTemplateZone} from "@paper-to-video/timeline-engine";
import type {BackgroundEffectId, RenderManifest, RenderScene} from "@paper-to-video/shared-types";
import type {
  CoverLayoutConfig,
  EffectLayoutResolution,
  EffectRoute,
  LayoutResolution,
  LegacyRedirectMap,
  RouteCollections,
  RouteLookup,
  TemplateLayoutInput,
  TemplateRoute,
  TemplateStageInput,
} from "./App.types";

declare const __LATEST_RUN_FILE__: string;
declare const __DEFAULT_RENDER_MANIFEST__: string;
declare const __WORKSPACE_ROOT__: string;

const fetchJson = async <T,>(absolutePath: string) => {
  const response = await fetch(`/@fs${absolutePath}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${absolutePath}: ${response.status}`);
  }

  return (await response.json()) as T;
};

export const buildLocalAssetSrc = (relativePath?: string) => {
  if (!relativePath) {
    return null;
  }

  return `/@fs${__WORKSPACE_ROOT__}/${relativePath}`;
};

export const loadLatestManifest = async () => {
  const latestRun = await fetchJson<{
    renderManifestPath: string;
  }>(__LATEST_RUN_FILE__);

  return fetchJson<RenderManifest>(latestRun.renderManifestPath);
};

export const loadDefaultManifest = async () => fetchJson<RenderManifest>(__DEFAULT_RENDER_MANIFEST__);

export const templateRoutes: TemplateRoute[] = [
  {
    id: "latest-run",
    href: "/templates/latest",
    title: "Latest Run Template",
    description: "读取 output/latest-run.json 指向的最新产物，用来验证本地案例和最新模板编排。",
    loadManifest: loadLatestManifest,
  },
  {
    id: "repo-demo",
    href: "/templates/demo",
    title: "Repository Demo Template",
    description: "读取仓库内默认 render manifest，作为稳定基线模板案例。",
    loadManifest: loadDefaultManifest,
  },
];

export const effectRoutes: EffectRoute[] = [
  {
    id: "effect-life-game",
    href: "/effects/life-game",
    title: "Life Game Effect",
    description: "单独查看可点击启动的生命游戏中间层原子，后续小游戏也沿这套接口扩展。",
    effectId: "cellular-life",
    source: "latest",
  },
  {
    id: "effect-snake-grid",
    href: "/effects/snake-grid",
    title: "Snake Grid Effect",
    description: "单独查看贪吃蛇网格型 WebGL 中间层原子，用于验证第二类小游戏动效接口。",
    effectId: "snake-grid",
    source: "latest",
  },
];

export const legacyRedirects: LegacyRedirectMap = {
  "/effects/cellular-launch": "/effects/life-game",
  "/effects/cellular-life": "/effects/life-game",
  "/effects/aurora": "/effects/life-game",
  "/previews/demo": "/templates/demo",
  "/previews/latest": "/templates/latest",
};

export const routeCollections: RouteCollections = {
  effectRoutes,
  templateRoutes,
};

export const resolveInitialPath = (pathname: string) => legacyRedirects[pathname] ?? pathname;

export const findRoutes = (pathname: string): RouteLookup => ({
  templateRoute: templateRoutes.find((route) => route.href === pathname) ?? null,
  effectRoute: effectRoutes.find((route) => route.href === pathname) ?? null,
});

export const formatSeconds = (frames: number, fps: number) => `${(frames / fps).toFixed(1)}s`;

export const findEffectScene = (manifest: RenderManifest, effectId: BackgroundEffectId): RenderScene => {
  const matched = manifest.scenes.find((scene) => getSceneVisualIds(scene).backgroundEffectId === effectId);
  return matched ?? manifest.scenes[0];
};

export const getCoverImageSrc = (manifest: RenderManifest) =>
  manifest.coverImage?.source === "remote"
    ? manifest.coverImage.path
    : buildLocalAssetSrc(manifest.coverImage?.path);

const resolveTemplateLayout = ({
  activeScene,
  manifest,
  previewFrame,
}: TemplateLayoutInput): LayoutResolution => {
  const palette = getThemePalette(manifest.theme.id);
  const {backgroundImageLayoutId, backgroundEffectId} = getSceneVisualIds(activeScene);
  const backgroundMotion = resolveBackgroundMotionConfig(manifest.modules);
  const textMotion = resolveTextMotionConfig(activeScene.motionPresetId, manifest.modules);
  const activeSceneIndex = manifest.scenes.findIndex((scene) => scene.id === activeScene.id);
  const previousScene = activeSceneIndex > 0 ? manifest.scenes[activeSceneIndex - 1] : null;
  const previousLayoutId = previousScene ? getSceneVisualIds(previousScene).backgroundImageLayoutId : "cover-full";
  const sceneDuration = Math.max(1, activeScene.durationInFrames);
  const sceneMotionProgress = previewFrame / sceneDuration;
  const visualLayout =
    previousLayoutId === backgroundImageLayoutId
      ? getCoverLayoutConfig(backgroundImageLayoutId, backgroundMotion.panTravelPercent)
      : getInterpolatedCoverLayoutConfig({
          fromLayoutId: previousLayoutId,
          toLayoutId: backgroundImageLayoutId,
          progress: Math.min(1, Math.max(0, sceneMotionProgress)),
          panTravelPercent: backgroundMotion.panTravelPercent,
        });
  const usesCoverImage = backgroundImageLayoutId !== "gradient-default";
  const stageBackground =
    usesCoverImage
      ? "linear-gradient(180deg, #050c13 0%, #071019 100%)"
      : `radial-gradient(circle at 20% 20%, ${palette.accent}33, transparent 28%), linear-gradient(135deg, ${palette.bg}, #10253a 48%, #081018)`;

  /**
   * We anchor template preview activation to the launch scene so the editor and
   * the final render use the same moment as the effect hand-off boundary.
   */
  const launchScene =
    manifest.scenes.find((scene) => getSceneVisualIds(scene).backgroundEffectId === "cellular-launch") ?? null;

  return {
    activationFrame: launchScene?.fromFrame ?? 0,
    backgroundEffectId,
    coverImageSrc: getCoverImageSrc(manifest),
    palette,
    stageBackground,
    textMotion,
    visualLayout,
  };
};

export const createTemplateStageModel = ({
  activeScene,
  activeSubtitles,
  manifest,
  previewFrame,
}: TemplateStageInput) => {
  const layout = resolveTemplateLayout({activeScene, manifest, previewFrame});
  const absolutePreviewFrame = activeScene.fromFrame + previewFrame;
  const primaryNodes = renderTemplateZone({
    zone: "primary",
    context: {
      manifest,
      scene: activeScene,
      coverSrc: layout.coverImageSrc,
      subtitleText: activeSubtitles[0]?.text ?? null,
    },
  });
  const secondaryNodes = renderTemplateZone({
    zone: "secondary",
    context: {
      manifest,
      scene: activeScene,
      coverSrc: layout.coverImageSrc,
      subtitleText: activeSubtitles[0]?.text ?? null,
    },
  });

  return {
    absolutePreviewFrame,
    activationFrame: layout.activationFrame,
    backgroundEffectId: layout.backgroundEffectId,
    coverImageSrc: layout.coverImageSrc,
    palette: layout.palette,
    primaryNodes,
    secondaryNodes,
    stageBackground: layout.stageBackground,
    textMotion: layout.textMotion,
    visualLayout: layout.visualLayout,
  };
};

export const createEffectStageModel = ({
  effectRoute,
  isRunning,
  manifest,
  scene,
  simulationFrame,
}: {
  effectRoute: EffectRoute;
  isRunning: boolean;
  manifest: RenderManifest;
  scene: RenderScene;
  simulationFrame: number;
}): EffectLayoutResolution => {
  const palette = getThemePalette(manifest.theme.id);
  const backgroundMotion = resolveBackgroundMotionConfig(manifest.modules);
  const visualLayout = getCoverLayoutConfig("cover-full", backgroundMotion.panTravelPercent);

  /**
   * The effect lab is an isolated sandbox. We intentionally decouple it from
   * scene timelines so a user click can deterministically start the simulation.
   */
  return {
    absolutePreviewFrame: isRunning ? simulationFrame : 0,
    activationFrame: 0,
    coverImageSrc: null,
    effectId: effectRoute.effectId,
    palette,
    stageBackground:
      "radial-gradient(circle at 50% 50%, rgba(87,216,196,0.12) 0%, transparent 26%), linear-gradient(180deg, #03070c 0%, #071019 100%)",
    visualLayout,
  };
};

export const getEffectDefinition = (effectId: EffectRoute["effectId"]) => getEffectAtomDefinition(effectId);

export const getSceneLabel = (scene: RenderScene) => getSceneTitle(scene);

export const isLoadingState = <T,>(value: T | null, errorMessage: string | null) => !value || Boolean(errorMessage);
