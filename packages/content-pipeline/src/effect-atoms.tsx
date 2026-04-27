import React from "react";
import {ThreeLifeEffect} from "./three-life-effect";
import {
  baseLayerStyle,
  getAuroraBackground,
  getGridDriftBackground,
  getLaunchButtonBackground,
  getLaunchButtonState,
  getNoiseBloomBackground,
  launchButtonBaseStyle,
} from "./effect-atoms.service";
import type {EffectAtomDefinition, EffectAtomId, EffectAtomRuntimeProps} from "./effect-atoms.types";

const CellularLifeAtom: React.FC<EffectAtomRuntimeProps> = ({
  absoluteFrame,
  activationFrame,
  height,
  modules,
  seed,
  simulationFrame,
  width,
}) => {
  return (
    <ThreeLifeEffect
      absoluteFrame={absoluteFrame}
      activationFrame={activationFrame}
      height={height}
      modules={modules}
      seed={seed}
      simulationFrame={simulationFrame}
      width={width}
    />
  );
};

const CellularLaunchAtom: React.FC<EffectAtomRuntimeProps> = ({
  absoluteFrame,
  activationFrame,
  height,
  isRunning,
  modules,
  onPrimaryAction,
  seed,
  simulationFrame,
  width,
}) => {
  const pulseFrame = simulationFrame ?? absoluteFrame;
  const {buttonOrigin, pulse} = getLaunchButtonState(pulseFrame);
  const ready = Boolean(isRunning);

  return (
    <>
      {ready ? (
        <ThreeLifeEffect
          absoluteFrame={absoluteFrame}
          activationFrame={activationFrame}
          height={height}
          modules={modules}
          seed={seed}
          simulationFrame={simulationFrame}
          width={width}
        />
      ) : (
        <div
          style={{
            ...baseLayerStyle,
            background: `radial-gradient(circle at ${buttonOrigin.x * 100}% ${buttonOrigin.y * 100}%, rgba(87,216,196,0.14) 0%, transparent 16%)`,
          }}
        />
      )}

      <button
        onClick={onPrimaryAction}
        style={{
          ...launchButtonBaseStyle,
          background: getLaunchButtonBackground(ready),
          transform: `translate(${(buttonOrigin.x - 0.5) * 110}px, ${(buttonOrigin.y - 0.5) * 110}px) scale(${pulse})`,
        }}
        type="button"
      >
        {ready ? "Simulation Running" : "Start Life Simulation"}
      </button>
    </>
  );
};

const AuroraAtom: React.FC = () => {
  return <div style={{...baseLayerStyle, ...getAuroraBackground()}} />;
};

const GridDriftAtom: React.FC<Pick<EffectAtomRuntimeProps, "absoluteFrame">> = ({absoluteFrame}) => {
  return <div style={{...baseLayerStyle, opacity: 0.38, ...getGridDriftBackground(absoluteFrame)}} />;
};

const NoiseBloomAtom: React.FC<Pick<EffectAtomRuntimeProps, "absoluteFrame">> = ({absoluteFrame}) => {
  return <div style={{...baseLayerStyle, opacity: 0.92, ...getNoiseBloomBackground(absoluteFrame)}} />;
};

export const EFFECT_ATOMS: Record<EffectAtomId, EffectAtomDefinition> = {
  aurora: {
    id: "aurora",
    title: "Aurora Overlay",
    description: "轻量氛围型中间层特效，适合叠在背景和文本之间。",
    Component: AuroraAtom,
  },
  "grid-drift": {
    id: "grid-drift",
    title: "Grid Drift",
    description: "规则网格漂移特效，适合信息感更强的科技模板。",
    Component: GridDriftAtom,
  },
  "noise-bloom": {
    id: "noise-bloom",
    title: "Noise Bloom",
    description: "噪声感光斑扩散层，可作为柔和过渡特效。",
    Component: NoiseBloomAtom,
  },
  "cellular-launch": {
    id: "cellular-launch",
    title: "Cellular Launch",
    description: "可点击启动的生命游戏入口特效，适合作为独立 effect atom 页面。",
    Component: CellularLaunchAtom,
  },
  "cellular-life": {
    id: "cellular-life",
    title: "Cellular Life",
    description: "持续运行的生命游戏中间层特效，当前由 Three.js + WebGL 驱动。",
    Component: CellularLifeAtom,
  },
};

export const getEffectAtomDefinition = (effectId: EffectAtomId) => EFFECT_ATOMS[effectId];
