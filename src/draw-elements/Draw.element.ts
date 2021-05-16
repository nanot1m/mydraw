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
});
