import { Point2D } from "./point-2d";
import { DrawElementConfig } from "./draw-elements-drawer/draw-element-config";
import { DrawElementType } from "./draw-elements/DrawElements";
import { DrawElement } from "./draw-element";

export function getDrawElementAtPoint(
  drawElements: DrawElement[],
  point: Point2D,
  drawElementConfigRegistry: Record<DrawElementType, DrawElementConfig<any>>
): DrawElement | null {
  let hoveredElement: DrawElement | null = null;

  for (let i = drawElements.length - 1; i >= 0; i--) {
    const element = drawElements[i];
    const config = drawElementConfigRegistry[element.type];
    if (config.containsPoint(element.props, point)) {
      hoveredElement = element;
      break;
    }
  }

  return hoveredElement;
}
