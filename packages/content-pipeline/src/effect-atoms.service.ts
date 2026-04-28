import {getCellularLaunchOrigin} from "./visual-system";
import type {VisualModuleConfig} from "@paper-to-video/shared-types";
import type {EffectControlDefinition} from "./effect-atoms.types";

export const baseLayerStyle = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
} as const;

export const launchButtonBaseStyle = {
  position: "absolute",
  left: "50%",
  top: "50%",
  width: 260,
  marginLeft: -130,
  marginTop: -28,
  padding: "18px 22px",
  borderRadius: 999,
  border: "1px solid rgba(255, 255, 255, 0.16)",
  color: "#f4f7fb",
  fontSize: 15,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  textAlign: "center",
  boxShadow: "0 0 0 10px rgba(87, 216, 196, 0.08), 0 18px 48px rgba(0, 0, 0, 0.28)",
  zIndex: 2,
  cursor: "pointer",
} as const;

export const getLaunchButtonState = (frame: number) => {
  const buttonOrigin = getCellularLaunchOrigin();
  const pulse = 1 + Math.sin(frame / 7) * 0.04;

  return {
    buttonOrigin,
    pulse,
  };
};

export const getGridDriftBackground = (frame: number) => ({
  backgroundImage: `
    linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(87,216,196,0.14) 0%, transparent 40%, rgba(255,255,255,0.08) 100%)
  `,
  backgroundPosition: `${(frame * 0.8) % 44}px ${(frame * 0.3) % 44}px, ${(frame * 0.8) % 44}px ${(frame * 0.3) % 44}px, 0 0`,
  backgroundSize: "44px 44px, 44px 44px, 100% 100%",
});

export const getNoiseBloomBackground = (frame: number) => ({
  background: `
    radial-gradient(circle at ${22 + (frame % 24)}% 24%, rgba(87,216,196,0.18) 0%, transparent 24%),
    radial-gradient(circle at 80% ${68 + (frame % 16) * 0.4}%, rgba(255,255,255,0.12) 0%, transparent 18%)
  `,
});

export const getAuroraBackground = () => ({
  background:
    "radial-gradient(circle at 18% 22%, rgba(87,216,196,0.14) 0%, transparent 22%), radial-gradient(circle at 82% 76%, rgba(255,255,255,0.1) 0%, transparent 18%)",
});

export const getLaunchButtonBackground = (ready: boolean) =>
  ready ? "rgba(7,18,29,0.36)" : "rgba(5,12,20,0.58)";

export const LIFE_EFFECT_CONTROLS: EffectControlDefinition[] = [
  {
    id: "life-primary-hue",
    kind: "range",
    label: "Primary Hue",
    description: "Controls the hue of the main live cells.",
    section: "cellularEffect",
    field: "primaryHue",
    min: 0,
    max: 360,
    step: 1,
  },
  {
    id: "life-primary-light",
    kind: "range",
    label: "Primary Lightness",
    description: "Controls the brightness of the main live cells.",
    section: "cellularEffect",
    field: "primaryLightness",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: "life-secondary-hue",
    kind: "range",
    label: "Secondary Hue",
    description: "Controls the hue of the older cells / secondary tone.",
    section: "cellularEffect",
    field: "secondaryHue",
    min: 0,
    max: 360,
    step: 1,
  },
  {
    id: "life-secondary-light",
    kind: "range",
    label: "Secondary Lightness",
    description: "Controls the brightness of the secondary cells.",
    section: "cellularEffect",
    field: "secondaryLightness",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: "life-birth-hue",
    kind: "range",
    label: "Birth Hue",
    description: "Controls the hue of freshly born cells.",
    section: "cellularEffect",
    field: "birthHue",
    min: 0,
    max: 360,
    step: 1,
  },
  {
    id: "life-birth-light",
    kind: "range",
    label: "Birth Lightness",
    description: "Controls the brightness of freshly born cells.",
    section: "cellularEffect",
    field: "birthLightness",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: "life-scale",
    kind: "range",
    label: "Cell Scale",
    description: "Increase or decrease the apparent block size without exposing raw row/column counts.",
    section: "cellularEffect",
    field: "cellScale",
    min: 0.55,
    max: 1.55,
    step: 0.05,
  },
  {
    id: "life-speed",
    kind: "range",
    label: "Step Interval",
    description: "Lower values make the life simulation evolve faster frame-to-frame.",
    section: "cellularEffect",
    field: "stepEveryFrames",
    min: 1,
    max: 8,
    step: 1,
  },
];

export const PARTICLE_EFFECT_CONTROLS: EffectControlDefinition[] = [
  {
    id: "particle-variant",
    kind: "select",
    label: "Variant",
    description: "Treat one particle family as multiple effect presets with different parameter stacks.",
    section: "particleEffect",
    field: "variant",
    options: [
      {label: "Nebula", value: "nebula"},
      {label: "Vortex", value: "vortex"},
      {label: "Comet", value: "comet"},
    ],
  },
  {
    id: "particle-shape",
    kind: "select",
    label: "Particle Shape",
    description: "Switch the primitive shape used by the particle field.",
    section: "particleEffect",
    field: "shape",
    options: [
      {label: "Circle", value: "circle"},
      {label: "Square", value: "square"},
      {label: "Diamond", value: "diamond"},
    ],
  },
  {
    id: "particle-distribution",
    kind: "select",
    label: "Distribution",
    description: "Controls whether particles cluster in the center, form spirals, or wrap into a halo.",
    section: "particleEffect",
    field: "distribution",
    options: [
      {label: "Core", value: "core"},
      {label: "Spiral", value: "spiral"},
      {label: "Halo", value: "halo"},
    ],
  },
  {
    id: "particle-trajectory",
    kind: "select",
    label: "Trajectory",
    description: "Choose how particles move through space over time.",
    section: "particleEffect",
    field: "trajectory",
    options: [
      {label: "Orbit", value: "orbit"},
      {label: "Drift", value: "drift"},
      {label: "Wave", value: "wave"},
    ],
  },
  {
    id: "particle-count",
    kind: "range",
    label: "Particle Count",
    description: "Higher values add richness, but can also make the center feel heavier.",
    section: "particleEffect",
    field: "particleCount",
    min: 120,
    max: 1200,
    step: 20,
  },
  {
    id: "particle-size",
    kind: "range",
    label: "Point Size",
    description: "Bigger points feel softer and dreamier, smaller points feel sharper and more digital.",
    section: "particleEffect",
    field: "pointSize",
    min: 1.2,
    max: 12,
    step: 0.2,
  },
  {
    id: "particle-radius",
    kind: "range",
    label: "Orbit Radius",
    description: "Controls how much of the stage the particle mass occupies.",
    section: "particleEffect",
    field: "orbitRadius",
    min: 0.08,
    max: 0.8,
    step: 0.01,
  },
];

export const SNAKE_EFFECT_CONTROLS: EffectControlDefinition[] = [
  {
    id: "snake-primary-hue",
    kind: "range",
    label: "Primary Hue",
    description: "Controls the hue of the main snake body tone.",
    section: "cellularEffect",
    field: "primaryHue",
    min: 0,
    max: 360,
    step: 1,
  },
  {
    id: "snake-primary-light",
    kind: "range",
    label: "Primary Lightness",
    description: "Controls the brightness of the main snake body tone.",
    section: "cellularEffect",
    field: "primaryLightness",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: "snake-secondary-hue",
    kind: "range",
    label: "Secondary Hue",
    description: "Controls the hue of the head / highlight tone.",
    section: "cellularEffect",
    field: "secondaryHue",
    min: 0,
    max: 360,
    step: 1,
  },
  {
    id: "snake-secondary-light",
    kind: "range",
    label: "Secondary Lightness",
    description: "Controls the brightness of the head / highlight tone.",
    section: "cellularEffect",
    field: "secondaryLightness",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: "snake-birth-hue",
    kind: "range",
    label: "Food Hue",
    description: "Controls the hue of the food / accent blocks.",
    section: "cellularEffect",
    field: "birthHue",
    min: 0,
    max: 360,
    step: 1,
  },
  {
    id: "snake-birth-light",
    kind: "range",
    label: "Food Lightness",
    description: "Controls the brightness of the food / accent blocks.",
    section: "cellularEffect",
    field: "birthLightness",
    min: 0,
    max: 100,
    step: 1,
  },
  {
    id: "snake-scale",
    kind: "range",
    label: "Block Scale",
    description: "Adjust how large each visible snake block feels without exposing row/column counts.",
    section: "cellularEffect",
    field: "cellScale",
    min: 0.55,
    max: 1.55,
    step: 0.05,
  },
  {
    id: "snake-speed",
    kind: "range",
    label: "Move Interval",
    description: "Lower values make the snake advance more frequently through the grid.",
    section: "cellularEffect",
    field: "stepEveryFrames",
    min: 1,
    max: 8,
    step: 1,
  },
];

export const createModuleOverride = ({
  baseModules,
  control,
  value,
}: {
  baseModules?: VisualModuleConfig;
  control: EffectControlDefinition;
  value: number | string;
}) => {
  const section = {
    ...(baseModules?.[control.section] ?? {}),
    [control.field]: value,
  };

  return {
    ...(baseModules ?? {}),
    [control.section]: section,
  } satisfies VisualModuleConfig;
};
