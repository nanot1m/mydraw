import { createDrawElementConfig } from "../draw-elements-drawer/DrawElementConfig";

export interface Line {
  color: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

declare module "./DrawElements" {
  interface DrawElements {
    Line: Line;
  }
}

export const config = createDrawElementConfig({
  name: "Line",
  draw(line, ctx) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = line.color;
    ctx.beginPath();
    ctx.moveTo(line.x0, line.y0);
    ctx.lineTo(line.x1, line.y1);
    ctx.stroke();
  },
  onCreate(x: number, y: number) {
    return {
      color: "#000000",
      x0: x,
      y0: y,
      x1: x,
      y1: y,
    };
  },
  onDrawing(dx: number, dy: number, line: Line) {
    return {
      x1: line.x1 + dx,
      y1: line.y1 + dy,
    };
  },
  getBoundingBox(line: Line) {
    return {
      x: Math.min(line.x0, line.x1),
      y: Math.min(line.y0, line.y1),
      width: Math.abs(line.x0 - line.x1),
      height: Math.abs(line.y0 - line.y1),
    };
  },
  containsPoint(line, [x, y]) {
    return (
      Math.min(line.x0, line.x1) <= x &&
      Math.max(line.x0, line.x1) >= x &&
      Math.min(line.y0, line.y1) <= y &&
      Math.max(line.y0, line.y1) >= y
    );
  },
  shift(line, [dx, dy]) {
    return {
      ...line,
      x0: line.x0 + dx,
      y0: line.y0 + dy,
      x1: line.x1 + dx,
      y1: line.y1 + dy,
    };
  },
});
