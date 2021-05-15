import { createDrawElementConfig } from "../draw-elements-drawer/register-drawers";

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
    console.log(line);
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
  onPointerMove(dx: number, dy: number, line: Line) {
    return {
      x1: line.x1 + dx,
      y1: line.y1 + dy,
    };
  },
});
