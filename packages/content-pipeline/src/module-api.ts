import type {
  BackgroundMotionConfig,
  CellularEffectConfig,
  TextMotionConfig,
  TextMotionId,
  VisualModuleConfig,
} from "@paper-to-video/shared-types";

export const DEFAULT_TEXT_MOTIONS: Record<TextMotionId, TextMotionConfig> = {
  "fade-up": {
    enterFrames: 12,
    maxLiftPx: 14,
    minOpacity: 0.28,
    bodyDelayFrames: 2,
    bulletsStaggerFrames: 3,
    exitFrames: 8,
    exitLiftPx: 10,
    exitOpacity: 0.72,
  },
  "slide-up": {
    enterFrames: 16,
    maxLiftPx: 24,
    minOpacity: 0.18,
    bodyDelayFrames: 3,
    bulletsStaggerFrames: 4,
    exitFrames: 10,
    exitLiftPx: 18,
    exitOpacity: 0.62,
  },
  "stagger-rise": {
    enterFrames: 18,
    maxLiftPx: 18,
    minOpacity: 0.2,
    bodyDelayFrames: 4,
    bulletsStaggerFrames: 5,
    exitFrames: 10,
    exitLiftPx: 16,
    exitOpacity: 0.6,
  },
  "hard-cut": {
    enterFrames: 2,
    maxLiftPx: 0,
    minOpacity: 1,
    bodyDelayFrames: 0,
    bulletsStaggerFrames: 0,
    exitFrames: 2,
    exitLiftPx: 0,
    exitOpacity: 1,
  },
};

export const DEFAULT_BACKGROUND_MOTION: BackgroundMotionConfig = {
  overscanPercent: 36,
  panTravelPercent: 0.82,
};

export const DEFAULT_CELLULAR_EFFECT: CellularEffectConfig = {
  cellColumns: 44,
  cellRows: 78,
  stepEveryFrames: 2,
  activationDelayFrames: 36,
  cellPadding: 0.5,
  cornerRadius: 0.45,
  edgeMode: "wrap",
};

export const resolveTextMotionConfig = (
  motionId: TextMotionId,
  modules?: VisualModuleConfig,
): TextMotionConfig => {
  return {
    ...DEFAULT_TEXT_MOTIONS[motionId],
    ...(modules?.textMotions?.[motionId] ?? {}),
  };
};

export const resolveBackgroundMotionConfig = (
  modules?: VisualModuleConfig,
): BackgroundMotionConfig => {
  return {
    ...DEFAULT_BACKGROUND_MOTION,
    ...(modules?.backgroundMotion ?? {}),
  };
};

export const resolveCellularEffectConfig = (
  modules?: VisualModuleConfig,
): CellularEffectConfig => {
  return {
    ...DEFAULT_CELLULAR_EFFECT,
    ...(modules?.cellularEffect ?? {}),
  };
};
