import { createDrawElementConfig } from "../draw-elements-drawer/DrawElementConfig";
import { freehandDraw } from "../freehand-draw";

export interface Draw {
  color: string;
  points: Array<[x: number, y: number]>;
}

declare module "./DrawElements" {
  interface DrawElements {
    Draw: Draw;
  }
}

export const config = createDrawElementConfig({
  name: "Draw",
  draw(draw, ctx) {
    if (draw.points.length === 0) {
      return;
    }
    freehandDraw(draw.points, draw.color, ctx);
  },
  onCreate(x, y) {
    return {
      color: "black",
      points: [[x, y]],
    };
  },
  onDrawing(dx, dy, draw) {
    const [x, y] = draw.points[draw.points.length - 1];
    return {
      points: [...draw.points, [x + dx, y + dy]] as Array<[number, number]>,
    };
  },
  getBoundingBox(draw) {
    const x = Math.min(...draw.points.map((p) => p[0]));
    const y = Math.min(...draw.points.map((p) => p[1]));
    return {
      x: x,
      y: y,
      width: Math.max(...draw.points.map((p) => p[0])) - x,
      height: Math.max(...draw.points.map((p) => p[1])) - y,
    };
  },
  containsPoint(draw, [x, y]) {
    const x0 = Math.min(...draw.points.map((p) => p[0]));
    const y0 = Math.min(...draw.points.map((p) => p[1]));
    const x1 = Math.max(...draw.points.map((p) => p[0]));
    const y1 = Math.max(...draw.points.map((p) => p[1]));
    return (
      Math.min(x0, x1) <= x &&
      Math.max(x0, x1) >= x &&
      Math.min(y0, y1) <= y &&
      Math.max(y0, y1) >= y
    );
  },
  shift(draw, [dx, dy]) {
    return {
      ...draw,
      points: draw.points.map(([x, y]) => [x + dx, y + dy]),
    };
  },
});
