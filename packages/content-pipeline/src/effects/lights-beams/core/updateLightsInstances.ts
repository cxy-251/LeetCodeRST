import type {UpdateLightsInstancesInput} from "../lights-beams.types";

type LayerTuning = {
  length: number;
  thickness: number;
  yOffset: number;
};

const LAYER_TUNING: Record<"accent" | "core" | "glow", LayerTuning> = {
  glow: {
    length: 1.46,
    thickness: 1.7,
    yOffset: 0,
  },
  core: {
    length: 1,
    thickness: 1,
    yOffset: 0,
  },
  accent: {
    length: 0.72,
    thickness: 0.64,
    yOffset: 0.12,
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
  const travel = (seed.depth + time * 0.032) % 1;
  const corridorDepth = -34 + travel * 34;
  const lane = seed.lane * 2 - 1;
  const pulse = 0.9 + (Math.sin(time * 1.35 + seed.phase) + 1) * 0.18;

  if (variant === "pulse") {
    return {
      x: lane * 2.4 + Math.sin(time * 1.15 + seed.phase) * 0.9,
      y: 1.15 + Math.sin(time * 1.2 + seed.phase) * 0.36,
      z: corridorDepth,
      rotationY: Math.sin(time * 0.74 + seed.phase) * 0.18,
      scalePulse: pulse,
    };
  }

  if (variant === "bloom") {
    return {
      x: lane * 3.5 + Math.sin(time * 0.82 + seed.phase) * 1.45,
      y: 1.45 + Math.cos(time * 0.95 + seed.phase) * 0.46,
      z: corridorDepth - seed.orbit * 5,
      rotationY: lane * 0.18 + Math.sin(time * 0.55 + seed.phase) * 0.12,
      scalePulse: 0.98 + (Math.sin(time * 1.08 + seed.phase) + 1) * 0.14,
    };
  }

  return {
    x: lane * 4.4 + Math.sin(time * 0.72 + seed.phase) * 1.8,
    y: 1.28 + Math.sin(time * 0.92 + seed.phase) * 0.4,
    z: corridorDepth,
    rotationY: lane * 0.22 + Math.sin(time * 0.42 + seed.phase) * 0.12,
    scalePulse: 0.94 + (Math.sin(time * 0.88 + seed.phase) + 1) * 0.11,
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
  const worldScale = 8.8;
  const beamLength = config.beamLength * worldScale;
  const beamThickness = config.beamThickness * worldScale;
  const time = frame * config.motionSpeed * 14;

  const tileLength = 18;
  const totalDepth = tileLength * floorTiles.length;
  const scroll = (time * 1.8) % totalDepth;
  const rippleAmplitude = 0.2 + config.spread * 0.22;

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

      const longWave = Math.sin(worldZ * 0.4 - time * 1.85 + localX * 0.12) * rippleAmplitude;
      const crossWave =
        Math.cos(worldZ * 0.16 - time * 0.94 - localX * 0.28) * rippleAmplitude * 0.52;
      const pulseWave =
        Math.sin((worldZ + localX * 0.5) * 0.22 - time * 1.32) * rippleAmplitude * 0.28;
      const nearField = 1 - Math.min(1, Math.max(0, (Math.abs(worldZ) - 2) / 30));

      positions[cursor] = localX;
      positions[cursor + 1] =
        localY + (longWave + crossWave + pulseWave) * (0.45 + nearField * 0.8);
      positions[cursor + 2] = localZ;
    }

    tile.geometry.attributes.position.needsUpdate = true;
  });

  seeds.forEach((seed, index) => {
    const state = computeBeamState({
      frame,
      seed,
      variant: config.variant,
    });

    (["glow", "core", "accent"] as const).forEach((layerName) => {
      const tuning = LAYER_TUNING[layerName];
      const layer = meshes[layerName];

      layer.planes.forEach((plane) => {
        helper.position.set(state.x, state.y + tuning.yOffset, state.z);
        helper.rotation.set(0, state.rotationY + plane.rotationOffset, 0);
        helper.scale.set(
          beamThickness * tuning.thickness,
          beamLength * tuning.length * state.scalePulse,
          1,
        );
        helper.updateMatrix();
        plane.mesh.setMatrixAt(index, helper.matrix);
      });
    });
  });

  meshes.glow.planes.forEach((plane) => {
    plane.mesh.instanceMatrix.needsUpdate = true;
  });
  meshes.core.planes.forEach((plane) => {
    plane.mesh.instanceMatrix.needsUpdate = true;
  });
  meshes.accent.planes.forEach((plane) => {
    plane.mesh.instanceMatrix.needsUpdate = true;
  });
};
