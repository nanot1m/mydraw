import { DrawElementType } from "../draw-elements/DrawElements";
import { DrawElementConfig } from "./DrawElementConfig";

function importAll(r: __WebpackModuleApi.RequireContext) {
  return r.keys().map(r);
}

function assertDrawElementConfigModule(
  module: unknown
): asserts module is { config: DrawElementConfig<any> } {
  if (typeof module !== "object" || module == null || !("config" in module)) {
    throw new TypeError(
      "*.element.ts files must be a module exporting `config` object"
    );
  }
}

function getAllDrawers(): DrawElementConfig<DrawElementType>[] {
  return importAll(
    require.context("../draw-elements/", true, /\.element\.ts$/)
  ).map((module) => {
    assertDrawElementConfigModule(module);
    return module.config;
  });
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
