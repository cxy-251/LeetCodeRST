type Direction = "up" | "right" | "down" | "left";

type SnakeCell = {
  x: number;
  y: number;
  tone: "head" | "body" | "food";
};

const hashNoise = (value: number, seed: number) => {
  const result = Math.sin(value * 12.9898 + seed * 78.233) * 43758.5453;
  return result - Math.floor(result);
};

const rotateLeft = (direction: Direction): Direction => {
  const order: Direction[] = ["up", "left", "down", "right"];
  const index = order.indexOf(direction);
  return order[(index + 1) % order.length];
};

const rotateRight = (direction: Direction): Direction => {
  const order: Direction[] = ["up", "right", "down", "left"];
  const index = order.indexOf(direction);
  return order[(index + 1) % order.length];
};

const stepForward = (
  x: number,
  y: number,
  direction: Direction,
  cols: number,
  rows: number,
) => {
  switch (direction) {
    case "up":
      return {x, y: (y - 1 + rows) % rows};
    case "right":
      return {x: (x + 1) % cols, y};
    case "down":
      return {x, y: (y + 1) % rows};
    case "left":
      return {x: (x - 1 + cols) % cols, y};
  }
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
  const snakeLength = 22;
  let direction: Direction = "right";
  let headX = Math.floor(cols * 0.34);
  let headY = Math.floor(rows * 0.46);
  const trail = [{x: headX, y: headY}];

  /**
   * We use a deterministic turn schedule instead of random state so the same
   * frame always reproduces the same snake path in both editor and video render.
   */
  for (let step = 1; step <= steps + snakeLength; step += 1) {
    if (step % 11 === 0) {
      const turnNoise = hashNoise(step, seed);
      direction = turnNoise > 0.5 ? rotateLeft(direction) : rotateRight(direction);
    }

    const next = stepForward(headX, headY, direction, cols, rows);
    headX = next.x;
    headY = next.y;
    trail.unshift(next);

    if (trail.length > snakeLength) {
      trail.pop();
    }
  }

  const foodStep = Math.max(0, Math.floor(frame / 18));
  const food = {
    x: (Math.floor(hashNoise(foodStep + 7, seed) * cols) + cols) % cols,
    y: (Math.floor(hashNoise(foodStep + 19, seed) * rows) + rows) % rows,
  };

  const cells: SnakeCell[] = trail.map((cell, index) => ({
    x: cell.x,
    y: cell.y,
    tone: index === 0 ? "head" : "body",
  }));
  cells.push({...food, tone: "food"});

  return cells;
};
