import {
  DrawElementByType,
  DrawElementType,
} from "../draw-elements/DrawElements";
import { DrawElementsDrawer } from "./DrawElementsDrawer";

function importAll(r: any) {
  return r.keys().map(r);
}

function getAllDrawers(): DrawElementConfig<DrawElementType>[] {
  return importAll(
    // @ts-ignore
    require.context("../draw-elements/", true, /\.element\.ts$/)
  ).map((x: { config: DrawElementConfig<any> }) => x.config);
}

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

let drawElementConfigRegistry: Record<DrawElementType, DrawElementConfig<any>>;

export function getDrawElementConfigRegistry() {
  if (drawElementConfigRegistry != null) {
    return drawElementConfigRegistry;
  }

  drawElementConfigRegistry = getAllDrawers().reduce(
    (acc, drawElementConfig) => {
      acc[drawElementConfig.name] = drawElementConfig;
      return acc;
    },
    {} as Record<DrawElementType, DrawElementConfig<any>>
  );

  return drawElementConfigRegistry;
}
