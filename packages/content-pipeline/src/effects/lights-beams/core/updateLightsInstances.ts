import type {UpdateLightsInstancesInput} from "../lights-beams.types";

type LayerTuning = {
  length: number;
  thickness: number;
  zJitter: number;
};

const LAYER_TUNING: Record<"accent" | "core" | "glow", LayerTuning> = {
  glow: {
    length: 1.7,
    thickness: 1.85,
    zJitter: -0.08,
  },
  core: {
    length: 1,
    thickness: 1,
    zJitter: 0,
  },
  accent: {
    length: 0.68,
    thickness: 0.56,
    zJitter: 0.08,
  },
};

const computeBeamState = ({
  frame,
  orbitRadius,
  seed,
  spread,
  variant,
}: {
  frame: number;
  orbitRadius: number;
  seed: UpdateLightsInstancesInput["seeds"][number];
  spread: number;
  variant: UpdateLightsInstancesInput["config"]["variant"];
}) => {
  const rotationBase = seed.baseAngle + Math.sin(frame * 0.012 + seed.phase) * 0.22;
  const orbit = orbitRadius * (0.22 + seed.orbit * 0.78);
  const fanSpread = spread * (seed.lane - 0.5);
  const radialPulse = Math.sin(frame * seed.speed + seed.phase) * seed.pulse;

  if (variant === "pulse") {
    return {
      x: Math.cos(rotationBase * 0.7) * orbit * 0.18 + fanSpread * 0.12,
      y: Math.sin(rotationBase * 1.3) * orbit * 0.14 + radialPulse * 10,
      rotation: rotationBase + Math.sin(frame * 0.01 + seed.phase) * 0.34,
      scalePulse: 0.82 + (Math.sin(frame * seed.speed + seed.phase) + 1) * 0.26,
    };
  }

  if (variant === "bloom") {
    return {
      x:
        Math.cos(rotationBase + seed.phase) * orbit * 0.22 +
        Math.sin(frame * 0.009 + seed.phase) * spread * 0.16,
      y:
        Math.sin(rotationBase * 1.24 + seed.phase) * orbit * 0.2 +
        Math.cos(frame * 0.011 + seed.phase) * spread * 0.14,
      rotation: rotationBase + seed.drift * 1.2,
      scalePulse: 0.94 + (Math.sin(frame * seed.speed + seed.phase) + 1) * 0.16,
    };
  }

  return {
    x:
      Math.cos(rotationBase * 0.88) * orbit * 0.26 +
      fanSpread * 0.24 +
      Math.sin(frame * 0.006 + seed.phase) * spread * 0.08,
    y:
      Math.sin(rotationBase * 1.08) * orbit * 0.18 +
      Math.cos(frame * 0.008 + seed.phase) * spread * 0.06,
    rotation: rotationBase + fanSpread * 0.9,
    scalePulse: 0.9 + (Math.sin(frame * seed.speed + seed.phase) + 1) * 0.18,
  };
};

export const updateLightsInstances = ({
  config,
  frame,
  height,
  helper,
  meshes,
  seeds,
  width,
}: UpdateLightsInstancesInput) => {
  const stageUnit = Math.min(width, height);
  const orbitRadius = stageUnit * config.orbitRadius;
  const beamLength = stageUnit * config.beamLength;
  const beamThickness = stageUnit * config.beamThickness;
  const spread = stageUnit * config.spread;

  seeds.forEach((seed, index) => {
    const state = computeBeamState({
      frame,
      orbitRadius,
      seed,
      spread,
      variant: config.variant,
    });

    (["glow", "core", "accent"] as const).forEach((layerName) => {
      const tuning = LAYER_TUNING[layerName];
      const mesh = meshes[layerName].mesh;

      helper.position.set(
        state.x,
        state.y,
        (seed.depth - 0.5) * 4 + tuning.zJitter,
      );
      helper.rotation.set(0, 0, state.rotation + seed.drift * 0.42);
      helper.scale.set(
        beamLength * tuning.length * state.scalePulse,
        beamThickness * tuning.thickness * (0.88 + seed.drift * 0.22),
        1,
      );
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
    });
  });

  meshes.glow.mesh.instanceMatrix.needsUpdate = true;
  meshes.core.mesh.instanceMatrix.needsUpdate = true;
  meshes.accent.mesh.instanceMatrix.needsUpdate = true;
};
