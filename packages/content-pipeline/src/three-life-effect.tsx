import React from "react";
import {useThreeLifeRenderer} from "./use-three-life-renderer";
import type {ThreeLifeEffectProps} from "./three-life-effect.types";

export const ThreeLifeEffect: React.FC<ThreeLifeEffectProps> = (props) => {
  const {canvasRef} = useThreeLifeRenderer(props);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      width={props.width}
      height={props.height}
    />
  );
};
