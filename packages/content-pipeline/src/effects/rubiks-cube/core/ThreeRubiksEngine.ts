import * as THREE from "three";
import {resolveRubiksEffectConfig} from "../../../module-api";
import {buildRubiksSequenceCache, applyRubiksMoveProgress} from "./applyRubiksMove";
import {createRubiksCubelets} from "./createRubiksCubelets";
import {disposeThreeRubiks} from "./disposeThreeRubiks";
import {updateRubiksCubelets} from "./updateRubiksCubelets";
import type {
  RubiksSequenceCache,
  ThreeRubiksCubeletBundle,
  ThreeRubiksEngineOptions,
  ThreeRubiksModules,
  ThreeRubiksRenderParams,
} from "../rubiks-cube.types";

const easeInOutCubic = (value: number) =>
  value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

export class ThreeRubiksEngine {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly root = new THREE.Group();
  private readonly ambientLight = new THREE.AmbientLight(0xffffff, 1.28);
  private readonly keyLight = new THREE.DirectionalLight(0xffffff, 1.18);
  private readonly rimLight = new THREE.DirectionalLight(0x8fd2ff, 0.76);
  private readonly bundle: ThreeRubiksCubeletBundle;
  private width = 0;
  private height = 0;
  private resolvedModulesRef: ThreeRubiksModules | undefined;
  private resolvedConfigCache: ReturnType<typeof resolveRubiksEffectConfig> | null = null;
  private sequenceCache: RubiksSequenceCache | null = null;

  public constructor(canvas: HTMLCanvasElement, options: ThreeRubiksEngineOptions) {
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
      throw new Error("Unable to acquire a WebGL context for ThreeRubiksEngine");
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
    this.camera = new THREE.PerspectiveCamera(30, options.width / options.height, 0.1, 100);
    this.camera.position.set(0, 0, 12.8);
    this.camera.lookAt(0, 0, 0);

    this.keyLight.position.set(6, 8, 10);
    this.rimLight.position.set(-7, -4, -8);
    this.scene.add(this.ambientLight, this.keyLight, this.rimLight);

    this.bundle = createRubiksCubelets({root: this.root});
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

  public renderFrame(params: ThreeRubiksRenderParams) {
    const config = this.resolveConfig(params.modules);
    const sequence = this.resolveSequence(params.seed);
    const effectiveFrame = Math.max(0, params.simulationFrame ?? params.absoluteFrame);
    const states = this.resolveStatesForFrame({
      config,
      frame: effectiveFrame,
      sequence,
    });

    updateRubiksCubelets({
      cubieGap: config.cubieGap,
      cubelets: this.bundle.cubelets,
      states,
    });

    const time = effectiveFrame * 0.018 + params.seed * 0.0061;
    this.root.scale.setScalar(config.cubeScale);
    this.root.position.set(0, Math.sin(time * 0.9) * config.floatAmplitude, 0);
    this.root.rotation.set(
      -0.56 + Math.sin(time * 0.52) * config.cameraDrift,
      0.66 + time * 0.12 + Math.cos(time * 0.46) * config.cameraDrift,
      Math.sin(time * 0.74) * config.cameraDrift * 0.44,
    );

    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    disposeThreeRubiks({
      bundle: this.bundle,
      renderer: this.renderer,
      root: this.root,
      scene: this.scene,
    });
  }

  private resolveConfig(modules?: ThreeRubiksModules) {
    if (modules === this.resolvedModulesRef && this.resolvedConfigCache) {
      return this.resolvedConfigCache;
    }

    this.resolvedModulesRef = modules;
    this.resolvedConfigCache = resolveRubiksEffectConfig(modules);
    return this.resolvedConfigCache;
  }

  private resolveSequence(seed: number) {
    if (this.sequenceCache?.seed === seed) {
      return this.sequenceCache;
    }

    this.sequenceCache = buildRubiksSequenceCache(seed);
    return this.sequenceCache;
  }

  private resolveStatesForFrame({
    config,
    frame,
    sequence,
  }: {
    config: ReturnType<typeof resolveRubiksEffectConfig>;
    frame: number;
    sequence: RubiksSequenceCache;
  }) {
    const cycle = Math.max(1, config.turnFrames + config.holdFrames);
    const stepIndex = Math.floor(frame / cycle);
    const stepFrame = frame % cycle;
    const lastState = sequence.statesByStep[sequence.statesByStep.length - 1];

    if (stepIndex >= sequence.solve.length) {
      return lastState;
    }

    if (stepFrame < config.turnFrames) {
      const progress = easeInOutCubic(stepFrame / Math.max(1, config.turnFrames));
      return applyRubiksMoveProgress(
        sequence.statesByStep[stepIndex],
        sequence.solve[stepIndex],
        progress,
      );
    }

    return sequence.statesByStep[Math.min(stepIndex + 1, sequence.statesByStep.length - 1)];
  }
}
