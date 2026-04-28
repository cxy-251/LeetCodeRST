import * as THREE from "three";
import type {ThreeLightsMeshBundle} from "../lights-beams.types";

const createLayer = ({
  color,
  count,
  geometry,
  opacity,
  root,
  zOffset,
  layerName,
}: {
  color: string;
  count: number;
  geometry: THREE.PlaneGeometry;
  layerName: "accent" | "core" | "glow";
  opacity: number;
  root: THREE.Group;
  zOffset: number;
}) => {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, Math.max(1, count));
  mesh.count = count;
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.position.z = zOffset;
  root.add(mesh);

  return {
    material,
    mesh,
    name: layerName,
  } as const;
};

export const createLightsMeshes = ({
  accentColor,
  beamCount,
  coreColor,
  glowColor,
  root,
}: {
  accentColor: string;
  beamCount: number;
  coreColor: string;
  glowColor: string;
  root: THREE.Group;
}): ThreeLightsMeshBundle => {
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

  return {
    geometry,
    signature: `beams:${beamCount}`,
    glow: createLayer({
      color: glowColor,
      count: beamCount,
      geometry,
      layerName: "glow",
      opacity: 0.14,
      root,
      zOffset: -0.06,
    }),
    core: createLayer({
      color: coreColor,
      count: beamCount,
      geometry,
      layerName: "core",
      opacity: 0.4,
      root,
      zOffset: 0,
    }),
    accent: createLayer({
      color: accentColor,
      count: beamCount,
      geometry,
      layerName: "accent",
      opacity: 0.26,
      root,
      zOffset: 0.08,
    }),
  };
};
