import { createDrawElementConfig } from "../draw-elements-drawer/DrawElementConfig";

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
    ctx.beginPath();
    ctx.strokeStyle = draw.color;
    ctx.moveTo(...draw.points[0]);
    draw.points.forEach((point) => {
      ctx.lineTo(...point);
    });
    ctx.stroke();
  },
  onCreate(x, y) {
    return {
      color: "black",
      points: [[x, y]],
    };
  },
  onPointerMove(dx, dy, draw) {
    const [x, y] = draw.points[draw.points.length - 1];
    return {
      points: [...draw.points, [x + dx, y + dy]] as Array<[number, number]>,
    };
  },
});
