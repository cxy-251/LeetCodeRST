import * as THREE from "three";
import type {ThreeLightsMeshBundle} from "../lights-beams.types";

const createLayer = ({
  color,
  count,
  geometry,
  opacity,
  root,
  layerName,
}: {
  color: string;
  count: number;
  geometry: THREE.BoxGeometry;
  layerName: "accent" | "core" | "glow";
  opacity: number;
  root: THREE.Group;
}) => {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, Math.max(1, count));
  mesh.count = count;
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
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
  const beamGeometry = new THREE.BoxGeometry(1, 1, 0.18, 1, 1, 1);
  const floorGeometry = new THREE.PlaneGeometry(26, 54, 42, 110);
  floorGeometry.rotateX(-Math.PI / 2);
  const floorBasePositions = new Float32Array(floorGeometry.attributes.position.array as ArrayLike<number>);

  const floorFillMaterial = new THREE.MeshBasicMaterial({
    color: coreColor,
    transparent: true,
    opacity: 0.11,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const floorFillMesh = new THREE.Mesh(floorGeometry, floorFillMaterial);
  floorFillMesh.position.set(0, -2.05, -14);
  root.add(floorFillMesh);

  const floorWireMaterial = new THREE.MeshBasicMaterial({
    color: glowColor,
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
    wireframe: true,
  });
  const floorWireMesh = new THREE.Mesh(floorGeometry, floorWireMaterial);
  floorWireMesh.position.copy(floorFillMesh.position);
  root.add(floorWireMesh);

  return {
    beamGeometry,
    floorBasePositions,
    floorFillMaterial,
    floorFillMesh,
    floorGeometry,
    floorWireMaterial,
    floorWireMesh,
    signature: `beams:${beamCount}`,
    glow: createLayer({
      color: glowColor,
      count: beamCount,
      geometry: beamGeometry,
      layerName: "glow",
      opacity: 0.15,
      root,
    }),
    core: createLayer({
      color: coreColor,
      count: beamCount,
      geometry: beamGeometry,
      layerName: "core",
      opacity: 0.42,
      root,
    }),
    accent: createLayer({
      color: accentColor,
      count: beamCount,
      geometry: beamGeometry,
      layerName: "accent",
      opacity: 0.24,
      root,
    }),
  };
};
