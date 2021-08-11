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

const CONTAINS_THRESHOLD = 4;

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
      backgroundColor: "transparent",
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
  getBoundingBox(rect) {
    return {
      x: Math.min(rect.x0, rect.x1),
      y: Math.min(rect.y0, rect.y1),
      width: Math.abs(rect.x1 - rect.x0),
      height: Math.abs(rect.y1 - rect.y0),
    };
  },
  containsPoint(rect, [x, y]) {
    return (
      Math.min(rect.x0, rect.x1) - CONTAINS_THRESHOLD <= x &&
      Math.max(rect.x0, rect.x1) + CONTAINS_THRESHOLD >= x &&
      Math.min(rect.y0, rect.y1) - CONTAINS_THRESHOLD <= y &&
      Math.max(rect.y0, rect.y1) + CONTAINS_THRESHOLD >= y
    );
  },
});
