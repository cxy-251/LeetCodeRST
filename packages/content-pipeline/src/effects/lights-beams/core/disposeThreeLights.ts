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
  bundle.beamGeometry.dispose();
  bundle.floorGeometry.dispose();
  bundle.glow.mesh.dispose();
  bundle.core.mesh.dispose();
  bundle.accent.mesh.dispose();
  bundle.glow.material.dispose();
  bundle.core.material.dispose();
  bundle.accent.material.dispose();
  bundle.floorFillMaterial.dispose();
  bundle.floorWireMaterial.dispose();
  root.clear();
  scene.clear();
  renderer.dispose();
};
