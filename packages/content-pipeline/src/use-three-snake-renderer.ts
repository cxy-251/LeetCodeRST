import {useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import {resolveCellularEffectConfig} from "./module-api";
import {buildSnakeGridCells} from "./snake-grid-effect.service";
import type {ThreeLifeEffectProps} from "./three-life-effect.types";

export const useThreeSnakeRenderer = ({
  width,
  height,
  absoluteFrame,
  simulationFrame,
  seed,
  modules,
}: ThreeLifeEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const helper = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const config = resolveCellularEffectConfig(modules);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const context = (
      canvas.getContext("webgl2", {alpha: true, antialias: false}) ??
      canvas.getContext("webgl", {alpha: true, antialias: false}) ??
      canvas.getContext("experimental-webgl", {alpha: true, antialias: false})
    ) as WebGL2RenderingContext | WebGLRenderingContext | null;

    if (!context) {
      throw new Error("Unable to acquire a WebGL context for ThreeSnakeEffect");
    }

    const renderer = new THREE.WebGLRenderer({canvas, context, alpha: true, antialias: false});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, width, height, 0, -100, 100);
    camera.position.z = 10;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1,
      vertexColors: true,
    });

    const mesh = new THREE.InstancedMesh(geometry, material, 64);
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(mesh.count * 3), 3);
    scene.add(mesh);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    meshRef.current = mesh;

    return () => {
      mesh.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      meshRef.current = null;
    };
  }, [height, width]);

  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const mesh = meshRef.current;
    if (!renderer || !scene || !camera || !mesh) {
      return;
    }

    const cols = Math.max(12, Math.round(config.cellColumns));
    const rows = Math.max(18, Math.round(config.cellRows));
    const cells = buildSnakeGridCells({
      cols,
      rows,
      frame: Math.floor((simulationFrame ?? absoluteFrame) / Math.max(1, config.stepEveryFrames)),
      seed,
    });
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    renderer.setSize(width, height, false);
    camera.right = width;
    camera.top = height;
    camera.bottom = 0;
    camera.updateProjectionMatrix();

    const bodyColor = new THREE.Color(config.primaryColor);
    const headColor = new THREE.Color(config.secondaryColor);
    const foodColor = new THREE.Color("#ffd2a6");

    mesh.count = cells.length;
    cells.forEach((cell, index) => {
      const inset = cell.tone === "food" ? 3 + config.cellPadding * 1.4 : 1.1 + config.cellPadding;
      const drawWidth = Math.max(2, cellWidth - inset * 2);
      const drawHeight = Math.max(2, cellHeight - inset * 2);
      helper.position.set(
        cell.x * cellWidth + inset + drawWidth / 2,
        cell.y * cellHeight + inset + drawHeight / 2,
        0,
      );
      helper.scale.set(drawWidth, drawHeight, 1);
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
      color.copy(cell.tone === "head" ? headColor : cell.tone === "food" ? foodColor : bodyColor);
      mesh.setColorAt(index, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }, [
    absoluteFrame,
    color,
    config.birthColor,
    config.cellColumns,
    config.cellPadding,
    config.cellRows,
    config.primaryColor,
    config.stepEveryFrames,
    height,
    helper,
    modules,
    seed,
    simulationFrame,
    width,
  ]);

  return {canvasRef};
};
