import type React from "react";
import type {BackgroundEffectId, RenderManifest} from "@paper-to-video/shared-types";

export type EffectAtomId = Exclude<BackgroundEffectId, "none">;

export type EffectAtomRuntimeProps = {
  absoluteFrame: number;
  activationFrame: number;
  height: number;
  isRunning?: boolean;
  modules?: RenderManifest["modules"];
  onPrimaryAction?: () => void;
  seed: number;
  simulationFrame?: number;
  width: number;
};

export type EffectAtomDefinition = {
  description: string;
  id: EffectAtomId;
  title: string;
  Component: React.FC<EffectAtomRuntimeProps>;
};
