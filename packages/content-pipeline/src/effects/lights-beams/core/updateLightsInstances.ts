import type {UpdateLightsInstancesInput} from "../lights-beams.types";

type LayerTuning = {
  length: number;
  thickness: number;
  yOffset: number;
};

const LAYER_TUNING: Record<"accent" | "core" | "glow", LayerTuning> = {
  glow: {
    length: 1.55,
    thickness: 1.7,
    yOffset: 0,
  },
  core: {
    length: 1,
    thickness: 1,
    yOffset: 0,
  },
  accent: {
    length: 0.62,
    thickness: 0.58,
    yOffset: 0.08,
  },
};

const computeBeamState = ({
  frame,
  seed,
  variant,
}: {
  frame: number;
  seed: UpdateLightsInstancesInput["seeds"][number];
  variant: UpdateLightsInstancesInput["config"]["variant"];
}) => {
  const time = frame * seed.speed;
  const travel = (seed.depth + time * 0.045) % 1;
  const corridorDepth = -34 + travel * 30;
  const lane = seed.lane * 2 - 1;
  const pulse = 0.84 + (Math.sin(time * 1.8 + seed.phase) + 1) * 0.24;

  if (variant === "pulse") {
    return {
      x: lane * 2.2 + Math.sin(time * 1.2 + seed.phase) * 1.1,
      y: 1.6 + Math.sin(time * 1.7 + seed.phase) * 0.45,
      z: corridorDepth,
      rotationY: Math.sin(time * 0.9 + seed.phase) * 0.45,
      scalePulse: pulse,
    };
  }

  if (variant === "bloom") {
    return {
      x: lane * 3.1 + Math.sin(time * 1.05 + seed.phase) * 1.6,
      y: 1.9 + Math.cos(time * 1.2 + seed.phase) * 0.6,
      z: corridorDepth - seed.orbit * 4,
      rotationY: lane * 0.34 + Math.sin(time * 0.75 + seed.phase) * 0.22,
      scalePulse: 0.96 + (Math.sin(time * 1.4 + seed.phase) + 1) * 0.16,
    };
  }

  return {
    x: lane * 4.2 + Math.sin(time * 0.8 + seed.phase) * 1.2,
    y: 1.7 + Math.sin(time * 1.15 + seed.phase) * 0.36,
    z: corridorDepth,
    rotationY: lane * 0.5 + Math.sin(time * 0.7 + seed.phase) * 0.18,
    scalePulse: 0.92 + (Math.sin(time * 1.1 + seed.phase) + 1) * 0.12,
  };
};

export const updateLightsInstances = ({
  config,
  floorBasePositions,
  floorGeometry,
  frame,
  helper,
  meshes,
  seeds,
}: UpdateLightsInstancesInput) => {
  const worldScale = 8.5;
  const beamLength = config.beamLength * worldScale;
  const beamThickness = config.beamThickness * worldScale;
  const positions = floorGeometry.attributes.position.array as Float32Array;
  const rippleTime = frame * config.motionSpeed * 24;
  const rippleAmplitude = 0.24 + config.spread * 0.34;

  for (let index = 0; index < floorBasePositions.length; index += 3) {
    const x = floorBasePositions[index];
    const y = floorBasePositions[index + 1];
    const z = floorBasePositions[index + 2];
    const primaryWave = Math.sin(z * 0.55 - rippleTime * 1.9 + x * 0.14) * rippleAmplitude;
    const secondaryWave = Math.cos((x + z) * 0.24 + rippleTime * 1.25) * rippleAmplitude * 0.55;
    const frontBias = 1 - Math.min(1, Math.max(0, (Math.abs(z) - 4) / 26));

    positions[index] = x;
    positions[index + 1] = y + (primaryWave + secondaryWave) * (0.55 + frontBias * 0.65);
    positions[index + 2] = z;
  }

  floorGeometry.attributes.position.needsUpdate = true;

  seeds.forEach((seed, index) => {
    const state = computeBeamState({
      frame,
      seed,
      variant: config.variant,
    });

    (["glow", "core", "accent"] as const).forEach((layerName) => {
      const tuning = LAYER_TUNING[layerName];
      const mesh = meshes[layerName].mesh;

      helper.position.set(state.x, state.y + tuning.yOffset, state.z);
      helper.rotation.set(0, state.rotationY, 0);
      helper.scale.set(
        beamThickness * tuning.thickness,
        beamLength * tuning.length * state.scalePulse,
        beamThickness * 0.6,
      );
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
    });
  });

  meshes.glow.mesh.instanceMatrix.needsUpdate = true;
  meshes.core.mesh.instanceMatrix.needsUpdate = true;
  meshes.accent.mesh.instanceMatrix.needsUpdate = true;
};
