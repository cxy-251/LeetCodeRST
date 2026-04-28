import * as THREE from "three";
import {RUBIKS_COORDINATES} from "./applyRubiksMove";
import type {RubiksCubelet, ThreeRubiksCubeletBundle} from "../rubiks-cube.types";

const STICKER_PALETTE = {
  back: "#8cff7b",
  body: "#0b1320",
  down: "#ffd86b",
  front: "#67d8ff",
  left: "#ff9f45",
  right: "#ff5d7a",
  up: "#f6f5f2",
};

const createFaceMaterial = (color: string, isSticker: boolean) =>
  new THREE.MeshStandardMaterial({
    color,
    emissive: isSticker ? new THREE.Color(color).multiplyScalar(0.08) : new THREE.Color(0x000000),
    metalness: isSticker ? 0.08 : 0.16,
    roughness: isSticker ? 0.44 : 0.72,
  });

const createCubeletMaterials = (coord: RubiksCubelet["initialCoord"]) => {
  return [
    createFaceMaterial(coord.x === 1 ? STICKER_PALETTE.right : STICKER_PALETTE.body, coord.x === 1),
    createFaceMaterial(coord.x === -1 ? STICKER_PALETTE.left : STICKER_PALETTE.body, coord.x === -1),
    createFaceMaterial(coord.y === 1 ? STICKER_PALETTE.up : STICKER_PALETTE.body, coord.y === 1),
    createFaceMaterial(coord.y === -1 ? STICKER_PALETTE.down : STICKER_PALETTE.body, coord.y === -1),
    createFaceMaterial(coord.z === 1 ? STICKER_PALETTE.front : STICKER_PALETTE.body, coord.z === 1),
    createFaceMaterial(coord.z === -1 ? STICKER_PALETTE.back : STICKER_PALETTE.body, coord.z === -1),
  ];
};

export const createRubiksCubelets = ({
  root,
}: {
  root: THREE.Group;
}): ThreeRubiksCubeletBundle => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const cubelets: RubiksCubelet[] = RUBIKS_COORDINATES.map(([x, y, z], index) => {
    const initialCoord = new THREE.Vector3(x, y, z);
    const mesh = new THREE.Mesh(geometry, createCubeletMaterials(initialCoord));
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    root.add(mesh);

    return {
      id: `rubiks-cubie-${index}`,
      initialCoord,
      mesh,
    };
  });

  return {
    cubelets,
    geometry,
  };
};
