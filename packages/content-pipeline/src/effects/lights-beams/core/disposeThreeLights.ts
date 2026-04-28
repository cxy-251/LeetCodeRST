import type {ThreeLightsMeshBundle} from "../lights-beams.types";
import type * as THREE from "three";

export const disposeThreeLights = ({
  bundle,
  renderer,
  root,
  scene,
}: {
  bundle: ThreeLightsMeshBundle;
  renderer: THREE.WebGLRenderer;
  root: THREE.Group;
  scene: THREE.Scene;
}) => {
  bundle.beamGeometry?.dispose();
  bundle.floorTiles?.forEach((tile) => {
    tile.geometry?.dispose();
    tile.fillMaterial?.dispose();
    tile.wireMaterial?.dispose();
  });
  bundle.horizonGeometry?.dispose();
  bundle.horizonMaterial?.dispose();
  bundle.glow?.planes?.forEach((plane) => {
    plane.mesh?.dispose();
  });
  bundle.core?.planes?.forEach((plane) => {
    plane.mesh?.dispose();
  });
  bundle.accent?.planes?.forEach((plane) => {
    plane.mesh?.dispose();
  });
  bundle.glow?.material?.dispose();
  bundle.core?.material?.dispose();
  bundle.accent?.material?.dispose();
  root.clear();
  scene.clear();
  renderer.dispose();
};
