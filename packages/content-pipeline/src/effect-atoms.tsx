import React from "react";
import {getCellularLaunchOrigin} from "./visual-system";
import {ThreeLifeEffect} from "./three-life-effect";
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
  const buttonOrigin = getCellularLaunchOrigin();
  const pulseFrame = simulationFrame ?? absoluteFrame;
  const pulse = 1 + Math.sin(pulseFrame / 7) * 0.04;
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
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at ${buttonOrigin.x * 100}% ${buttonOrigin.y * 100}%, rgba(87,216,196,0.14) 0%, transparent 16%)`,
          }}
        />
      )}

      <button
        onClick={onPrimaryAction}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 260,
          marginLeft: -130,
          marginTop: -28,
          padding: "18px 22px",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.16)",
          background: ready ? "rgba(7,18,29,0.36)" : "rgba(5,12,20,0.58)",
          color: "#f4f7fb",
          fontSize: 15,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textAlign: "center",
          boxShadow: "0 0 0 10px rgba(87,216,196,0.08), 0 18px 48px rgba(0,0,0,0.28)",
          transform: `translate(${(buttonOrigin.x - 0.5) * 110}px, ${(buttonOrigin.y - 0.5) * 110}px) scale(${pulse})`,
          zIndex: 2,
          cursor: "pointer",
        }}
        type="button"
      >
        {ready ? "Simulation Running" : "Start Life Simulation"}
      </button>
    </>
  );
};

const AuroraAtom: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle at 18% 22%, rgba(87,216,196,0.14) 0%, transparent 22%), radial-gradient(circle at 82% 76%, rgba(255,255,255,0.1) 0%, transparent 18%)",
        pointerEvents: "none",
      }}
    />
  );
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
    Component: () => (
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.38,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(87,216,196,0.14) 0%, transparent 40%, rgba(255,255,255,0.08) 100%)
          `,
          backgroundSize: "44px 44px, 44px 44px, 100% 100%",
        }}
      />
    ),
  },
  "noise-bloom": {
    id: "noise-bloom",
    title: "Noise Bloom",
    description: "噪声感光斑扩散层，可作为柔和过渡特效。",
    Component: ({absoluteFrame}) => (
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.92,
          pointerEvents: "none",
          background: `
            radial-gradient(circle at ${22 + (absoluteFrame % 24)}% 24%, rgba(87,216,196,0.18) 0%, transparent 24%),
            radial-gradient(circle at 80% ${68 + (absoluteFrame % 16) * 0.4}%, rgba(255,255,255,0.12) 0%, transparent 18%)
          `,
        }}
      />
    ),
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
