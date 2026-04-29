import * as THREE from "three";
import type {UpdateLightsInstancesInput} from "../lights-beams.types";

type LayerTuning = {
  nearMix: number;
  pulseBias: number;
  scale: number;
  yOffset: number;
};

const LAYER_TUNING: Record<"accent" | "core" | "glow", LayerTuning> = {
  glow: {
    nearMix: 1,
    pulseBias: 0.18,
    scale: 1.2,
    yOffset: 0.18,
  },
  core: {
    nearMix: 1,
    pulseBias: 0.1,
    scale: 0.54,
    yOffset: 0.1,
  },
  accent: {
    nearMix: 0.34,
    pulseBias: 0.08,
    scale: 0.38,
    yOffset: 0.08,
  },
};

const sampleFloorHeight = (x: number, worldZ: number, time: number, spread: number) => {
  const rippleAmplitude = 0.14 + spread * 0.17;
  const sourceA = {
    x: Math.sin(time * 0.16) * 7.5,
    z: -10 + Math.cos(time * 0.09) * 4.5,
  };
  const sourceB = {
    x: -5.2 + Math.sin(time * 0.07) * 1.8,
    z: -22 + Math.sin(time * 0.11) * 3.2,
  };
  const sourceC = {
    x: 6.4 + Math.cos(time * 0.05) * 1.5,
    z: -31 + Math.cos(time * 0.08) * 4.1,
  };

  const distA = Math.hypot(x - sourceA.x, worldZ - sourceA.z);
  const distB = Math.hypot(x - sourceB.x, worldZ - sourceB.z);
  const distC = Math.hypot(x - sourceC.x, worldZ - sourceC.z);

  const radialA = Math.sin(distA * 1.2 - time * 2.15) * rippleAmplitude;
  const radialB = Math.sin(distB * 1.65 - time * 1.42 + x * 0.06) * rippleAmplitude * 0.72;
  const radialC = Math.cos(distC * 1.08 - time * 1.08) * rippleAmplitude * 0.58;
  const longWave = Math.sin(worldZ * 0.23 - time * 0.84 + x * 0.07) * rippleAmplitude * 0.36;
  const ridgeWave = Math.cos(x * 0.54 + worldZ * 0.12 - time * 0.72) * rippleAmplitude * 0.26;
  const nearField = 1 - Math.min(1, Math.max(0, (Math.abs(worldZ) - 3) / 30));

  return (radialA + radialB + radialC + longWave + ridgeWave) * (0.34 + nearField * 0.76);
};

const sampleDepthVisibility = (displayZ: number, nearLimit: number, totalDepth: number) => {
  const normalized = Math.max(0, Math.min(1, (displayZ - (nearLimit - totalDepth)) / totalDepth));
  return {
    far: 1 - normalized,
    near: normalized,
    nearSoft: Math.pow(normalized, 1.35),
  };
};

const wrapDepth = (value: number, nearLimit: number, depthRange: number) => {
  let resolved = value;
  while (resolved > nearLimit) {
    resolved -= depthRange;
  }
  while (resolved < nearLimit - depthRange) {
    resolved += depthRange;
  }
  return resolved;
};

const computeOrbState = ({
  index,
  totalCount,
  seed,
  variant,
}: {
  index: number;
  totalCount: number;
  seed: UpdateLightsInstancesInput["seeds"][number];
  variant: UpdateLightsInstancesInput["config"]["variant"];
}) => {
  const laneCount = variant === "fan" ? 6 : variant === "bloom" ? 5 : 4;
  const depthRows = Math.max(1, Math.ceil(totalCount / laneCount));
  const laneIndex = index % laneCount;
  const depthIndex = Math.floor(index / laneCount);
  const laneRatio = laneIndex / (laneCount - 1);
  const laneSigned = laneRatio * 2 - 1;
  const depthRatio = depthRows === 1 ? 0 : depthIndex / Math.max(1, depthRows - 1);
  const laneJitter = seed.drift * 0.42;
  const depthJitter = Math.sin(seed.phase) * 0.9;

  if (variant === "bloom") {
    return {
      x:
        laneSigned * 5.4 +
        Math.sin(seed.baseAngle * 0.8) * 0.8 +
        laneJitter,
      z:
        -6 -
        depthRatio * 26 -
        Math.cos(seed.baseAngle * 0.45) * 1.1 +
        depthJitter,
    };
  }

  if (variant === "fan") {
    return {
      x:
        laneSigned * 7.2 +
        Math.sin(seed.baseAngle * 0.9) * (0.6 + depthRatio * 0.4) +
        laneJitter,
      z: -5 - depthRatio * 24 + depthJitter,
    };
  }

  return {
    x:
      laneSigned * 4.6 +
      Math.sin(seed.baseAngle * 0.7) * 0.65 +
      laneJitter,
    z:
      -4 -
      depthRatio * 22 -
      Math.sin(seed.baseAngle * 0.65) * 0.75 +
      depthJitter,
  };
};

export const updateLightsInstances = ({
  choreography,
  config,
  floorTiles,
  frame,
  helper,
  meshes,
  stars,
  seeds,
}: UpdateLightsInstancesInput) => {
  const time = frame * config.motionSpeed * 8.9;
  const tileLength = 18;
  const totalDepth = tileLength * floorTiles.length;
  const travelPhase = (time * 0.085) % 1;
  const travelOffset = travelPhase * totalDepth;
  const nearLimit = 6.5;

  floorTiles.forEach((tile, index) => {
    const baseZ = -index * tileLength;
    const wrappedZ = wrapDepth(baseZ + travelOffset, tileLength, totalDepth);

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

    const guidePlanes = [...tile.guideRails, ...tile.guideDashes];
    guidePlanes.forEach((plane) => {
      const planeWrappedZ = wrapDepth(baseZ + plane.zOffset + travelOffset, nearLimit, totalDepth);
      plane.mesh.position.x = plane.xOffset;
      plane.mesh.position.z = planeWrappedZ;

      const planePositions = plane.geometry.attributes.position.array as Float32Array;
      for (let cursor = 0; cursor < plane.basePositions.length; cursor += 3) {
        const localX = plane.basePositions[cursor];
        const localY = plane.basePositions[cursor + 1];
        const localZ = plane.basePositions[cursor + 2];
        const worldX = plane.xOffset + localX;
        const worldZ = planeWrappedZ + localZ;

        planePositions[cursor] = localX;
        planePositions[cursor + 1] = localY + sampleFloorHeight(worldX, worldZ, time, config.spread) + 0.018;
        planePositions[cursor + 2] = localZ;
      }

      plane.geometry.attributes.position.needsUpdate = true;
    });
  });

  const glowRadius = 0.72 + config.beamLength * 1.34;
  const coreRadius = 0.22 + config.beamThickness * 4.2;
  const farOrbBase = 0.18;
  const farOrbGain = 0.26;

  seeds.forEach((seed, index) => {
    const state = computeOrbState({
      index,
      totalCount: seeds.length,
      seed,
      variant: config.variant,
    });
    const displayZ = wrapDepth(state.z + travelOffset, nearLimit, totalDepth);
    const floorHeight = sampleFloorHeight(state.x, displayZ, time, config.spread);
    const breathing = 0.72 + (Math.sin(time * (1.05 + seed.speed * 5.5) + seed.phase) + 1) * 0.24;
    const visibility = sampleDepthVisibility(displayZ, nearLimit, totalDepth);
    const highlightFactor = Math.min(1, visibility.nearSoft + choreography.nearBias * visibility.near);
    const rimOnlyFactor = 0.42 + highlightFactor * 0.58;

    (["glow", "core", "accent"] as const).forEach((layerName) => {
      const tuning = LAYER_TUNING[layerName];
      const mesh = meshes[layerName].mesh;
      const radius =
        layerName === "glow"
          ? glowRadius
          : layerName === "core"
            ? coreRadius
            : Math.max(0.08, coreRadius * 0.36);

      const farPresence = farOrbBase + visibility.far * farOrbGain;
      const presence = tuning.nearMix * highlightFactor + (1 - tuning.nearMix) * farPresence;

      helper.position.set(state.x, -2.1 + floorHeight + tuning.yOffset, displayZ);
      helper.rotation.set(0, seed.baseAngle + time * 0.08, 0);
      helper.scale.setScalar(
        radius *
          tuning.scale *
          choreography.orbGain *
          (breathing + tuning.pulseBias) *
          (layerName === "accent" ? rimOnlyFactor : presence),
      );
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
    });

    helper.position.set(state.x, -2.085 + floorHeight + 0.025, displayZ);
    helper.rotation.set(-Math.PI / 2, 0, 0);
    helper.scale.setScalar(
      (0.46 + highlightFactor * 0.94) *
        choreography.orbGain *
        (0.86 + breathing * 0.22),
    );
    helper.updateMatrix();
    meshes.groundGlow.mesh.setMatrixAt(index, helper.matrix);

    helper.position.set(state.x, -2.09 + floorHeight + 0.015, displayZ);
    helper.rotation.set(-Math.PI / 2, 0, 0);
    helper.scale.setScalar(
      (1.12 + highlightFactor * 1.86) *
        choreography.auraGain *
        (0.82 + breathing * 0.18),
    );
    helper.updateMatrix();
    meshes.groundAura.mesh.setMatrixAt(index, helper.matrix);

    helper.position.set(state.x, -2.083 + floorHeight + 0.03, displayZ);
    helper.rotation.set(-Math.PI / 2, 0, 0);
    helper.scale.setScalar(
      (0.12 + visibility.far * 0.18 + highlightFactor * 0.24) *
        choreography.rimGain *
        rimOnlyFactor,
    );
    helper.updateMatrix();
    meshes.groundRim.mesh.setMatrixAt(index, helper.matrix);
  });

  meshes.glow.mesh.instanceMatrix.needsUpdate = true;
  meshes.core.mesh.instanceMatrix.needsUpdate = true;
  meshes.accent.mesh.instanceMatrix.needsUpdate = true;
  meshes.groundAura.mesh.instanceMatrix.needsUpdate = true;
  meshes.groundGlow.mesh.instanceMatrix.needsUpdate = true;
  meshes.groundRim.mesh.instanceMatrix.needsUpdate = true;

  const surfaceLaneCount = 14;
  const surfaceRowCount = Math.ceil(meshes.surfaceDots.mesh.count / surfaceLaneCount);
  for (let index = 0; index < meshes.surfaceDots.mesh.count; index += 1) {
    const laneIndex = index % surfaceLaneCount;
    const rowIndex = Math.floor(index / surfaceLaneCount);
    const laneRatio = laneIndex / (surfaceLaneCount - 1);
    const laneSigned = laneRatio * 2 - 1;
    const x = laneSigned * 8.4 + (rowIndex % 2 === 0 ? 0.36 : -0.36);
    const rowDepth = rowIndex / Math.max(1, surfaceRowCount - 1);
    const baseZ = -2.6 - rowDepth * 31.5;
    const displayZ = wrapDepth(baseZ + travelOffset, nearLimit, totalDepth);
    const floorHeight = sampleFloorHeight(x, displayZ, time, config.spread);
    const visibility = sampleDepthVisibility(displayZ, nearLimit, totalDepth);
    const shimmer = 0.68 + (Math.sin(time * 1.25 + laneIndex * 0.45 + rowIndex * 0.18) + 1) * 0.16;

    helper.position.set(x, -2.08 + floorHeight + 0.03, displayZ);
    helper.rotation.set(0, 0, 0);
    helper.scale.setScalar((0.028 + visibility.near * 0.036) * choreography.fieldGain * shimmer);
    helper.updateMatrix();
    meshes.surfaceDots.mesh.setMatrixAt(index, helper.matrix);

    helper.position.set(x, -2.08 + floorHeight + 0.035, displayZ);
    helper.scale.setScalar(
      (0.012 + visibility.nearSoft * 0.024) *
        choreography.fieldGain *
        (0.8 + visibility.nearSoft * 0.35),
    );
    helper.updateMatrix();
    meshes.surfaceAccent.mesh.setMatrixAt(index, helper.matrix);
  }

  meshes.surfaceDots.mesh.instanceMatrix.needsUpdate = true;
  meshes.surfaceAccent.mesh.instanceMatrix.needsUpdate = true;

  const starPositions = stars.positions;
  const starColors = stars.colors;
  const starFarColor = new THREE.Color(config.secondaryColor);
  const starNearColor = new THREE.Color(config.primaryColor);
  const starAccentColor = new THREE.Color(config.accentColor);
  const starColor = new THREE.Color();
  const starCount = starPositions.length / 3;
  const starLaneCount = 18;
  const starRowCount = Math.ceil(starCount / starLaneCount);
  const starDepth = totalDepth + 14;

  // Keep stars in a slower, wider volume so the camera read is "moving through space"
  // instead of only watching foreground orbs fly at the viewer. Far stars stay dim on
  // purpose so the horizon reads as air/depth, not as a second competing subject.
  for (let index = 0; index < starCount; index += 1) {
    const laneIndex = index % starLaneCount;
    const rowIndex = Math.floor(index / starLaneCount);
    const laneRatio = laneIndex / Math.max(1, starLaneCount - 1);
    const laneSigned = laneRatio * 2 - 1;
    const rowRatio = rowIndex / Math.max(1, starRowCount - 1);
    const phase = index * 0.73;
    const parallax = 0.56 + (index % 5) * 0.07;
    const x =
      laneSigned * 11.4 +
      Math.sin(phase * 0.81 + rowRatio * 3.2) * 0.7 +
      Math.cos(rowRatio * 6.4 + phase * 0.17) * 0.42;
    const y =
      1.2 +
      rowRatio * 3.8 +
      Math.sin(phase * 0.46 + time * 0.18) * 0.34 +
      Math.cos(laneSigned * 1.9 + rowRatio * 5.1) * 0.42;
    const baseZ = -7 - rowRatio * 41 - (index % 3) * 0.9;
    const displayZ = wrapDepth(baseZ + travelOffset * parallax, nearLimit + 4, starDepth);
    const visibility = sampleDepthVisibility(displayZ, nearLimit + 4, starDepth);
    const shimmer = 0.58 + (Math.sin(time * (0.28 + (index % 7) * 0.025) + phase) + 1) * 0.18;
    const burst =
      (0.04 + choreography.fieldGain * 0.08) +
      visibility.nearSoft * choreography.auraGain * 0.24;
    const intensity =
      (0.02 + visibility.far * 0.05 + visibility.nearSoft * 0.5) * shimmer +
      burst * (0.18 + visibility.nearSoft * 0.82);

    starColor.copy(starFarColor);
    starColor.lerp(starAccentColor, visibility.far * 0.16 + choreography.rimGain * 0.03);
    starColor.lerp(starNearColor, visibility.nearSoft * 0.68);

    const cursor = index * 3;
    starPositions[cursor] = x;
    starPositions[cursor + 1] = y;
    starPositions[cursor + 2] = displayZ;
    starColors[cursor] = starColor.r * intensity;
    starColors[cursor + 1] = starColor.g * intensity;
    starColors[cursor + 2] = starColor.b * intensity;
  }

  stars.geometry.attributes.position.needsUpdate = true;
  stars.geometry.attributes.color.needsUpdate = true;
};
