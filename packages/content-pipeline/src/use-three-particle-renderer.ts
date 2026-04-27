import {useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import {resolveParticleEffectConfig} from "./module-api";
import type {ThreeLifeEffectProps} from "./three-life-effect.types";

type ParticleSeed = {
  baseAngle: number;
  baseRadius: number;
  speed: number;
  phase: number;
  layer: number;
  tone: number;
};

const hashNoise = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
};

const buildParticleSeeds = (count: number, seed: number): ParticleSeed[] => {
  return Array.from({length: count}, (_, index) => {
    const noiseA = hashNoise(seed * 101 + index * 13.17);
    const noiseB = hashNoise(seed * 211 + index * 7.41);
    const noiseC = hashNoise(seed * 307 + index * 3.91);
    const noiseD = hashNoise(seed * 401 + index * 11.73);
    const noiseE = hashNoise(seed * 503 + index * 5.61);
    const noiseF = hashNoise(seed * 601 + index * 17.21);

    return {
      baseAngle: noiseA * Math.PI * 2,
      baseRadius: 0.08 + noiseB * noiseB * 0.92,
      speed: 0.4 + noiseC * 1.8,
      phase: noiseD * Math.PI * 2,
      layer: noiseE * 2 - 1,
      tone: noiseF,
    };
  });
};

export const useThreeParticleRenderer = ({
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
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const geometryRef = useRef<THREE.BufferGeometry | null>(null);
  const particleSeeds = useMemo(
    () => buildParticleSeeds(resolveParticleEffectConfig(modules).particleCount, seed),
    [modules, seed],
  );
  const config = resolveParticleEffectConfig(modules);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    };
    const context = (
      canvas.getContext("webgl2", contextAttributes) ??
      canvas.getContext("webgl", contextAttributes) ??
      canvas.getContext("experimental-webgl", contextAttributes)
    ) as WebGL2RenderingContext | WebGLRenderingContext | null;

    if (!context) {
      throw new Error("Unable to acquire a WebGL context for ThreeParticleEffect");
    }

    const renderer = new THREE.WebGLRenderer({canvas, context, alpha: true, antialias: false});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 22);

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleSeeds.length * 3);
    const colors = new Float32Array(particleSeeds.length * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: config.pointSize,
      transparent: true,
      opacity: 0.72,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    pointsRef.current = points;
    geometryRef.current = geometry;

    return () => {
      points.geometry.dispose();
      material.dispose();
      renderer.dispose();
      rendererRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      pointsRef.current = null;
      geometryRef.current = null;
    };
  }, [config.pointSize, height, particleSeeds.length, width]);

  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const points = pointsRef.current;
    const geometry = geometryRef.current;
    if (!renderer || !scene || !camera || !points || !geometry) {
      return;
    }

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const positions = geometry.getAttribute("position") as THREE.BufferAttribute;
    const colors = geometry.getAttribute("color") as THREE.BufferAttribute;
    const primary = new THREE.Color(config.primaryColor);
    const secondary = new THREE.Color(config.secondaryColor);
    const accent = new THREE.Color(config.accentColor);
    const frame = simulationFrame ?? absoluteFrame;
    const time = frame * config.driftSpeed;
    const aspectScale = width / Math.max(1, height);

    for (let index = 0; index < particleSeeds.length; index += 1) {
      const particle = particleSeeds[index];
      const angle = particle.baseAngle + time * particle.speed;
      const radius =
        particle.baseRadius * config.orbitRadius * Math.min(width, height) * 0.055 +
        Math.sin(time * 1.35 + particle.phase) * config.swirlStrength * 11;
      const spiral = Math.sin(time * 0.72 + particle.phase * 1.3) * 6;
      const depth = particle.layer * config.layerDepth + Math.cos(time + particle.phase) * 2.2;
      const armOffset = Math.sin(angle * 2 + particle.phase) * radius * 0.18;
      const centerBias = 1 - Math.min(1, particle.baseRadius);

      positions.setXYZ(
        index,
        Math.cos(angle) * radius * aspectScale + Math.cos(angle * 2.2 + particle.phase) * spiral + armOffset,
        Math.sin(angle) * radius + Math.sin(angle * 1.6 + particle.phase) * spiral * 0.65 - centerBias * 8,
        depth,
      );

      const mix = particle.tone;
      const color =
        mix < 0.42 ? primary.clone() : mix < 0.78 ? secondary.clone() : accent.clone();
      color.lerp(primary, 0.18 + 0.22 * Math.sin(time + particle.phase));
      colors.setXYZ(index, color.r, color.g, color.b);
    }

    positions.needsUpdate = true;
    colors.needsUpdate = true;
    renderer.render(scene, camera);
  }, [
    absoluteFrame,
    config.accentColor,
    config.driftSpeed,
    config.layerDepth,
    config.orbitRadius,
    config.primaryColor,
    config.secondaryColor,
    config.swirlStrength,
    height,
    particleSeeds,
    simulationFrame,
    width,
  ]);

  return {canvasRef};
};
