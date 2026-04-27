import React from "react";
import {getEffectAtomDefinition} from "./effect-atoms";
import type {BackgroundEffectId, RenderManifest} from "@paper-to-video/shared-types";

export type EffectRuntimeMode = "interactive" | "render";

export type EffectRuntimeAdapterProps = {
  absoluteFrame: number;
  activationFrame: number;
  effectId: BackgroundEffectId;
  height: number;
  isRunning?: boolean;
  mode: EffectRuntimeMode;
  modules?: RenderManifest["modules"];
  onPrimaryAction?: () => void;
  seed: number;
  simulationFrame?: number;
  width: number;
};

export const EffectRuntimeAdapter: React.FC<EffectRuntimeAdapterProps> = ({
  absoluteFrame,
  activationFrame,
  effectId,
  height,
  isRunning,
  mode,
  modules,
  onPrimaryAction,
  seed,
  simulationFrame,
  width,
}) => {
  if (effectId === "none") {
    return null;
  }

  const definition = getEffectAtomDefinition(effectId);
  const effectiveRunning =
    mode === "render" ? absoluteFrame >= activationFrame || effectId === "cellular-life" || effectId === "aurora" : isRunning;
  const effectiveSimulationFrame =
    mode === "render" ? Math.max(0, absoluteFrame - activationFrame) : (simulationFrame ?? absoluteFrame);

  return (
    <definition.Component
      absoluteFrame={absoluteFrame}
      activationFrame={activationFrame}
      height={height}
      isRunning={effectiveRunning}
      modules={modules}
      onPrimaryAction={onPrimaryAction}
      seed={seed}
      simulationFrame={effectiveSimulationFrame}
      width={width}
    />
  );
};
