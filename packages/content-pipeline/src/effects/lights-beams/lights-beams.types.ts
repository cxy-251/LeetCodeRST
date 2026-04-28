import type {LightsEffectConfig, RenderManifest} from "@paper-to-video/shared-types";
import type * as THREE from "three";

export type ThreeLightsModules = RenderManifest["modules"];

export type ThreeLightsEngineOptions = {
  height: number;
  width: number;
};

export type ThreeLightsRenderParams = {
  absoluteFrame: number;
  activationFrame: number;
  modules?: ThreeLightsModules;
  seed: number;
  simulationFrame?: number;
};

export type LightsBeamSeed = {
  baseAngle: number;
  depth: number;
  drift: number;
  lane: number;
  orbit: number;
  phase: number;
  pulse: number;
  speed: number;
};

export type LightsMeshLayerName = "accent" | "core" | "glow";

export type LightsMeshLayer = {
  material: THREE.MeshBasicMaterial;
  mesh: THREE.InstancedMesh;
  name: LightsMeshLayerName;
};

export type ThreeLightsMeshBundle = {
  accent: LightsMeshLayer;
  core: LightsMeshLayer;
  beamGeometry: THREE.BoxGeometry;
  floorBasePositions: Float32Array;
  floorFillMaterial: THREE.MeshBasicMaterial;
  floorFillMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  floorGeometry: THREE.PlaneGeometry;
  floorWireMaterial: THREE.MeshBasicMaterial;
  floorWireMesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  glow: LightsMeshLayer;
  signature: string;
};

export type UpdateLightsInstancesInput = {
  config: LightsEffectConfig;
  floorBasePositions: Float32Array;
  floorGeometry: THREE.PlaneGeometry;
  frame: number;
  height: number;
  helper: THREE.Object3D;
  meshes: Pick<ThreeLightsMeshBundle, "accent" | "core" | "glow">;
  seeds: LightsBeamSeed[];
  width: number;
};

export type WebLightsLayerProps = {
  activationFrame: number;
  className?: string;
  height: number;
  isRunning?: boolean;
  modules?: ThreeLightsModules;
  resetToken?: number;
  seed: number;
  width: number;
};

export type RemotionLightsLayerProps = {
  absoluteFrame?: number;
  activationFrame: number;
  className?: string;
  height: number;
  modules?: ThreeLightsModules;
  seed: number;
  simulationFrame?: number;
  width: number;
};
