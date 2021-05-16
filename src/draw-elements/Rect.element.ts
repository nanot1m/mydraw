import { createDrawElementConfig } from "../draw-elements-drawer/DrawElementConfig";

export interface Rect {
  strokeColor: string;
  backgroundColor: string;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

declare module "./DrawElements" {
  interface DrawElements {
    Rect: Rect;
  }
}

export const config = createDrawElementConfig({
  name: "Rect",
  draw(rect, ctx) {
    ctx.lineWidth = 4;
    ctx.strokeStyle = rect.strokeColor;
    ctx.fillStyle = rect.backgroundColor;
    ctx.beginPath();
    ctx.rect(rect.x0, rect.y0, rect.x1 - rect.x0, rect.y1 - rect.y0);
    ctx.fill();
    ctx.stroke();
  },
  onCreate(x, y) {
    return {
      backgroundColor: "pink",
      strokeColor: "black",
      x0: x,
      y0: y,
      x1: x,
      y1: y,
    };
  },
  onDrawing(dx, dy, rect) {
    return {
      x1: rect.x1 + dx,
      y1: rect.y1 + dy,
    };
  },
});
