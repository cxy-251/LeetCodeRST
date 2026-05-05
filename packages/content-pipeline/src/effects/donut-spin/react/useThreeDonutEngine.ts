import {useEffect, useRef, useState} from "react";
import {ThreeDonutEngine} from "../core/ThreeDonutEngine";

export const useThreeDonutEngine = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ThreeDonutEngine | null>(null);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const engine = new ThreeDonutEngine(canvas, {height, width});
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, [canvas]);

  useEffect(() => {
    engineRef.current?.resize(width, height);
  }, [height, width]);

  return {
    canvasRef: setCanvas,
    engineRef,
  };
};
