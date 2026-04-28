import type * as THREE from "three";
import type {ThreeRubiksCubeletBundle} from "../rubiks-cube.types";

const disposeMaterials = (mesh: ThreeRubiksCubeletBundle["cubelets"][number]["mesh"]) => {
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) => material.dispose());
    return;
  }

  mesh.material.dispose();
};

export const disposeThreeRubiks = ({
  bundle,
  renderer,
  root,
  scene,
}: {
  bundle: ThreeRubiksCubeletBundle;
  renderer: THREE.WebGLRenderer;
  root: THREE.Group;
  scene: THREE.Scene;
}) => {
  bundle.cubelets.forEach((cubie) => {
    disposeMaterials(cubie.mesh);
    root.remove(cubie.mesh);
  });
  bundle.geometry.dispose();
  scene.remove(root);
  renderer.dispose();
};
