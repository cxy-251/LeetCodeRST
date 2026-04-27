import React from "react";
import {ThreeLifeEffect} from "./three-life-effect";
import {
  getAuroraBackground,
  getGridDriftBackground,
  getLaunchButtonState,
  getNoiseBloomBackground,
} from "./effect-atoms.service";
import type {EffectAtomDefinition, EffectAtomId, EffectAtomRuntimeProps} from "./effect-atoms.types";
import styles from "./effect-atoms.module.css";

const cx = (...classNames: Array<string | false | null | undefined>) => classNames.filter(Boolean).join(" ");

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
          className={cx(styles.layer, styles.launchHalo)}
          style={{
            background: `radial-gradient(circle at ${buttonOrigin.x * 100}% ${buttonOrigin.y * 100}%, rgba(87,216,196,0.14) 0%, transparent 16%)`,
          }}
        />
      )}

      <button
        className={cx(
          styles.launchButton,
          ready ? styles.launchButtonRunning : styles.launchButtonIdle,
        )}
        onClick={onPrimaryAction}
        style={{
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
  return <div className={cx(styles.layer, styles.auroraLayer)} style={getAuroraBackground()} />;
};

const GridDriftAtom: React.FC<Pick<EffectAtomRuntimeProps, "absoluteFrame">> = ({absoluteFrame}) => {
  return <div className={cx(styles.layer, styles.gridLayer)} style={getGridDriftBackground(absoluteFrame)} />;
};

const NoiseBloomAtom: React.FC<Pick<EffectAtomRuntimeProps, "absoluteFrame">> = ({absoluteFrame}) => {
  return <div className={cx(styles.layer, styles.noiseLayer)} style={getNoiseBloomBackground(absoluteFrame)} />;
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
