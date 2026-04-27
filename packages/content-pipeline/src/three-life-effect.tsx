import React, {useEffect, useMemo, useRef, useState} from "react";
import * as THREE from "three";
import {buildCellularLifeCells} from "./visual-system";
import {resolveCellularEffectConfig} from "./module-api";
import type {RenderManifest} from "@paper-to-video/shared-types";

type Props = {
  width: number;
  height: number;
  absoluteFrame: number;
  activationFrame: number;
  simulationFrame?: number;
  seed: number;
  modules?: RenderManifest["modules"];
};

export const ThreeLifeEffect: React.FC<Props> = ({
  width,
  height,
  absoluteFrame,
  activationFrame,
  simulationFrame,
  seed,
  modules,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fallbackCanvasRef = useRef<HTMLCanvasElement | null>(null);
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
  const [renderMode, setRenderMode] = useState<"webgl" | "canvas2d">("webgl");

  useEffect(() => {
    if (renderMode !== "webgl" || !canvasRef.current) {
      return;
    }

    try {
      const canvas = canvasRef.current;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
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
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(mesh.count * 3), 3);

      scene.add(mesh);

      rendererRef.current = renderer;
      sceneRef.current = scene;
      cameraRef.current = camera;
      meshRef.current = mesh;
      geometryRef.current = geometry;
      materialRef.current = material;

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
    } catch (error) {
      console.warn("ThreeLifeEffect falling back to canvas2d", error);
      setRenderMode("canvas2d");
      return;
    }
  }, [clearColor, config.cellColumns, config.cellRows, height, renderMode, width]);

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
    if (renderMode === "canvas2d") {
      const canvas = fallbackCanvasRef.current;
      const context = canvas?.getContext("2d");
      if (!canvas || !context) {
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);
      context.imageSmoothingEnabled = false;
      for (const cell of cells) {
        const inset = cell.age >= 3 ? visibleInset * 2.2 : visibleInset;
        const drawWidth = Math.max(1.2, cellWidth - inset * 2);
        const drawHeight = Math.max(1.2, cellHeight - inset * 2);
        context.fillStyle = cell.tone === 1 ? "#57d8c4" : "#f4f7fb";
        context.fillRect(
          cell.x * cellWidth + inset,
          cell.y * cellHeight + inset,
          drawWidth,
          drawHeight,
        );
      }
      return;
    }

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const mesh = meshRef.current;
    if (!renderer || !scene || !camera || !mesh) {
      return;
    }

    renderer.setSize(width, height, false);
    camera.right = width;
    camera.bottom = height;
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
    renderMode,
    seed,
    simulationFrame,
    width,
  ]);

  if (renderMode === "canvas2d") {
    return (
      <canvas
        ref={fallbackCanvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        width={width}
        height={height}
      />
    );
  }

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
      width={width}
      height={height}
    />
  );
};
