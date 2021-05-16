import getStroke from "perfect-freehand";

function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}

export function freehandDraw(
  points: Array<[x: number, y: number]>,
  color: string,
  ctx: CanvasRenderingContext2D
) {
  const pathData = getSvgPathFromStroke(getStroke(points));
  ctx.fillStyle = color;
  ctx.fill(new Path2D(pathData));
}
