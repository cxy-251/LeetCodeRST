import type {
  BackgroundMotionConfig,
  CellularEffectConfig,
  ParticleEffectConfig,
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
  cellScale: 1,
  cornerRadius: 0.45,
  edgeMode: "wrap",
  colorPreset: "mint-ice",
  primaryColor: "#a7ffe8",
  secondaryColor: "#fff8ec",
  birthColor: "#8fd2ff",
  launchClickRatio: 0.22,
  launchSettleRatio: 0,
  minLaunchClickFrames: 8,
  maxLaunchClickFrames: 28,
  minLaunchSettleFrames: 0,
  maxLaunchSettleFrames: 1,
};

export const DEFAULT_TYPOGRAPHY_SCALE: TypographyScaleConfig = {
  kickerSize: "clamp(0.86rem, 1.1vw + 0.5rem, 1.6rem)",
  titleSize: "clamp(2.35rem, 4.9vw + 0.6rem, 5.4rem)",
  bodySize: "clamp(1.16rem, 1.9vw + 0.54rem, 2.35rem)",
  bulletSize: "clamp(1.08rem, 1.7vw + 0.5rem, 2.08rem)",
  subtitleSize: "clamp(1.08rem, 1.48vw + 0.52rem, 1.92rem)",
};

export const DEFAULT_PARTICLE_EFFECT: ParticleEffectConfig = {
  variant: "nebula",
  shape: "circle",
  distribution: "core",
  trajectory: "orbit",
  particleCount: 520,
  pointSize: 3.6,
  orbitRadius: 0.22,
  swirlStrength: 0.16,
  driftSpeed: 0.01,
  layerDepth: 6,
  primaryColor: "#74f3d8",
  secondaryColor: "#7dbdff",
  accentColor: "#ffc0dc",
};

const CELLULAR_COLOR_PRESETS: Record<
  CellularEffectConfig["colorPreset"],
  Pick<CellularEffectConfig, "primaryColor" | "secondaryColor" | "birthColor">
> = {
  "mint-ice": {
    primaryColor: "#a7ffe8",
    secondaryColor: "#fff8ec",
    birthColor: "#8fd2ff",
  },
  "sunset-pop": {
    primaryColor: "#ffb77d",
    secondaryColor: "#fff0d9",
    birthColor: "#ff7fb3",
  },
  "violet-cyan": {
    primaryColor: "#9c9bff",
    secondaryColor: "#defdff",
    birthColor: "#67f1ff",
  },
};

const PARTICLE_VARIANTS: Record<
  ParticleEffectConfig["variant"],
  Partial<ParticleEffectConfig>
> = {
  nebula: {
    shape: "circle",
    distribution: "core",
    trajectory: "orbit",
    particleCount: 520,
    pointSize: 3.6,
    orbitRadius: 0.22,
    swirlStrength: 0.16,
    driftSpeed: 0.01,
    layerDepth: 6,
    primaryColor: "#74f3d8",
    secondaryColor: "#7dbdff",
    accentColor: "#ffc0dc",
  },
  vortex: {
    shape: "diamond",
    distribution: "spiral",
    trajectory: "orbit",
    particleCount: 640,
    pointSize: 2.8,
    orbitRadius: 0.26,
    swirlStrength: 0.32,
    driftSpeed: 0.013,
    layerDepth: 8,
    primaryColor: "#6cf1ff",
    secondaryColor: "#f2f7ff",
    accentColor: "#8d8cff",
  },
  comet: {
    shape: "square",
    distribution: "halo",
    trajectory: "drift",
    particleCount: 420,
    pointSize: 3.2,
    orbitRadius: 0.3,
    swirlStrength: 0.08,
    driftSpeed: 0.016,
    layerDepth: 10,
    primaryColor: "#fff0c2",
    secondaryColor: "#ffb5d0",
    accentColor: "#86cbff",
  },
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
  const overrides = modules?.cellularEffect ?? {};
  const colorPreset = overrides.colorPreset ?? DEFAULT_CELLULAR_EFFECT.colorPreset;
  return {
    ...DEFAULT_CELLULAR_EFFECT,
    ...CELLULAR_COLOR_PRESETS[colorPreset],
    ...overrides,
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

export const resolveParticleEffectConfig = (
  modules?: VisualModuleConfig,
): ParticleEffectConfig => {
  const overrides = modules?.particleEffect ?? {};
  const variant = overrides.variant ?? DEFAULT_PARTICLE_EFFECT.variant;
  return {
    ...DEFAULT_PARTICLE_EFFECT,
    ...PARTICLE_VARIANTS[variant],
    ...overrides,
  };
};
