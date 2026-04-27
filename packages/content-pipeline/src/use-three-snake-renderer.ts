import {useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import {resolveCellularEffectConfig} from "./module-api";
import {buildSnakeGridCells} from "./snake-grid-effect.service";
import type {ThreeLifeEffectProps} from "./three-life-effect.types";

type SnakeMeshRefs = {
  body: THREE.InstancedMesh | null;
  head: THREE.InstancedMesh | null;
  food: THREE.InstancedMesh | null;
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
  const meshRefs = useRef<SnakeMeshRefs>({
    body: null,
    head: null,
    food: null,
  });
  const helper = useMemo(() => new THREE.Object3D(), []);
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
    const createLayerMesh = (colorValue: string) => {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorValue),
        transparent: true,
        opacity: 1,
      });
      const mesh = new THREE.InstancedMesh(geometry, material, 96);
      mesh.frustumCulled = false;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      scene.add(mesh);
      return mesh;
    };

    const bodyMesh = createLayerMesh(config.primaryColor);
    const headMesh = createLayerMesh(config.secondaryColor);
    const foodMesh = createLayerMesh(config.birthColor);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    meshRefs.current = {
      body: bodyMesh,
      head: headMesh,
      food: foodMesh,
    };

    return () => {
      disposeMeshMaterial(meshRefs.current.body);
      disposeMeshMaterial(meshRefs.current.head);
      disposeMeshMaterial(meshRefs.current.food);
      meshRefs.current.body?.dispose();
      meshRefs.current.head?.dispose();
      meshRefs.current.food?.dispose();
      geometry.dispose();
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      meshRefs.current = {body: null, head: null, food: null};
    };
  }, [height, width]);

  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const {body: bodyMesh, head: headMesh, food: foodMesh} = meshRefs.current;
    if (!renderer || !scene || !camera || !bodyMesh || !headMesh || !foodMesh) {
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

    (bodyMesh.material as THREE.MeshBasicMaterial).color.set(config.primaryColor);
    (headMesh.material as THREE.MeshBasicMaterial).color.set(config.secondaryColor);
    (foodMesh.material as THREE.MeshBasicMaterial).color.set(config.birthColor);

    let bodyCount = 0;
    let headCount = 0;
    let foodCount = 0;
    cells.forEach((cell) => {
      const inset = cell.tone === "food" ? 3 + config.cellPadding * 1.4 : 1.1 + config.cellPadding;
      const drawWidth = Math.max(2, (cellWidth - inset * 2) * config.cellScale);
      const drawHeight = Math.max(2, (cellHeight - inset * 2) * config.cellScale);
      helper.position.set(
        cell.x * cellWidth + cellWidth / 2,
        cell.y * cellHeight + cellHeight / 2,
        0,
      );
      helper.scale.set(drawWidth, drawHeight, 1);
      helper.updateMatrix();
      if (cell.tone === "head") {
        headMesh.setMatrixAt(headCount, helper.matrix);
        headCount += 1;
      } else if (cell.tone === "food") {
        foodMesh.setMatrixAt(foodCount, helper.matrix);
        foodCount += 1;
      } else {
        bodyMesh.setMatrixAt(bodyCount, helper.matrix);
        bodyCount += 1;
      }
    });

    bodyMesh.count = bodyCount;
    headMesh.count = headCount;
    foodMesh.count = foodCount;
    bodyMesh.instanceMatrix.needsUpdate = true;
    headMesh.instanceMatrix.needsUpdate = true;
    foodMesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  }, [
    absoluteFrame,
    config.birthColor,
    config.cellColumns,
    config.cellPadding,
    config.cellScale,
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
