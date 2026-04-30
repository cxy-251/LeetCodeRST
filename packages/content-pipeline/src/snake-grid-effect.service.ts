type Direction = "up" | "right" | "down" | "left";

type SnakeCell = {
  x: number;
  y: number;
  tone: "head" | "body" | "food";
};

type Point = {
  x: number;
  y: number;
};

const DIRECTIONS: Direction[] = ["up", "right", "down", "left"];

const hashNoise = (value: number, seed: number) => {
  const result = Math.sin(value * 12.9898 + seed * 78.233) * 43758.5453;
  return result - Math.floor(result);
};

const stepForward = (point: Point, direction: Direction, cols: number, rows: number): Point => {
  switch (direction) {
    case "up":
      return {x: point.x, y: (point.y - 1 + rows) % rows};
    case "right":
      return {x: (point.x + 1) % cols, y: point.y};
    case "down":
      return {x: point.x, y: (point.y + 1) % rows};
    case "left":
      return {x: (point.x - 1 + cols) % cols, y: point.y};
  }
};

const wrapDistance = (from: number, to: number, size: number) => {
  const diff = Math.abs(to - from);
  return Math.min(diff, size - diff);
};

const pointKey = (point: Point) => `${point.x},${point.y}`;

const getFoodDistanceScore = ({
  from,
  food,
  cols,
  rows,
}: {
  from: Point;
  food: Point;
  cols: number;
  rows: number;
}) => {
  return wrapDistance(from.x, food.x, cols) + wrapDistance(from.y, food.y, rows);
};

const sortDirectionsTowardFood = ({
  head,
  food,
  cols,
  rows,
}: {
  head: Point;
  food: Point;
  cols: number;
  rows: number;
}) => {
  return [...DIRECTIONS].sort((left, right) => {
    const leftPoint = stepForward(head, left, cols, rows);
    const rightPoint = stepForward(head, right, cols, rows);
    const leftScore = getFoodDistanceScore({from: leftPoint, food, cols, rows});
    const rightScore = getFoodDistanceScore({from: rightPoint, food, cols, rows});

    return leftScore - rightScore;
  });
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
  existingFoods: Point[];
}) => {
  const occupied = new Set([...snake, ...existingFoods].map(pointKey));

  /**
   * Food stays alive until the snake reaches it. We spawn each item from a
   * deterministic cursor so the editor preview, Remotion render, and effect-only
   * output all reuse the exact same food field without React state.
   */
  for (let attempt = 0; attempt < cols * rows; attempt += 1) {
    const x = Math.floor(hashNoise(spawnCursor * 37 + attempt * 11 + 7, seed) * cols) % cols;
    const y = Math.floor(hashNoise(spawnCursor * 53 + attempt * 17 + 19, seed) * rows) % rows;
    const candidate = {x, y};

    if (!occupied.has(pointKey(candidate))) {
      return candidate;
    }
  }

  return {x: 0, y: 0};
};

const findNearestFood = ({
  head,
  foods,
  cols,
  rows,
}: {
  head: Point;
  foods: Point[];
  cols: number;
  rows: number;
}) => {
  return foods.reduce<Point | null>((closest, candidate) => {
    if (!closest) {
      return candidate;
    }

    return getFoodDistanceScore({from: head, food: candidate, cols, rows}) <
      getFoodDistanceScore({from: head, food: closest, cols, rows})
      ? candidate
      : closest;
  }, null);
};

const chooseNextHead = ({
  snake,
  targetFood,
  cols,
  rows,
}: {
  snake: Point[];
  targetFood: Point | null;
  cols: number;
  rows: number;
}) => {
  const head = snake[0];
  const movableBody = snake.slice(0, -1);
  const blocked = new Set(movableBody.map(pointKey));
  const ordered = targetFood
    ? sortDirectionsTowardFood({head, food: targetFood, cols, rows})
    : [...DIRECTIONS];

  for (const direction of ordered) {
    const next = stepForward(head, direction, cols, rows);
    if (!blocked.has(pointKey(next))) {
      return next;
    }
  }

  for (const direction of DIRECTIONS) {
    const next = stepForward(head, direction, cols, rows);
    if (!blocked.has(pointKey(next))) {
      return next;
    }
  }

  return stepForward(head, ordered[0] ?? "right", cols, rows);
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
  const snake: Point[] = [];

  for (let index = 0; index < targetLength; index += 1) {
    snake.push({
      x: (Math.floor(cols * 0.28) - index + cols) % cols,
      y: Math.floor(rows * 0.48),
    });
  }

  const foods: Point[] = [];

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
    const targetFood = findNearestFood({
      head: snake[0],
      foods,
      cols,
      rows,
    });
    const nextHead = chooseNextHead({snake, targetFood, cols, rows});
    snake.unshift(nextHead);
    const eatenFoodIndex = foods.findIndex(
      (food) => nextHead.x === food.x && nextHead.y === food.y,
    );

    if (eatenFoodIndex >= 0) {
      foods.splice(eatenFoodIndex, 1);
      targetLength += 2;
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
    cells.push({...food, tone: "food"});
  });

  return cells;
};
