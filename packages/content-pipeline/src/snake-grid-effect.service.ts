type Direction = "up" | "right" | "down" | "left";

type SnakeCell = {
  x: number;
  y: number;
  tone: "head" | "body" | "food-low" | "food-mid" | "food-high";
};

type Point = {
  x: number;
  y: number;
};

type FoodItem = Point & {
  value: 1 | 2 | 4;
  tone: "food-low" | "food-mid" | "food-high";
};

type MoveEvaluation = {
  nextHead: Point;
  areaScore: number;
  bestFoodScore: number;
  tailDistance: number;
  tailReachable: boolean;
  immediateFoodValue: number;
};

const DIRECTIONS: Direction[] = ["up", "right", "down", "left"];

const hashNoise = (value: number, seed: number) => {
  const result = Math.sin(value * 12.9898 + seed * 78.233) * 43758.5453;
  return result - Math.floor(result);
};

const pointKey = (point: Point) => `${point.x},${point.y}`;

const stepForward = (
  point: Point,
  direction: Direction,
  cols: number,
  rows: number,
  wrap: boolean,
): Point | null => {
  switch (direction) {
    case "up":
      return point.y > 0 ? {x: point.x, y: point.y - 1} : wrap ? {x: point.x, y: rows - 1} : null;
    case "right":
      return point.x < cols - 1 ? {x: point.x + 1, y: point.y} : wrap ? {x: 0, y: point.y} : null;
    case "down":
      return point.y < rows - 1 ? {x: point.x, y: point.y + 1} : wrap ? {x: point.x, y: 0} : null;
    case "left":
      return point.x > 0 ? {x: point.x - 1, y: point.y} : wrap ? {x: cols - 1, y: point.y} : null;
  }
};

const manhattanDistance = (from: Point, to: Point) => Math.abs(to.x - from.x) + Math.abs(to.y - from.y);

const buildDistanceField = ({
  start,
  cols,
  rows,
  wrap,
  blocked,
}: {
  start: Point;
  cols: number;
  rows: number;
  wrap: boolean;
  blocked: Set<string>;
}) => {
  const queue: Point[] = [start];
  const visited = new Map<string, number>([[pointKey(start), 0]]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDistance = visited.get(pointKey(current)) ?? 0;

    for (const direction of DIRECTIONS) {
      const next = stepForward(current, direction, cols, rows, wrap);
      if (!next) {
        continue;
      }

      const key = pointKey(next);
      if (blocked.has(key) || visited.has(key)) {
        continue;
      }

      visited.set(key, currentDistance + 1);
      queue.push(next);
    }
  }

  return visited;
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

const spawnFood = ({
  cols,
  rows,
  seed,
  spawnCursor,
  snake,
  existingFoods,
}: {
  cols: number;
  rows: number;
  seed: number;
  spawnCursor: number;
  snake: Point[];
  existingFoods: FoodItem[];
}) => {
  const occupied = new Set([...snake, ...existingFoods].map(pointKey));

  /**
   * Deterministic food spawning keeps the editor preview, Remotion render, and
   * effect-only output on the exact same board without runtime React state.
   */
  for (let attempt = 0; attempt < cols * rows; attempt += 1) {
    const x = Math.floor(hashNoise(spawnCursor * 37 + attempt * 11 + 7, seed) * cols) % cols;
    const y = Math.floor(hashNoise(spawnCursor * 53 + attempt * 17 + 19, seed) * rows) % rows;
    const candidate = {x, y};

    if (!occupied.has(pointKey(candidate))) {
      return {
        ...candidate,
        ...pickFoodProfile(spawnCursor + attempt, seed),
      } satisfies FoodItem;
    }
  }

  return {
    x: 0,
    y: 0,
    value: 1,
    tone: "food-low",
  } satisfies FoodItem;
};

const simulateSnakeMove = ({
  snake,
  nextHead,
  nextLength,
}: {
  snake: Point[];
  nextHead: Point;
  nextLength: number;
}) => {
  const nextSnake = [nextHead, ...snake];
  while (nextSnake.length > nextLength) {
    nextSnake.pop();
  }
  return nextSnake;
};

const evaluateMove = ({
  nextHead,
  snake,
  foods,
  cols,
  rows,
  wrap,
}: {
  nextHead: Point;
  snake: Point[];
  foods: FoodItem[];
  cols: number;
  rows: number;
  wrap: boolean;
}): MoveEvaluation => {
  const eatenFood = foods.find((food) => food.x === nextHead.x && food.y === nextHead.y) ?? null;
  const nextLength = snake.length + (eatenFood?.value ?? 0);
  const nextSnake = simulateSnakeMove({snake, nextHead, nextLength});
  const tail = nextSnake[nextSnake.length - 1];
  const blocked = new Set(nextSnake.slice(0, -1).map(pointKey));
  const distances = buildDistanceField({
    start: nextHead,
    cols,
    rows,
    wrap,
    blocked,
  });
  const tailDistance = distances.get(pointKey(tail)) ?? Number.POSITIVE_INFINITY;
  const remainingFoods = eatenFood
    ? foods.filter((food) => !(food.x === eatenFood.x && food.y === eatenFood.y))
    : foods;

  let bestFoodScore = Number.NEGATIVE_INFINITY;
  remainingFoods.forEach((food) => {
    const distance = distances.get(pointKey(food));
    if (distance === undefined) {
      return;
    }

    const score = food.value * 10 - distance * 0.9;
    if (score > bestFoodScore) {
      bestFoodScore = score;
    }
  });

  return {
    nextHead,
    areaScore: distances.size,
    bestFoodScore,
    tailDistance,
    tailReachable: Number.isFinite(tailDistance),
    immediateFoodValue: eatenFood?.value ?? 0,
  };
};

const chooseNextHead = ({
  snake,
  foods,
  cols,
  rows,
  wrap,
}: {
  snake: Point[];
  foods: FoodItem[];
  cols: number;
  rows: number;
  wrap: boolean;
}) => {
  const head = snake[0];
  const blocked = new Set(snake.slice(0, -1).map(pointKey));
  const evaluations: MoveEvaluation[] = [];

  for (const direction of DIRECTIONS) {
    const next = stepForward(head, direction, cols, rows, wrap);
    if (!next) {
      continue;
    }

    if (blocked.has(pointKey(next))) {
      continue;
    }

    evaluations.push(
      evaluateMove({
        nextHead: next,
        snake,
        foods,
        cols,
        rows,
        wrap,
      }),
    );
  }

  if (evaluations.length === 0) {
    return head;
  }

  /**
   * We only take food-chasing moves that still leave an escape route to the tail.
   * When that is not possible, we pick the move that keeps the largest reachable
   * area so the snake avoids folding itself into a dead pocket.
   */
  evaluations.sort((left, right) => {
    if (left.tailReachable !== right.tailReachable) {
      return left.tailReachable ? -1 : 1;
    }

    if (left.immediateFoodValue !== right.immediateFoodValue) {
      return right.immediateFoodValue - left.immediateFoodValue;
    }

    if (left.bestFoodScore !== right.bestFoodScore) {
      return right.bestFoodScore - left.bestFoodScore;
    }

    if (left.areaScore !== right.areaScore) {
      return right.areaScore - left.areaScore;
    }

    return left.tailDistance - right.tailDistance;
  });

  return evaluations[0]?.nextHead ?? head;
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
  const steps = Math.max(0, Math.floor(frame / 3));
  let targetLength = 18;
  let spawnCursor = 0;
  const wrap = false;
  const snake: Point[] = [];

  for (let index = 0; index < targetLength; index += 1) {
    snake.push({
      x: Math.max(2, Math.floor(cols * 0.2)) - index,
      y: Math.floor(rows * 0.52),
    });
  }

  const foods: FoodItem[] = [];

  const refillFoods = () => {
    while (foods.length < foodCount) {
      foods.push(
        spawnFood({
          cols,
          rows,
          seed,
          spawnCursor,
          snake,
          existingFoods: foods,
        }),
      );
      spawnCursor += 1;
    }
  };

  refillFoods();

  for (let step = 0; step < steps; step += 1) {
    const nextHead = chooseNextHead({
      snake,
      foods,
      cols,
      rows,
      wrap,
    });
    snake.unshift(nextHead);
    const eatenFoodIndex = foods.findIndex(
      (food) => nextHead.x === food.x && nextHead.y === food.y,
    );

    if (eatenFoodIndex >= 0) {
      const eatenFood = foods[eatenFoodIndex];
      foods.splice(eatenFoodIndex, 1);
      targetLength += eatenFood?.value ?? 1;
      refillFoods();
    }

    while (snake.length > targetLength) {
      snake.pop();
    }
  }

  const cells: SnakeCell[] = snake.map((cell, index) => ({
    x: cell.x,
    y: cell.y,
    tone: index === 0 ? "head" : "body",
  }));

  foods.forEach((food) => {
    cells.push(food);
  });

  return cells;
};
