import {useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import {buildCellularLifeCells} from "./visual-system";
import {resolveCellularEffectConfig} from "./module-api";
import type {ThreeLifeEffectProps} from "./three-life-effect.types";

export const useThreeLifeRenderer = ({
  width,
  height,
  absoluteFrame,
  activationFrame,
  simulationFrame,
  seed,
  modules,
}: ThreeLifeEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const helper = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);
  const clearColor = useMemo(() => new THREE.Color(0x000000), []);
  const config = resolveCellularEffectConfig(modules);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: false,
      depth: false,
      failIfMajorPerformanceCaveat: false,
      powerPreference: "default",
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      stencil: false,
    };

    const context = (
      canvas.getContext("webgl2", contextAttributes) ??
      canvas.getContext("webgl", contextAttributes) ??
      canvas.getContext("experimental-webgl", contextAttributes)
    ) as WebGL2RenderingContext | WebGLRenderingContext | null;

    if (!context) {
      throw new Error("Unable to acquire a WebGL context for ThreeLifeEffect");
    }

    const renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      alpha: true,
      antialias: false,
      powerPreference: "default",
    });
    renderer.setClearColor(clearColor, 0);
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
    const mesh = new THREE.InstancedMesh(
      geometry,
      material,
      config.cellColumns * config.cellRows,
    );
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(mesh.count * 3), 3);

    scene.add(mesh);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    meshRef.current = mesh;
    geometryRef.current = geometry;
    materialRef.current = material;

    /**
     * We keep the WebGL lifecycle inside one hook so the editor preview and
     * Remotion renderer can share the exact same initialization path.
     */
    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      mesh.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      meshRef.current = null;
      geometryRef.current = null;
      materialRef.current = null;
    };
  }, [clearColor, config.cellColumns, config.cellRows, height, width]);

  useEffect(() => {
    const cols = config.cellColumns;
    const rows = config.cellRows;
    const effectiveFrame = simulationFrame ?? absoluteFrame;
    const cells = buildCellularLifeCells({
      cols,
      rows,
      globalFrame: effectiveFrame,
      activationFrame,
      seed,
      stepEveryFrames: config.stepEveryFrames,
    });
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    const visibleInset = config.cellPadding;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const mesh = meshRef.current;
    if (!renderer || !scene || !camera || !mesh) {
      return;
    }

    renderer.setSize(width, height, false);
    camera.right = width;
    camera.top = height;
    camera.bottom = 0;
    camera.updateProjectionMatrix();

    const darkColor = new THREE.Color(0xffffff);
    const accentColor = new THREE.Color(0x57d8c4);

    mesh.count = cells.length;
    cells.forEach((cell, index) => {
      const inset = cell.age >= 3 ? visibleInset * 2.2 : visibleInset;
      const drawWidth = Math.max(1.2, cellWidth - inset * 2);
      const drawHeight = Math.max(1.2, cellHeight - inset * 2);
      helper.position.set(
        cell.x * cellWidth + inset + drawWidth / 2,
        cell.y * cellHeight + inset + drawHeight / 2,
        0,
      );
      helper.scale.set(drawWidth, drawHeight, 1);
      helper.rotation.set(0, 0, 0);
      helper.updateMatrix();
      mesh.setMatrixAt(index, helper.matrix);
      color.copy(cell.tone === 1 ? accentColor : darkColor);
      mesh.setColorAt(index, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
    renderer.render(scene, camera);
  }, [
    absoluteFrame,
    activationFrame,
    color,
    config.cellColumns,
    config.cellPadding,
    config.cellRows,
    config.stepEveryFrames,
    helper,
    height,
    seed,
    simulationFrame,
    width,
  ]);

  return {
    canvasRef,
  };
};
