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
  geometry: THREE.SphereGeometry;
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
    wireframe: layerName === "accent",
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

const createGuidePlane = ({
  color,
  length,
  opacity,
  root,
  width,
  xOffset,
  zOffset,
}: {
  color: string;
  length: number;
  opacity: number;
  root: THREE.Group;
  width: number;
  xOffset: number;
  zOffset: number;
}) => {
  const geometry = new THREE.PlaneGeometry(width, length, 1, Math.max(1, Math.round(length * 3)));
  geometry.rotateX(-Math.PI / 2);
  const basePositions = new Float32Array(geometry.attributes.position.array as ArrayLike<number>);
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(xOffset, -2.06, zOffset);
  root.add(mesh);

  return {
    basePositions,
    geometry,
    material,
    mesh,
    xOffset,
    zOffset,
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
  const orbGeometry = new THREE.SphereGeometry(1, 24, 24);

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
      opacity: 0.34,
      depthWrite: false,
      wireframe: true,
    });
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    wireMesh.position.copy(fillMesh.position);
    root.add(wireMesh);

    const guideRails = [
      createGuidePlane({
        color: glowColor,
        length: 18,
        opacity: 0.22,
        root,
        width: 0.18,
        xOffset: -7.25,
        zOffset: fillMesh.position.z,
      }),
      createGuidePlane({
        color: accentColor,
        length: 18,
        opacity: 0.26,
        root,
        width: 0.24,
        xOffset: 0,
        zOffset: fillMesh.position.z,
      }),
      createGuidePlane({
        color: glowColor,
        length: 18,
        opacity: 0.22,
        root,
        width: 0.18,
        xOffset: 7.25,
        zOffset: fillMesh.position.z,
      }),
    ];

    const guideDashes = [-6.2, -2.4, 1.4, 5.2].map((offset) =>
      createGuidePlane({
        color: accentColor,
        length: 1.6,
        opacity: 0.38,
        root,
        width: 0.42,
        xOffset: 0,
        zOffset: fillMesh.position.z + offset,
      }),
    );

    return {
      basePositions,
      fillMaterial,
      fillMesh,
      geometry,
      guideDashes,
      guideRails,
      wireMaterial,
      wireMesh,
    };
  });

  const horizonGeometry = new THREE.CircleGeometry(10, 64);
  const horizonMaterial = new THREE.MeshBasicMaterial({
    color: accentColor,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const horizonMesh = new THREE.Mesh(horizonGeometry, horizonMaterial);
  horizonMesh.position.set(0, 5.4, -30);
  horizonMesh.scale.set(1.8, 0.72, 1);
  root.add(horizonMesh);

  return {
    orbGeometry,
    floorTiles,
    horizonGeometry,
    horizonMaterial,
    horizonMesh,
    signature: `orbs:${beamCount}`,
    glow: createLayer({
      color: glowColor,
      count: beamCount,
      geometry: orbGeometry,
      layerName: "glow",
      opacity: 0.1,
      root,
    }),
    core: createLayer({
      color: coreColor,
      count: beamCount,
      geometry: orbGeometry,
      layerName: "core",
      opacity: 0.28,
      root,
    }),
    accent: createLayer({
      color: accentColor,
      count: beamCount,
      geometry: orbGeometry,
      layerName: "accent",
      opacity: 0.34,
      root,
    }),
  };
};
