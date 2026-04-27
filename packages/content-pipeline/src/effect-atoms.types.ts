import type React from "react";
import type {
  BackgroundEffectId,
  RenderManifest,
  VisualModuleConfig,
} from "@paper-to-video/shared-types";

export type EffectAtomId = Exclude<BackgroundEffectId, "none">;

export type EffectAtomRuntimeProps = {
  absoluteFrame: number;
  activationFrame: number;
  continuousEffectId?: EffectAtomId;
  interactionFrame?: number;
  effectStartFrame?: number;
  height: number;
  isRunning?: boolean;
  modules?: RenderManifest["modules"];
  onPrimaryAction?: () => void;
  seed: number;
  simulationFrame?: number;
  width: number;
};

export type EffectControlSection = keyof Pick<
  VisualModuleConfig,
  "cellularEffect" | "particleEffect" | "backgroundMotion"
>;

export type EffectControlDefinition = {
  id: string;
  label: string;
  description: string;
  section: EffectControlSection;
  field: string;
  min: number;
  max: number;
  step: number;
};

export type EffectAtomDefinition = {
  description: string;
  id: EffectAtomId;
  title: string;
  Component: React.FC<EffectAtomRuntimeProps>;
  controls?: EffectControlDefinition[];
};
