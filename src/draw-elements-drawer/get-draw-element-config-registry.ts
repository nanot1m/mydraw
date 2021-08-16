import { DrawElementType } from "../draw-elements/DrawElements";
import { DrawElementConfig, isDrawElementConfig } from "./draw-element-config";

function importAll(r: __WebpackModuleApi.RequireContext) {
  return r.keys().map(r);
}

function assertDrawElementConfigModule(
  module: unknown
): asserts module is { config: DrawElementConfig<any> } {
  if (
    typeof module !== "object" ||
    module == null ||
    !isDrawElementConfig(Reflect.get(module, "config"))
  ) {
    throw new TypeError(
      "*.element.ts files must be a module exporting `config` object"
    );
  }
}

function getAllDrawElementConfigs(): DrawElementConfig<DrawElementType>[] {
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

  drawElementConfigRegistry = getAllDrawElementConfigs().reduce(
    (acc, drawElementConfig) => {
      acc[drawElementConfig.name] = drawElementConfig;
      return acc;
    },
    {} as Record<DrawElementType, DrawElementConfig<any>>
  );

  return drawElementConfigRegistry;
}
