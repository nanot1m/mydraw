import {
  DrawElementByType,
  DrawElementType,
} from "../draw-elements/DrawElements";
import { DrawElementsDrawer } from "./DrawElementsDrawer";

export interface DrawElementConfig<Type extends DrawElementType> {
  name: Type;
  draw: DrawElementsDrawer<Type>;
  onCreate(x: number, y: number): DrawElementByType<Type>;
  onPointerMove: (
    dx: number,
    dy: number,
    element: DrawElementByType<Type>
  ) => Partial<DrawElementByType<Type>>;
}

export function createDrawElementConfig<Type extends DrawElementType>(
  config: DrawElementConfig<Type>
): DrawElementConfig<Type> {
  return config;
}
