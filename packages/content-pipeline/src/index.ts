import type {RenderScene} from "@paper-to-video/shared-types";
export {
  buildCellularLifeCells,
  getCoverLayoutConfig,
  getCellularLaunchOrigin,
  getInterpolatedCoverLayoutConfig,
  getSceneVisualIds,
  resolveSceneBackgroundEffectId,
  resolveSceneBackgroundImageLayoutId,
} from "./visual-system";
export {
  DEFAULT_BACKGROUND_MOTION,
  DEFAULT_CELLULAR_EFFECT,
  DEFAULT_TEXT_MOTIONS,
  DEFAULT_TYPOGRAPHY_SCALE,
  resolveBackgroundMotionConfig,
  resolveCellularEffectConfig,
  resolveTextMotionConfig,
  resolveTypographyScaleConfig,
} from "./module-api";
export {getTextMotionState} from "./text-motion";
export {ThreeLifeEffect} from "./three-life-effect";
export {EFFECT_ATOMS, getEffectAtomDefinition} from "./effect-atoms";
export type {EffectAtomDefinition, EffectAtomId, EffectAtomRuntimeProps} from "./effect-atoms.types";
export {EffectRuntimeAdapter} from "./effect-runtime";
export type {EffectRuntimeAdapterProps, EffectRuntimeMode} from "./effect-runtime";
export {
  resolveLaunchCueOffsets,
  resolveLifeGameActivationFrame,
  resolveLifeGameInteractionFrame,
  resolveContinuousEffectId,
} from "./effect-timing";

export type ThemePalette = {
  bg: string;
  fg: string;
  accent: string;
  panel: string;
};

export const getThemePalette = (themeId: string): ThemePalette => {
  const presets: Record<string, ThemePalette> = {
    "clean-tech": {
      bg: "#07111f",
      fg: "#f4f7fb",
      accent: "#57d8c4",
      panel: "rgba(5, 13, 24, 0.55)",
    },
  };

  return presets[themeId] ?? presets["clean-tech"];
};

export const getSceneTitle = (scene: RenderScene) => {
  if (typeof scene.content.title === "string") {
    return scene.content.title;
  }

  if (typeof scene.content.heading === "string") {
    return scene.content.heading;
  }

  return "PaperToVideo";
};

export const getSceneBody = (scene: RenderScene) => {
  if (typeof scene.content.body === "string") {
    return scene.content.body;
  }

  return "";
};

export const getSceneBullets = (scene: RenderScene) => {
  if (Array.isArray(scene.content.bullets)) {
    return scene.content.bullets.filter((item): item is string => typeof item === "string");
  }

  return [];
};
