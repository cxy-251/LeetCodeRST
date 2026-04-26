import type {
  BackgroundEffectId,
  BackgroundImageLayoutId,
  ProductionScene,
  RenderScene,
} from "@paper-to-video/shared-types";

const COVER_FOCUS_CYCLE: BackgroundImageLayoutId[] = [
  "cover-focus-tl",
  "cover-focus-tr",
  "cover-focus-br",
  "cover-focus-bl",
];

const LEGACY_EFFECT_MAP: Record<string, BackgroundEffectId> = {
  aurora: "aurora",
  "cover-grid-drift": "grid-drift",
  "cover-soft-focus": "none",
  "cover-noise-bloom": "noise-bloom",
  "cover-cellular-mask": "cellular-life",
};

export const resolveSceneBackgroundEffectId = (
  scene: Pick<ProductionScene, "backgroundPresetId" | "backgroundEffectId">,
): BackgroundEffectId => {
  return scene.backgroundEffectId ?? LEGACY_EFFECT_MAP[scene.backgroundPresetId] ?? "none";
};

export const resolveSceneBackgroundImageLayoutId = (
  scene: Pick<ProductionScene, "type" | "backgroundPresetId" | "backgroundImageLayoutId">,
  coverCycleIndex: number,
): BackgroundImageLayoutId => {
  if (scene.backgroundImageLayoutId) {
    return scene.backgroundImageLayoutId;
  }

  if (scene.type === "hero") {
    return "cover-full";
  }

  if (scene.backgroundPresetId.startsWith("cover-")) {
    return COVER_FOCUS_CYCLE[coverCycleIndex % COVER_FOCUS_CYCLE.length];
  }

  return "gradient-default";
};

export const getCoverLayoutConfig = (layoutId: BackgroundImageLayoutId) => {
  switch (layoutId) {
    case "cover-full":
      return {
        objectPosition: "center center",
        scale: 1.02,
        blurPx: 0,
        opacity: 0.92,
        brightness: 0.96,
        saturation: 1.02,
        shade: "linear-gradient(90deg, rgba(6,10,16,0.06) 0%, rgba(6,10,16,0.38) 46%, rgba(6,10,16,0.72) 100%)",
      };
    case "cover-focus-tl":
      return {
        objectPosition: "18% 18%",
        scale: 1.34,
        blurPx: 5,
        opacity: 0.76,
        brightness: 0.62,
        saturation: 0.96,
        shade: "linear-gradient(180deg, rgba(5,10,16,0.36) 0%, rgba(5,10,16,0.54) 100%)",
      };
    case "cover-focus-tr":
      return {
        objectPosition: "82% 18%",
        scale: 1.34,
        blurPx: 5,
        opacity: 0.76,
        brightness: 0.62,
        saturation: 0.96,
        shade: "linear-gradient(180deg, rgba(5,10,16,0.36) 0%, rgba(5,10,16,0.54) 100%)",
      };
    case "cover-focus-br":
      return {
        objectPosition: "80% 82%",
        scale: 1.36,
        blurPx: 6,
        opacity: 0.76,
        brightness: 0.6,
        saturation: 0.96,
        shade: "linear-gradient(180deg, rgba(5,10,16,0.38) 0%, rgba(5,10,16,0.56) 100%)",
      };
    case "cover-focus-bl":
      return {
        objectPosition: "20% 82%",
        scale: 1.36,
        blurPx: 6,
        opacity: 0.76,
        brightness: 0.6,
        saturation: 0.96,
        shade: "linear-gradient(180deg, rgba(5,10,16,0.38) 0%, rgba(5,10,16,0.56) 100%)",
      };
    case "gradient-default":
    default:
      return {
        objectPosition: "center center",
        scale: 1.04,
        blurPx: 8,
        opacity: 0.58,
        brightness: 0.58,
        saturation: 0.94,
        shade: "linear-gradient(180deg, rgba(5,10,16,0.46) 0%, rgba(5,10,16,0.64) 100%)",
      };
  }
};

export const getEffectAnchor = (layoutId: BackgroundImageLayoutId) => {
  switch (layoutId) {
    case "cover-focus-tl":
      return {x: 0.24, y: 0.24};
    case "cover-focus-tr":
      return {x: 0.76, y: 0.24};
    case "cover-focus-br":
      return {x: 0.76, y: 0.76};
    case "cover-focus-bl":
      return {x: 0.24, y: 0.76};
    case "cover-full":
      return {x: 0.5, y: 0.42};
    case "gradient-default":
    default:
      return {x: 0.5, y: 0.5};
  }
};

type LifeCell = {
  x: number;
  y: number;
  age: number;
  tone: number;
};

const hashNoise = (x: number, y: number, seed: number) => {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return value - Math.floor(value);
};

const buildInitialLifeState = (
  cols: number,
  rows: number,
  seed: number,
  anchorX: number,
  anchorY: number,
) => {
  const state = Array.from({length: rows}, () => Array.from({length: cols}, () => 0));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const nx = x / Math.max(1, cols - 1);
      const ny = y / Math.max(1, rows - 1);
      const dx = nx - anchorX;
      const dy = ny - anchorY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const ellipse = (dx * dx) / 0.08 + (dy * dy) / 0.13;
      const probability = 0.62 - distance * 0.7 + (ellipse < 1 ? 0.24 : -0.16);
      const noise = hashNoise(x, y, seed);
      state[y][x] = noise < probability ? 1 : 0;
    }
  }

  return state;
};

const countNeighbors = (grid: number[][], x: number, y: number) => {
  let total = 0;
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      const nextX = x + dx;
      const nextY = y + dy;
      if (nextX < 0 || nextX >= cols || nextY < 0 || nextY >= rows) {
        continue;
      }

      total += grid[nextY][nextX];
    }
  }

  return total;
};

const stepLife = (grid: number[][]) => {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const next = Array.from({length: rows}, () => Array.from({length: cols}, () => 0));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const neighbors = countNeighbors(grid, x, y);
      const alive = grid[y][x] === 1;
      next[y][x] = alive ? (neighbors === 2 || neighbors === 3 ? 1 : 0) : neighbors === 3 ? 1 : 0;
    }
  }

  return next;
};

export const buildCellularLifeCells = ({
  cols,
  rows,
  frame,
  seed,
  layoutId,
}: {
  cols: number;
  rows: number;
  frame: number;
  seed: number;
  layoutId: BackgroundImageLayoutId;
}): LifeCell[] => {
  const anchor = getEffectAnchor(layoutId);
  const steps = Math.max(1, Math.floor(frame / 4) % 18);
  let state = buildInitialLifeState(cols, rows, seed, anchor.x, anchor.y);

  for (let index = 0; index < steps; index += 1) {
    state = stepLife(state);
  }

  const cells: LifeCell[] = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (state[y][x] === 0) {
        continue;
      }

      cells.push({
        x,
        y,
        age: (x + y + steps) % 5,
        tone: hashNoise(x, y, seed) > 0.56 ? 1 : 0,
      });
    }
  }

  return cells;
};

export const getSceneVisualIds = (scene: Pick<RenderScene, "backgroundImageLayoutId" | "backgroundEffectId" | "backgroundPresetId">) => {
  return {
    backgroundImageLayoutId:
      scene.backgroundImageLayoutId ??
      (scene.backgroundPresetId.startsWith("cover-") ? "cover-focus-tl" : "gradient-default"),
    backgroundEffectId: scene.backgroundEffectId ?? (LEGACY_EFFECT_MAP[scene.backgroundPresetId] ?? "none"),
  };
};
