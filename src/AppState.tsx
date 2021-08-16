import {
  DrawElementByType,
  DrawElementType,
} from "./draw-elements/DrawElements";
import { GlobalId } from "./global-id";
import { Point2D } from "./point-2d";
import { DrawElement } from "./draw-element";
import { DrawElementConfig } from "./draw-elements-drawer/draw-element-config";

export interface AppState {
  drawElementConfigRegistry: Record<DrawElementType, DrawElementConfig<any>>;
  drawElements: DrawElement[];
  draftElement: DrawElement | null;
  selectedElements: GlobalId[];
  activeTool: DrawElementType;
  scrollPoint: Point2D;
}

export const getInitialState = (
  drawElementConfigRegistry: Record<DrawElementType, DrawElementConfig<any>>,
  activeTool: DrawElementType
): AppState => ({
  drawElementConfigRegistry,
  drawElements: [],
  draftElement: null,
  selectedElements: [],
  activeTool,
  scrollPoint: [0, 0],
});

export function createDraftElement(drawElement: DrawElement) {
  return { type: "createDraftElement", element: drawElement } as const;
}
export function updateDraftElement<Type extends DrawElementType>(
  props: Partial<DrawElementByType<Type>>
) {
  return { type: "updateDraftElement", props } as const;
}
export function saveDraftElement() {
  return { type: "saveDraftElement" } as const;
}
export function updateScrollPoint(scrollPointShift: Point2D) {
  return { type: "updateScrollPoint", scrollPointShift } as const;
}
export function setActiveTool(tool: DrawElementType) {
  return { type: "setActiveTool", tool } as const;
}
export function setDrawElements(drawElements: DrawElement[]) {
  return { type: "setDrawElements", drawElements } as const;
}
export function dragSelectedDrawElements(shift: Point2D) {
  return { type: "dragSelectedDrawElements", shift } as const;
}
export function selectElement(drawElementId: GlobalId | null) {
  return { type: "selectElement", drawElementId } as const;
}

type Action =
  | ReturnType<typeof createDraftElement>
  | ReturnType<typeof saveDraftElement>
  | ReturnType<typeof setActiveTool>
  | ReturnType<typeof setDrawElements>
  | ReturnType<typeof updateScrollPoint>
  | ReturnType<typeof dragSelectedDrawElements>
  | ReturnType<typeof selectElement>
  | ReturnType<typeof updateDraftElement>;

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "createDraftElement":
      return {
        ...state,
        draftElement: action.element,
        selectedElements: [],
      };

    case "selectElement":
      return {
        ...state,
        selectedElements: action.drawElementId ? [action.drawElementId] : [],
      };

    case "updateDraftElement":
      if (!state.draftElement) {
        return state;
      }
      return {
        ...state,
        draftElement: {
          ...state.draftElement,
          props: {
            ...state.draftElement.props,
            ...action.props,
          },
        },
      };

    case "saveDraftElement":
      if (!state.draftElement) {
        return state;
      }
      return {
        ...state,
        drawElements: state.drawElements.concat(state.draftElement),
        selectedElements: [state.draftElement.id],
        draftElement: null,
      };

    case "setActiveTool":
      return {
        ...state,
        activeTool: action.tool,
      };

    case "setDrawElements":
      return {
        ...state,
        drawElements: action.drawElements,
      };

    case "updateScrollPoint":
      return {
        ...state,
        scrollPoint: [
          state.scrollPoint[0] + action.scrollPointShift[0],
          state.scrollPoint[1] + action.scrollPointShift[1],
        ],
      };

    case "dragSelectedDrawElements": {
      const selectedElementsSet = new Set(state.selectedElements);
      return {
        ...state,
        drawElements: state.drawElements.map((drawElement) => {
          if (selectedElementsSet.has(drawElement.id)) {
            const config = state.drawElementConfigRegistry[drawElement.type];
            return {
              ...drawElement,
              props: config.shift(drawElement.props, action.shift),
            };
          }
          return drawElement;
        }),
      };
    }
  }
}
