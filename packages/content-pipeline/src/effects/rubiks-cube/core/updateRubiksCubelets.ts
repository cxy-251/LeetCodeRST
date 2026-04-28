import type {RubiksCubieState, ThreeRubiksCubeletBundle} from "../rubiks-cube.types";

export const updateRubiksCubelets = ({
  cubieGap,
  cubelets,
  states,
}: {
  cubieGap: number;
  cubelets: ThreeRubiksCubeletBundle["cubelets"];
  states: RubiksCubieState[];
}) => {
  const spacing = 1 + cubieGap;

  cubelets.forEach((cubie, index) => {
    const state = states[index];
    cubie.mesh.position.copy(state.coord).multiplyScalar(spacing);
    cubie.mesh.quaternion.copy(state.orientation);
    cubie.mesh.scale.setScalar(0.92);
  });
};
