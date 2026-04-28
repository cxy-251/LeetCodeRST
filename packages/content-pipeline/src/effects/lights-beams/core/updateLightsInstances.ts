import type {UpdateLightsInstancesInput} from "../lights-beams.types";

type LayerTuning = {
  pulseBias: number;
  scale: number;
  yOffset: number;
};

const LAYER_TUNING: Record<"accent" | "core" | "glow", LayerTuning> = {
  glow: {
    pulseBias: 0.28,
    scale: 1.95,
    yOffset: 0,
  },
  core: {
    pulseBias: 0.1,
    scale: 1,
    yOffset: 0,
  },
  accent: {
    pulseBias: 0.18,
    scale: 0.58,
    yOffset: 0.04,
  },
};

const sampleFloorHeight = (x: number, worldZ: number, time: number, spread: number) => {
  const rippleAmplitude = 0.18 + spread * 0.18;
  const longWave = Math.sin(worldZ * 0.4 - time * 1.85 + x * 0.12) * rippleAmplitude;
  const crossWave = Math.cos(worldZ * 0.16 - time * 0.94 - x * 0.28) * rippleAmplitude * 0.52;
  const pulseWave = Math.sin((worldZ + x * 0.5) * 0.22 - time * 1.32) * rippleAmplitude * 0.28;
  const nearField = 1 - Math.min(1, Math.max(0, (Math.abs(worldZ) - 2) / 30));

  return (longWave + crossWave + pulseWave) * (0.45 + nearField * 0.8);
};

const computeOrbState = ({
  frame,
  seed,
  variant,
}: {
  frame: number;
  seed: UpdateLightsInstancesInput["seeds"][number];
  variant: UpdateLightsInstancesInput["config"]["variant"];
}) => {
  const time = frame * seed.speed;
  const depthTravel = (seed.depth + time * 0.011) % 1;
  const radius = 0.8 + seed.orbit * 4.8;
  const angle = seed.baseAngle + time * (0.12 + seed.drift * 0.06);
  const pulse = 0.72 + (Math.sin(time * 1.6 + seed.phase) + 1) * 0.24;
  const rippleSync = (Math.sin(time * 1.2 + seed.phase * 0.6) + 1) * 0.5;

  if (variant === "bloom") {
    return {
      x: Math.cos(angle) * radius * 1.35,
      z: -6 - depthTravel * 20 - Math.sin(angle * 0.4) * 5.5,
      pulse,
      rippleSync,
    };
  }

  if (variant === "fan") {
    const lane = seed.lane * 2 - 1;
    return {
      x: lane * 5.6 + Math.sin(angle) * 1.25,
      z: -5 - depthTravel * 22,
      pulse: 0.76 + (Math.sin(time * 1.35 + seed.phase) + 1) * 0.2,
      rippleSync,
    };
  }

  return {
    x: Math.cos(angle) * radius,
    z: -4 - depthTravel * 18 - Math.sin(angle * 0.8) * 2.2,
    pulse,
    rippleSync,
  };
};

export const updateLightsInstances = ({
  config,
  floorTiles,
  frame,
  helper,
  meshes,
  seeds,
}: UpdateLightsInstancesInput) => {
  const time = frame * config.motionSpeed * 14;
  const tileLength = 18;
  const totalDepth = tileLength * floorTiles.length;
  const scroll = (time * 1.8) % totalDepth;

  floorTiles.forEach((tile, index) => {
    const baseZ = -index * tileLength;
    const shifted = baseZ + (scroll % totalDepth);
    const wrappedZ = shifted > tileLength ? shifted - totalDepth : shifted;

    tile.fillMesh.position.z = wrappedZ;
    tile.wireMesh.position.z = wrappedZ;

    const positions = tile.geometry.attributes.position.array as Float32Array;
    for (let cursor = 0; cursor < tile.basePositions.length; cursor += 3) {
      const localX = tile.basePositions[cursor];
      const localY = tile.basePositions[cursor + 1];
      const localZ = tile.basePositions[cursor + 2];
      const worldZ = wrappedZ + localZ;

      positions[cursor] = localX;
      positions[cursor + 1] = localY + sampleFloorHeight(localX, worldZ, time, config.spread);
      positions[cursor + 2] = localZ;
    }

    tile.geometry.attributes.position.needsUpdate = true;
  });

  const glowRadius = 0.48 + config.beamLength * 1.2;
  const coreRadius = 0.16 + config.beamThickness * 3.1;

  seeds.forEach((seed, index) => {
    const state = computeOrbState({
      frame,
      seed,
      variant: config.variant,
    });
    const floorHeight = sampleFloorHeight(state.x, state.z, time, config.spread);
    const breathing = state.pulse * (0.82 + state.rippleSync * 0.36);

    (["glow", "core", "accent"] as const).forEach((layerName) => {
      const tuning = LAYER_TUNING[layerName];
      const mesh = meshes[layerName].mesh;
      const radius =
        layerName === "glow"
          ? glowRadius
          : layerName === "core"
            ? coreRadius
            : Math.max(0.08, coreRadius * 0.36);

      helper.position.set(state.x, -2.1 + floorHeight + tuning.yOffset, state.z);
      helper.rotation.set(0, seed.baseAngle + time * 0.08, 0);
      helper.scale.setScalar(radius * tuning.scale * (breathing + tuning.pulseBias));
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
    });
  });

  meshes.glow.mesh.instanceMatrix.needsUpdate = true;
  meshes.core.mesh.instanceMatrix.needsUpdate = true;
  meshes.accent.mesh.instanceMatrix.needsUpdate = true;
};
