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

const DIRECTIONS: Direction[] = ["up", "right", "down", "left"];

const hashNoise = (value: number, seed: number) => {
  const result = Math.sin(value * 12.9898 + seed * 78.233) * 43758.5453;
  return result - Math.floor(result);
};

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

const pointKey = (point: Point) => `${point.x},${point.y}`;

const sortDirectionsTowardFood = ({
  head,
  food,
  cols,
  rows,
  wrap,
}: {
  head: Point;
  food: Point;
  cols: number;
  rows: number;
  wrap: boolean;
}) => {
  return [...DIRECTIONS].sort((left, right) => {
    const leftPoint = stepForward(head, left, cols, rows, wrap) ?? head;
    const rightPoint = stepForward(head, right, cols, rows, wrap) ?? head;
    const leftScore = manhattanDistance(leftPoint, food);
    const rightScore = manhattanDistance(rightPoint, food);

    return leftScore - rightScore;
  });
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
   * Food stays alive until the snake reaches it. We spawn each item from a
   * deterministic cursor so editor preview, Remotion render, and effect-only
   * output share the exact same arena state.
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

const findBestFoodTarget = ({
  head,
  foods,
}: {
  head: Point;
  foods: FoodItem[];
}) => {
  return foods.reduce<FoodItem | null>((closest, candidate) => {
    if (!closest) {
      return candidate;
    }

    const candidateScore = manhattanDistance(head, candidate) - candidate.value * 0.9;
    const closestScore = manhattanDistance(head, closest) - closest.value * 0.9;

    if (candidateScore === closestScore) {
      return candidate.value > closest.value ? candidate : closest;
    }

    return candidateScore < closestScore ? candidate : closest;
  }, null);
};

const chooseNextHead = ({
  snake,
  targetFood,
  cols,
  rows,
  wrap,
}: {
  snake: Point[];
  targetFood: FoodItem | null;
  cols: number;
  rows: number;
  wrap: boolean;
}) => {
  const head = snake[0];
  const movableBody = snake.slice(0, -1);
  const blocked = new Set(movableBody.map(pointKey));
  const ordered = targetFood
    ? sortDirectionsTowardFood({head, food: targetFood, cols, rows, wrap})
    : [...DIRECTIONS];

  for (const direction of ordered) {
    const next = stepForward(head, direction, cols, rows, wrap);
    if (!next) {
      continue;
    }

    if (!blocked.has(pointKey(next))) {
      return next;
    }
  }

  for (const direction of DIRECTIONS) {
    const next = stepForward(head, direction, cols, rows, wrap);
    if (!next) {
      continue;
    }

    if (!blocked.has(pointKey(next))) {
      return next;
    }
  }

  return stepForward(head, ordered[0] ?? "right", cols, rows, wrap) ?? head;
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
    const targetFood = findBestFoodTarget({
      head: snake[0],
      foods,
    });
    const nextHead = chooseNextHead({snake, targetFood, cols, rows, wrap});
    snake.unshift(nextHead);
    const eatenFoodIndex = foods.findIndex(
      (food) => nextHead.x === food.x && nextHead.y === food.y,
    );

    if (eatenFoodIndex >= 0) {
      const eatenFood = foods[eatenFoodIndex];
      foods.splice(eatenFoodIndex, 1);
      /**
       * Different food tiers act like score multipliers. High-value pickups grow
       * the snake faster so the effect reads like a quick clear rather than a
       * slow single-target chase.
       */
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
