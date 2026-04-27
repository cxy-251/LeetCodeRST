import {useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import {buildCellularLifeCells} from "./visual-system";
import {resolveCellularEffectConfig} from "./module-api";
import type {ThreeLifeEffectProps} from "./three-life-effect.types";

type LifeMeshRefs = {
  birth: THREE.InstancedMesh | null;
  primary: THREE.InstancedMesh | null;
  secondary: THREE.InstancedMesh | null;
};

const disposeMeshMaterial = (mesh: THREE.InstancedMesh | null) => {
  if (!mesh) {
    return;
  }

  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) => material.dispose());
    return;
  }

  mesh.material.dispose();
};

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
  const meshRefs = useRef<LifeMeshRefs>({
    birth: null,
    primary: null,
    secondary: null,
  });
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const helper = useMemo(() => new THREE.Object3D(), []);
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
    const createLayerMesh = (colorValue: string) => {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorValue),
        transparent: true,
        opacity: 1,
      });
      const mesh = new THREE.InstancedMesh(
        geometry,
        material,
        config.cellColumns * config.cellRows,
      );
      mesh.frustumCulled = false;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(mesh);
      return mesh;
    };

    const birthMesh = createLayerMesh(config.birthColor);
    const primaryMesh = createLayerMesh(config.primaryColor);
    const secondaryMesh = createLayerMesh(config.secondaryColor);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    meshRefs.current = {
      birth: birthMesh,
      primary: primaryMesh,
      secondary: secondaryMesh,
    };
    geometryRef.current = geometry;

    /**
     * We keep the WebGL lifecycle inside one hook so the editor preview and
     * Remotion renderer can share the exact same initialization path.
     */
    return () => {
      disposeMeshMaterial(meshRefs.current.birth);
      disposeMeshMaterial(meshRefs.current.primary);
      disposeMeshMaterial(meshRefs.current.secondary);
      meshRefs.current.birth?.dispose();
      meshRefs.current.primary?.dispose();
      meshRefs.current.secondary?.dispose();
      renderer.dispose();
      geometry.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      meshRefs.current = {birth: null, primary: null, secondary: null};
      geometryRef.current = null;
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
    const {birth: birthMesh, primary: primaryMesh, secondary: secondaryMesh} = meshRefs.current;
    if (!renderer || !scene || !camera || !birthMesh || !primaryMesh || !secondaryMesh) {
      return;
    }

    renderer.setSize(width, height, false);
    camera.right = width;
    camera.top = height;
    camera.bottom = 0;
    camera.updateProjectionMatrix();

    (birthMesh.material as THREE.MeshBasicMaterial).color.set(config.birthColor);
    (primaryMesh.material as THREE.MeshBasicMaterial).color.set(config.primaryColor);
    (secondaryMesh.material as THREE.MeshBasicMaterial).color.set(config.secondaryColor);

    let birthCount = 0;
    let primaryCount = 0;
    let secondaryCount = 0;
    cells.forEach((cell, index) => {
      const inset = cell.age >= 3 ? visibleInset * 2.2 : visibleInset;
      const drawWidth = Math.max(1.2, (cellWidth - inset * 2) * config.cellScale);
      const drawHeight = Math.max(1.2, (cellHeight - inset * 2) * config.cellScale);
      helper.position.set(
        cell.x * cellWidth + cellWidth / 2,
        cell.y * cellHeight + cellHeight / 2,
        0,
      );
      helper.scale.set(drawWidth, drawHeight, 1);
      helper.rotation.set(0, 0, 0);
      helper.updateMatrix();

      if (cell.age <= 1) {
        birthMesh.setMatrixAt(birthCount, helper.matrix);
        birthCount += 1;
      } else if (cell.tone === 1) {
        primaryMesh.setMatrixAt(primaryCount, helper.matrix);
        primaryCount += 1;
      } else {
        secondaryMesh.setMatrixAt(secondaryCount, helper.matrix);
        secondaryCount += 1;
      }
    });

    birthMesh.count = birthCount;
    primaryMesh.count = primaryCount;
    secondaryMesh.count = secondaryCount;
    birthMesh.instanceMatrix.needsUpdate = true;
    primaryMesh.instanceMatrix.needsUpdate = true;
    secondaryMesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  }, [
    absoluteFrame,
    activationFrame,
    config.cellColumns,
    config.cellPadding,
    config.cellScale,
    config.birthColor,
    config.primaryColor,
    config.cellRows,
    config.secondaryColor,
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
