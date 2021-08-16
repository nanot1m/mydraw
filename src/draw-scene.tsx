import { DrawElements, DrawElementType } from "./draw-elements/DrawElements";
import { GlobalId } from "./global-id";
import { Point2D } from "./point-2d";
import { DrawElement } from "./draw-element";
import { DrawElementConfig } from "./draw-elements-drawer/draw-element-config";

export function drawScene(
  ctx: CanvasRenderingContext2D,
  drawElements: DrawElement[],
  draftElement: DrawElement | null,
  selectedElements: GlobalId[],
  [scrollX, scrollY]: Point2D,
  drawElementConfigRegistry: Record<DrawElementType, DrawElementConfig<any>>
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.translate(scrollX, scrollY);

  drawElements.forEach((drawElement) => {
    drawElementConfigRegistry[drawElement.type].draw(drawElement.props, ctx);
  });
  if (draftElement) {
    drawElementConfigRegistry[draftElement.type].draw(draftElement.props, ctx);
  }
  const selectedElementsSet = new Set(selectedElements);
  drawElements.forEach((drawElement) => {
    if (selectedElementsSet.has(drawElement.id)) {
      drawBoundingBox(drawElement, ctx, drawElementConfigRegistry);
    }
  });

  ctx.translate(-scrollX, -scrollY);
}

const BOUNDING_BOX_DELTA = 6;
const BOUNDING_BOX_LINE_DASH = [5, 5];

function drawBoundingBox(
  drawElement: DrawElement<keyof DrawElements>,
  ctx: CanvasRenderingContext2D,
  drawElementConfigRegistry: Record<keyof DrawElements, DrawElementConfig<any>>
) {
  ctx.save();
  const boundingBox = drawElementConfigRegistry[
    drawElement.type
  ].getBoundingBox(drawElement.props);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "blue";
  ctx.setLineDash(BOUNDING_BOX_LINE_DASH);
  ctx.strokeRect(
    boundingBox.x - BOUNDING_BOX_DELTA,
    boundingBox.y - BOUNDING_BOX_DELTA,
    boundingBox.width + BOUNDING_BOX_DELTA * 2,
    boundingBox.height + BOUNDING_BOX_DELTA * 2
  );
  ctx.restore();
}
