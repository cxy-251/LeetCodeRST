type SnakeCellTone = "head" | "body" | "food-low" | "food-mid" | "food-high";

type SnakeCell = {
  x: number;
  y: number;
  tone: SnakeCellTone;
};

type Point = {
  x: number;
  y: number;
};

type FoodItem = {
  index: number;
  value: 1 | 2 | 4;
  tone: Extract<SnakeCellTone, "food-low" | "food-mid" | "food-high">;
};

type LoopLayout = {
  order: Point[];
};

const hashNoise = (value: number, seed: number) => {
  const result = Math.sin(value * 12.9898 + seed * 78.233) * 43758.5453;
  return result - Math.floor(result);
};

const modulo = (value: number, size: number) => ((value % size) + size) % size;

const buildSafeLoop = (cols: number, rows: number): LoopLayout => {
  const order: Point[] = [];

  for (let x = 0; x < cols; x += 1) {
    order.push({x, y: 0});
  }

  for (let y = 1; y < rows; y += 1) {
    if (y % 2 === 1) {
      for (let x = cols - 1; x >= 1; x -= 1) {
        order.push({x, y});
      }
      continue;
    }

    for (let x = 1; x < cols; x += 1) {
      order.push({x, y});
    }
  }

  for (let y = rows - 1; y >= 1; y -= 1) {
    order.push({x: 0, y});
  }

  return {order};
};

const pickFoodProfile = (spawnCursor: number, seed: number): Pick<FoodItem, "value" | "tone"> => {
  const profileNoise = hashNoise(spawnCursor * 97 + 13, seed);
  if (profileNoise > 0.84) {
    return {value: 4, tone: "food-high"};
  }

  if (profileNoise > 0.5) {
    return {value: 2, tone: "food-mid"};
  }

  return {value: 1, tone: "food-low"};
};

const spawnFoodOnLoop = ({
  layout,
  seed,
  spawnCursor,
  snakeIndices,
  foods,
}: {
  layout: LoopLayout;
  seed: number;
  spawnCursor: number;
  snakeIndices: number[];
  foods: FoodItem[];
}) => {
  const occupied = new Set<number>([...snakeIndices, ...foods.map((food) => food.index)]);
  const cycleLength = layout.order.length;

  /**
   * The snake now follows a deterministic safe loop. We only spawn food on
   * unoccupied indices of that same loop so the editor preview, Remotion render,
   * and effect-only render all stay perfectly in sync.
   */
  for (let attempt = 0; attempt < cycleLength; attempt += 1) {
    const index = Math.floor(hashNoise(spawnCursor * 37 + attempt * 11 + 7, seed) * cycleLength) % cycleLength;
    if (!occupied.has(index)) {
      return {
        index,
        ...pickFoodProfile(spawnCursor + attempt, seed),
      } satisfies FoodItem;
    }
  }

  return null;
};

export const buildSnakeGridCells = ({
  cols,
  rows,
  frame,
  seed,
  foodCount,
}: {
  cols: number;
  rows: number;
  frame: number;
  seed: number;
  foodCount: number;
}) => {
  const loop = buildSafeLoop(cols, rows);
  const cycleLength = loop.order.length;
  const steps = Math.max(0, Math.floor(frame));
  const maxLength = Math.max(16, cycleLength - Math.max(8, Math.min(cycleLength - 1, foodCount + 6)));
  let targetLength = Math.min(18, maxLength);
  let spawnCursor = 0;
  const startIndex = Math.floor(hashNoise(seed * 13.1 + 7, seed + 11) * cycleLength) % cycleLength;
  const snakeIndices: number[] = [];

  /**
   * Initializing the body as a contiguous segment on the loop guarantees that
   * every subsequent step stays safe as long as we keep following the same loop.
   */
  for (let index = 0; index < targetLength; index += 1) {
    snakeIndices.push(modulo(startIndex - index, cycleLength));
  }

  const foods: FoodItem[] = [];

  const refillFoods = () => {
    const desiredFoodCount = Math.min(foodCount, Math.max(0, cycleLength - snakeIndices.length - 2));
    while (foods.length > desiredFoodCount) {
      foods.pop();
    }

    while (foods.length < desiredFoodCount) {
      const nextFood = spawnFoodOnLoop({
        layout: loop,
        seed,
        spawnCursor,
        snakeIndices,
        foods,
      });

      if (!nextFood) {
        break;
      }

      foods.push(nextFood);
      spawnCursor += 1;
    }
  };

  refillFoods();

  for (let step = 0; step < steps; step += 1) {
    const nextHeadIndex = modulo(snakeIndices[0] + 1, cycleLength);
    const eatenFoodIndex = foods.findIndex((food) => food.index === nextHeadIndex);
    if (eatenFoodIndex >= 0) {
      const eatenFood = foods[eatenFoodIndex];
      foods.splice(eatenFoodIndex, 1);
      targetLength = Math.min(maxLength, targetLength + (eatenFood?.value ?? 1));
    }

    snakeIndices.unshift(nextHeadIndex);
    while (snakeIndices.length > targetLength) {
      snakeIndices.pop();
    }

    refillFoods();
  }

  const cells: SnakeCell[] = snakeIndices.map((index, cellIndex) => {
    const point = loop.order[index] ?? loop.order[0] ?? {x: 0, y: 0};
    return {
      x: point.x,
      y: point.y,
      tone: cellIndex === 0 ? "head" : "body",
    };
  });

  foods.forEach((food) => {
    const point = loop.order[food.index] ?? loop.order[0] ?? {x: 0, y: 0};
    cells.push({
      x: point.x,
      y: point.y,
      tone: food.tone,
    });
  });

  return cells;
};
