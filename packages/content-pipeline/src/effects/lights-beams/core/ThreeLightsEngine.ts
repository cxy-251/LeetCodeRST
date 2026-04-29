import * as THREE from "three";
import {resolveLightsEffectConfig} from "../../../module-api";
import {createLightsMeshes} from "./createLightsMeshes";
import {disposeThreeLights} from "./disposeThreeLights";
import {updateLightsInstances} from "./updateLightsInstances";
import type {
  LightsBeamSeed,
  ThreeLightsEngineOptions,
  ThreeLightsMeshBundle,
  ThreeLightsModules,
  ThreeLightsRenderParams,
} from "../lights-beams.types";

const hashNoise = (value: number) => {
  const resolved = Math.sin(value * 12.9898) * 43758.5453;
  return resolved - Math.floor(resolved);
};

const buildBeamSeeds = (count: number, seed: number): LightsBeamSeed[] =>
  Array.from({length: count}, (_, index) => ({
    baseAngle: hashNoise(seed * 101 + index * 5.17) * Math.PI * 2,
    depth: hashNoise(seed * 211 + index * 11.37),
    drift: hashNoise(seed * 307 + index * 3.91) * 2 - 1,
    lane: hashNoise(seed * 401 + index * 7.53),
    orbit: hashNoise(seed * 503 + index * 13.29),
    phase: hashNoise(seed * 601 + index * 9.11) * Math.PI * 2,
    pulse: 10 + hashNoise(seed * 701 + index * 15.83) * 24,
    speed: 0.018 + hashNoise(seed * 809 + index * 17.47) * 0.04,
  }));

export class ThreeLightsEngine {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly root = new THREE.Group();
  private readonly helper = new THREE.Object3D();
  private readonly lookAtTarget = new THREE.Vector3();
  private bundle: ThreeLightsMeshBundle;
  private height = 0;
  private width = 0;
  private resolvedModulesRef: ThreeLightsModules | undefined;
  private resolvedConfigCache: ReturnType<typeof resolveLightsEffectConfig> | null = null;
  private seedCache: {beamCount: number; seed: number; seeds: LightsBeamSeed[]} | null = null;

  public constructor(canvas: HTMLCanvasElement, options: ThreeLightsEngineOptions) {
    const contextAttributes: WebGLContextAttributes = {
      alpha: true,
      antialias: false,
      depth: true,
      failIfMajorPerformanceCaveat: false,
      powerPreference: "high-performance",
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
      throw new Error("Unable to acquire a WebGL context for ThreeLightsEngine");
    }

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(new THREE.Color(0x000000), 0);
    this.renderer.setPixelRatio(1);

    this.scene = new THREE.Scene();
    this.scene.add(this.root);
    this.scene.fog = new THREE.FogExp2(0x071320, 0.026);
    this.camera = new THREE.PerspectiveCamera(34, options.width / options.height, 0.1, 100);
    this.camera.position.set(0, 1.55, 6.8);
    this.camera.lookAt(0, -0.4, -12.5);

    const defaultConfig = resolveLightsEffectConfig(undefined);
    this.bundle = createLightsMeshes({
      accentColor: defaultConfig.accentColor,
      beamCount: defaultConfig.beamCount,
      coreColor: defaultConfig.primaryColor,
      glowColor: defaultConfig.secondaryColor,
      root: this.root,
    });

    this.resize(options.width, options.height);
  }

  public resize(width: number, height: number) {
    if (width === this.width && height === this.height) {
      return;
    }

    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  }

  public renderFrame(params: ThreeLightsRenderParams) {
    const config = this.resolveConfig(params.modules);
    const seeds = this.resolveSeeds(config.beamCount, params.seed);
    this.ensureBundle(config);

    this.bundle.core.material.color.set(config.primaryColor);
    this.bundle.glow.material.color.set(config.secondaryColor);
    this.bundle.accent.material.color.set(config.accentColor);
    this.bundle.floorTiles.forEach((tile) => {
      tile.fillMaterial.color.set(config.secondaryColor);
      tile.wireMaterial.color.set(config.primaryColor);
    });
    this.bundle.horizonMaterial.color.set(config.accentColor);

    const frame = Math.max(0, params.simulationFrame ?? params.absoluteFrame);
    const time = frame * config.motionSpeed * 8.9;
    const forwardPhase = (time * 0.13) % 1;
    const cameraDolly = forwardPhase * 8.8;
    this.lookAtTarget.set(
      Math.sin(time * 0.16) * 0.5,
      -0.58 + Math.sin(time * 0.28) * 0.08,
      -14.8 - cameraDolly * 1.55 + Math.sin(time * 0.11) * 1.1,
    );
    this.camera.position.set(
      Math.sin(time * 0.17) * 0.48,
      1.48 + Math.cos(time * 0.13) * 0.08,
      7.4 - cameraDolly * 1.12 + Math.sin(time * 0.08) * 0.08,
    );
    this.camera.lookAt(this.lookAtTarget);
    this.bundle.horizonMesh.position.set(
      Math.sin(time * 0.08) * 0.24,
      4.8 + Math.cos(time * 0.11) * 0.12,
      -28 - cameraDolly * 0.92,
    );

    updateLightsInstances({
      config,
      floorTiles: this.bundle.floorTiles,
      frame,
      helper: this.helper,
      meshes: {
        accent: this.bundle.accent,
        core: this.bundle.core,
        glow: this.bundle.glow,
      },
      seeds,
    });

    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    disposeThreeLights({
      bundle: this.bundle,
      renderer: this.renderer,
      root: this.root,
      scene: this.scene,
    });
  }

  private ensureBundle(config: ReturnType<typeof resolveLightsEffectConfig>) {
    const signature = `orbs:${config.beamCount}`;
    if (this.bundle.signature === signature) {
      return;
    }

    this.root.clear();
    this.bundle.orbGeometry.dispose();
    this.bundle.floorTiles.forEach((tile) => {
      tile.geometry.dispose();
      tile.fillMaterial.dispose();
      tile.wireMaterial.dispose();
      tile.guideRails.forEach((plane) => {
        plane.geometry.dispose();
        plane.material.dispose();
      });
      tile.guideDashes.forEach((plane) => {
        plane.geometry.dispose();
        plane.material.dispose();
      });
    });
    this.bundle.horizonGeometry.dispose();
    this.bundle.horizonMaterial.dispose();
    this.bundle.glow.mesh.dispose();
    this.bundle.core.mesh.dispose();
    this.bundle.accent.mesh.dispose();
    this.bundle.glow.material.dispose();
    this.bundle.core.material.dispose();
    this.bundle.accent.material.dispose();

    this.bundle = createLightsMeshes({
      accentColor: config.accentColor,
      beamCount: config.beamCount,
      coreColor: config.primaryColor,
      glowColor: config.secondaryColor,
      root: this.root,
    });
  }

  private resolveConfig(modules?: ThreeLightsModules) {
    if (modules === this.resolvedModulesRef && this.resolvedConfigCache) {
      return this.resolvedConfigCache;
    }

    this.resolvedModulesRef = modules;
    this.resolvedConfigCache = resolveLightsEffectConfig(modules);
    return this.resolvedConfigCache;
  }

  private resolveSeeds(beamCount: number, seed: number) {
    if (this.seedCache?.beamCount === beamCount && this.seedCache.seed === seed) {
      return this.seedCache.seeds;
    }

    const seeds = buildBeamSeeds(beamCount, seed);
    this.seedCache = {
      beamCount,
      seed,
      seeds,
    };
    return seeds;
  }
}
