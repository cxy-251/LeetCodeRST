import * as THREE from "three";
import type {ThreeLightsMeshBundle} from "../lights-beams.types";

const createLayer = ({
  color,
  count,
  geometry,
  layerName,
  opacity,
  root,
}: {
  color: string;
  count: number;
  geometry: THREE.PlaneGeometry;
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
    side: THREE.DoubleSide,
  });

  const planes = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((rotationOffset) => {
    const mesh = new THREE.InstancedMesh(geometry, material, Math.max(1, count));
    mesh.count = count;
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    root.add(mesh);

    return {
      mesh,
      rotationOffset,
    };
  });

  return {
    material,
    planes,
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
  const beamGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);

  const floorTiles = Array.from({length: 4}, (_, index) => {
    const geometry = new THREE.PlaneGeometry(30, 18, 44, 42);
    geometry.rotateX(-Math.PI / 2);
    const basePositions = new Float32Array(geometry.attributes.position.array as ArrayLike<number>);

    const fillMaterial = new THREE.MeshBasicMaterial({
      color: coreColor,
      transparent: true,
      opacity: 0.08,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const fillMesh = new THREE.Mesh(geometry, fillMaterial);
    fillMesh.position.set(0, -2.1, 0 - index * 18);
    root.add(fillMesh);

    const wireMaterial = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
      wireframe: true,
    });
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    wireMesh.position.copy(fillMesh.position);
    root.add(wireMesh);

    return {
      basePositions,
      fillMaterial,
      fillMesh,
      geometry,
      wireMaterial,
      wireMesh,
    };
  });

  const horizonGeometry = new THREE.CircleGeometry(14, 64);
  const horizonMaterial = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const horizonMesh = new THREE.Mesh(horizonGeometry, horizonMaterial);
  horizonMesh.position.set(0, 7.2, -30);
  horizonMesh.scale.set(1.6, 0.75, 1);
  root.add(horizonMesh);

  return {
    beamGeometry,
    floorTiles,
    horizonGeometry,
    horizonMaterial,
    horizonMesh,
    signature: `beams:${beamCount}`,
    glow: createLayer({
      color: glowColor,
      count: beamCount,
      geometry: beamGeometry,
      layerName: "glow",
      opacity: 0.14,
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
