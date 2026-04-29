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
  bundle.orbGeometry?.dispose();
  bundle.dotGeometry?.dispose();
  bundle.floorTiles?.forEach((tile) => {
    tile.geometry?.dispose();
    tile.fillMaterial?.dispose();
    tile.wireMaterial?.dispose();
    tile.guideRails?.forEach((plane) => {
      plane.geometry?.dispose();
      plane.material?.dispose();
    });
    tile.guideDashes?.forEach((plane) => {
      plane.geometry?.dispose();
      plane.material?.dispose();
    });
  });
  bundle.horizonGeometry?.dispose();
  bundle.horizonMaterial?.dispose();
  bundle.glow?.mesh?.dispose();
  bundle.core?.mesh?.dispose();
  bundle.accent?.mesh?.dispose();
  bundle.surfaceDots?.mesh?.dispose();
  bundle.surfaceAccent?.mesh?.dispose();
  bundle.glow?.material?.dispose();
  bundle.core?.material?.dispose();
  bundle.accent?.material?.dispose();
  bundle.surfaceDots?.material?.dispose();
  bundle.surfaceAccent?.material?.dispose();
  root.clear();
  scene.clear();
  renderer.dispose();
};
