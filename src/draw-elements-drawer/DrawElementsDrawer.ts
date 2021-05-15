import {
  DrawElementByType,
  DrawElementType,
} from "../draw-elements/DrawElements";

export type DrawElementsDrawer<Type extends DrawElementType> = (
  drawElement: DrawElementByType<Type>,
  ctx: CanvasRenderingContext2D
) => void;
