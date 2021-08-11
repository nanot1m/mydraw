import {
  DrawElementByType,
  DrawElementType,
} from "../draw-elements/DrawElements";
import { Point2D } from "../Point2D";
import { DrawElementsDrawer } from "./DrawElementsDrawer";

type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export interface DrawElementConfig<Type extends DrawElementType> {
  name: Type;
  draw: DrawElementsDrawer<Type>;
  onCreate(x: number, y: number): DrawElementByType<Type>;
  onDrawing(
    dx: number,
    dy: number,
    element: DrawElementByType<Type>
  ): Partial<DrawElementByType<Type>>;
  getBoundingBox(element: DrawElementByType<Type>): BoundingBox;
  containsPoint(element: DrawElementByType<Type>, point: Point2D): boolean;
  shift(
    element: DrawElementByType<Type>,
    point: Point2D
  ): DrawElementByType<Type>;
}

const BoundingBoxTable = new WeakMap<
  DrawElementByType<DrawElementType>,
  BoundingBox
>();

const CONTAINS_THRESHOLD = 10;

export function createDrawElementConfig<Type extends DrawElementType>(
  config: DrawElementConfig<Type>
): DrawElementConfig<Type> & { __TYPE__: "DrawElementConfig" } {
  const resultConfig: DrawElementConfig<Type> & {
    __TYPE__: "DrawElementConfig";
  } = {
    ...config,
    __TYPE__: "DrawElementConfig",
    getBoundingBox(element: DrawElementByType<Type>): BoundingBox {
      if (!BoundingBoxTable.has(element)) {
        BoundingBoxTable.set(element, config.getBoundingBox(element));
      }
      return BoundingBoxTable.get(element)!;
    },
    containsPoint(element: DrawElementByType<Type>, point: Point2D): boolean {
      const rect = resultConfig.getBoundingBox(element);
      const [x, y] = point;
      const isInsideRect =
        rect.x - CONTAINS_THRESHOLD <= x &&
        rect.x + rect.width + CONTAINS_THRESHOLD >= x &&
        rect.y - CONTAINS_THRESHOLD <= y &&
        rect.y + rect.height + CONTAINS_THRESHOLD >= y;
      if (isInsideRect) {
        return config.containsPoint(element, point);
      }
      return false;
    },
  };
  return resultConfig;
}

export function isDrawElementConfig(
  obj: unknown
): obj is DrawElementConfig<DrawElementType> {
  return (
    typeof obj === "object" &&
    obj != null &&
    Reflect.get(obj, "__TYPE__") === "DrawElementConfig"
  );
}
