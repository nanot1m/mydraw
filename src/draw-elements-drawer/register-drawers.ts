import { DrawElementType } from "../draw-elements/DrawElements";
import { DrawElementConfig } from "./DrawElementConfig";

function importAll(r: any) {
  return r.keys().map(r);
}

function getAllDrawers(): DrawElementConfig<DrawElementType>[] {
  return importAll(
    // @ts-ignore
    require.context("../draw-elements/", true, /\.element\.ts$/)
  ).map((x: { config: DrawElementConfig<any> }) => x.config);
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
