import type {
  BackgroundMotionConfig,
  CellularEffectConfig,
  TextMotionConfig,
  TextMotionId,
  TypographyScaleConfig,
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
  cellPadding: 0.5,
  cornerRadius: 0.45,
  edgeMode: "wrap",
  primaryColor: "#79f7d4",
  secondaryColor: "#f8fbff",
  birthColor: "#2fb4ff",
  launchClickRatio: 0.22,
  launchSettleRatio: 0.03,
  minLaunchClickFrames: 8,
  maxLaunchClickFrames: 28,
  minLaunchSettleFrames: 2,
  maxLaunchSettleFrames: 8,
};

export const DEFAULT_TYPOGRAPHY_SCALE: TypographyScaleConfig = {
  kickerSize: "clamp(0.86rem, 1.1vw + 0.5rem, 1.6rem)",
  titleSize: "clamp(2.35rem, 4.9vw + 0.6rem, 5.4rem)",
  bodySize: "clamp(1.16rem, 1.9vw + 0.54rem, 2.35rem)",
  bulletSize: "clamp(1.08rem, 1.7vw + 0.5rem, 2.08rem)",
  subtitleSize: "clamp(1.08rem, 1.48vw + 0.52rem, 1.92rem)",
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

export const resolveTypographyScaleConfig = (
  modules?: VisualModuleConfig,
): TypographyScaleConfig => {
  return {
    ...DEFAULT_TYPOGRAPHY_SCALE,
    ...(modules?.typography ?? {}),
  };
};
