import {
  DrawElementByType,
  DrawElementType,
} from "../draw-elements/DrawElements";
import { DrawElementsDrawer } from "./DrawElementsDrawer";

export interface DrawElementConfig<Type extends DrawElementType> {
  name: Type;
  draw: DrawElementsDrawer<Type>;
  onCreate(x: number, y: number): DrawElementByType<Type>;
  onDrawing: (
    dx: number,
    dy: number,
    element: DrawElementByType<Type>
  ) => Partial<DrawElementByType<Type>>;
}

export function createDrawElementConfig<Type extends DrawElementType>(
  config: DrawElementConfig<Type>
): DrawElementConfig<Type> & { __TYPE__: "DrawElementConfig" } {
  return { ...config, __TYPE__: "DrawElementConfig" };
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
