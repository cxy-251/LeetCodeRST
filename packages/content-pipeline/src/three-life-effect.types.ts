import type {RenderManifest} from "@paper-to-video/shared-types";

export type ThreeLifeEffectProps = {
  width: number;
  height: number;
  absoluteFrame: number;
  activationFrame: number;
  simulationFrame?: number;
  seed: number;
  modules?: RenderManifest["modules"];
};
