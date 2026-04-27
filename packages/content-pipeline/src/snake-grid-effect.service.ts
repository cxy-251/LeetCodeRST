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
    const leftScore =
      wrapDistance(leftPoint.x, food.x, cols) + wrapDistance(leftPoint.y, food.y, rows);
    const rightScore =
      wrapDistance(rightPoint.x, food.x, cols) + wrapDistance(rightPoint.y, food.y, rows);

    return leftScore - rightScore;
  });
};

const spawnFood = ({
  cols,
  rows,
  seed,
  eatenCount,
  snake,
}: {
  cols: number;
  rows: number;
  seed: number;
  eatenCount: number;
  snake: Point[];
}) => {
  const occupied = new Set(snake.map(pointKey));

  /**
   * Food stays alive until the snake reaches it. When spawning a new target,
   * we walk a deterministic sequence so editor and final render stay identical.
   */
  for (let attempt = 0; attempt < cols * rows; attempt += 1) {
    const x = Math.floor(hashNoise(eatenCount * 37 + attempt * 11 + 7, seed) * cols) % cols;
    const y = Math.floor(hashNoise(eatenCount * 53 + attempt * 17 + 19, seed) * rows) % rows;
    const candidate = {x, y};

    if (!occupied.has(pointKey(candidate))) {
      return candidate;
    }
  }

  return {x: 0, y: 0};
};

const chooseNextHead = ({
  snake,
  food,
  cols,
  rows,
}: {
  snake: Point[];
  food: Point;
  cols: number;
  rows: number;
}) => {
  const head = snake[0];
  const movableBody = snake.slice(0, -1);
  const blocked = new Set(movableBody.map(pointKey));
  const ordered = sortDirectionsTowardFood({head, food, cols, rows});

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
}: {
  cols: number;
  rows: number;
  frame: number;
  seed: number;
}) => {
  const steps = Math.max(0, Math.floor(frame / 3));
  let targetLength = 18;
  let eatenCount = 0;
  const snake: Point[] = [];

  for (let index = 0; index < targetLength; index += 1) {
    snake.push({
      x: (Math.floor(cols * 0.28) - index + cols) % cols,
      y: Math.floor(rows * 0.48),
    });
  }

  let food = spawnFood({cols, rows, seed, eatenCount, snake});

  for (let step = 0; step < steps; step += 1) {
    const nextHead = chooseNextHead({snake, food, cols, rows});
    snake.unshift(nextHead);
    const ateFood = nextHead.x === food.x && nextHead.y === food.y;

    if (ateFood) {
      eatenCount += 1;
      targetLength += 2;
      food = spawnFood({cols, rows, seed, eatenCount, snake});
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
  cells.push({...food, tone: "food"});

  return cells;
};
