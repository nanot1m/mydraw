import { RefObject, useEffect, useReducer, useRef, useState } from "react";
import {
  DrawElementByType,
  DrawElements,
  DrawElementType,
} from "./draw-elements/DrawElements";
import "./App.css";
import { getDrawElementConfigRegistry } from "./draw-elements-drawer/get-draw-element-config-registry";
import { getId, GlobalId } from "./global-id";
import { Island } from "./Island";
import { StateHistory } from "./state-history";
import { Point2D } from "./Point2D";

interface DrawElement<Type extends keyof DrawElements = DrawElementType> {
  type: Type;
  id: GlobalId;
  props: DrawElements[Type];
}

const drawElementConfigRegistry = getDrawElementConfigRegistry();

const elementTypes = Object.keys(
  drawElementConfigRegistry
) as DrawElementType[];

interface AppState {
  drawElements: DrawElement[];
  draftElement: DrawElement | null;
  selectedElement: DrawElement | null;
  hoveredElement: DrawElement | null;
  activeTool: DrawElementType;
  scrollPoint: Point2D;
}

const initialState: AppState = {
  drawElements: [],
  draftElement: null,
  selectedElement: null,
  hoveredElement: null,
  activeTool: elementTypes[0],
  scrollPoint: [0, 0],
};

function createDraftElement(drawElement: DrawElement) {
  return { type: "createDraftElement", element: drawElement } as const;
}

function updateDraftElement<Type extends DrawElementType>(
  props: Partial<DrawElementByType<Type>>
) {
  return { type: "updateDraftElement", props } as const;
}

function saveDraftElement() {
  return { type: "saveDraftElement" } as const;
}

function updateScrollPoint(scrollPointShift: Point2D) {
  return { type: "updateScrollPoint", scrollPointShift } as const;
}

function setActiveTool(tool: DrawElementType) {
  return { type: "setActiveTool", tool } as const;
}

function setDrawElements(drawElements: DrawElement[]) {
  return { type: "setDrawElements", drawElements } as const;
}

function setHoveredElement(drawElement: DrawElement | null) {
  return { type: "setHoveredElement", drawElement } as const;
}

function dragHoveredDrawElement(shift: Point2D) {
  return { type: "dragHoveredDrawElement", shift } as const;
}

function selectElement(drawElement: DrawElement | null) {
  return { type: "selectElement", drawElement } as const;
}

type Action =
  | ReturnType<typeof createDraftElement>
  | ReturnType<typeof saveDraftElement>
  | ReturnType<typeof setActiveTool>
  | ReturnType<typeof setDrawElements>
  | ReturnType<typeof updateScrollPoint>
  | ReturnType<typeof setHoveredElement>
  | ReturnType<typeof dragHoveredDrawElement>
  | ReturnType<typeof selectElement>
  | ReturnType<typeof updateDraftElement>;

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "createDraftElement":
      return {
        ...state,
        draftElement: action.element,
        selectedElement: null,
      };

    case "selectElement":
      return {
        ...state,
        selectedElement: action.drawElement,
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
        selectedElement: state.draftElement,
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

    case "setHoveredElement":
      return {
        ...state,
        hoveredElement: action.drawElement,
      };

    case "dragHoveredDrawElement": {
      return {
        ...state,
        drawElements: state.drawElements.map((drawElement) => {
          return drawElement;
        }),
      };
    }
  }
}

function useHistory<T>(state: T) {
  const [history] = useState(() => StateHistory.of(state));
  const [hasNext, setHasNext] = useState(history.hasNext());
  const [hasPrev, setHasPrev] = useState(history.hasPrev());

  useEffect(() => {
    if (history.get() !== state) {
      history.push(state);
      setHasPrev(history.hasPrev());
      setHasNext(history.hasNext());
    }
  }, [history, state]);

  return {
    hasPrev,
    hasNext,
    goBack() {
      history.goBack();
      setHasPrev(history.hasPrev());
      setHasNext(history.hasNext());
      return history.get();
    },
    goForward() {
      history.goForward();
      setHasPrev(history.hasPrev());
      setHasNext(history.hasNext());
      return history.get();
    },
  };
}

const ORIGINAL_CURSOR_STYLE = "crosshair";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [state, dispatch] = useReducer(appReducer, initialState);

  const history = useHistory(state.drawElements);

  function goBack() {
    if (history.hasPrev) {
      const drawElements = history.goBack();
      dispatch(setDrawElements(drawElements));
    }
  }

  function goForward() {
    if (history.hasNext) {
      const drawElements = history.goForward();
      dispatch(setDrawElements(drawElements));
    }
  }

  useCanvasAutoResize(state, canvasRef);

  const draftElementRef = useRef(state.draftElement);
  draftElementRef.current = state.draftElement;

  useEffect(() => {
    const activeElementConfig = drawElementConfigRegistry[state.activeTool];

    let lastClientX = 0;
    let lastClientY = 0;

    function handlePointerDown(ev: MouseEvent) {
      if (ev.target !== canvasRef.current) {
        return;
      }

      ev.preventDefault();

      lastClientX = ev.clientX;
      lastClientY = ev.clientY;

      if (ev.buttons === 1) {
        if (state.hoveredElement) {
          document.addEventListener(
            "pointermove",
            handlePointerMoveWhileDragging
          );
          document.addEventListener("pointerup", handlePointerUpWhileDragging);
          return;
        }

        dispatch(
          createDraftElement({
            id: getId(),
            type: state.activeTool,
            props: activeElementConfig.onCreate(
              ev.clientX - state.scrollPoint[0],
              ev.clientY - state.scrollPoint[1]
            ),
          })
        );
        document.addEventListener("pointermove", handlePointerMoveWhileDrawing);
        document.addEventListener("pointerup", handlePointerUpWhileDrawing);
      }

      if (ev.buttons === 4) {
        if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        document.addEventListener(
          "pointermove",
          handlePointerMoveWhileScrolling
        );
        document.addEventListener("pointerup", handlePointerUpWhileScrolling);
      }
    }

    function handlePointerMoveWhileScrolling(ev: MouseEvent) {
      const dx = ev.clientX - lastClientX;
      const dy = ev.clientY - lastClientY;
      dispatch(updateScrollPoint([dx, dy]));
      lastClientX = ev.clientX;
      lastClientY = ev.clientY;
    }

    function handlePointerUpWhileScrolling() {
      if (canvasRef.current)
        canvasRef.current.style.cursor = ORIGINAL_CURSOR_STYLE;
      document.removeEventListener(
        "pointermove",
        handlePointerMoveWhileScrolling
      );
      document.removeEventListener("pointerup", handlePointerUpWhileScrolling);
    }

    function handlePointerMoveWhileDragging(ev: MouseEvent) {
      const dx = ev.clientX - lastClientX;
      const dy = ev.clientY - lastClientY;
      dispatch(dragHoveredDrawElement([dx, dy]));
      lastClientX = ev.clientX;
      lastClientY = ev.clientY;
    }

    function handlePointerUpWhileDragging() {
      if (canvasRef.current)
        canvasRef.current.style.cursor = ORIGINAL_CURSOR_STYLE;
      dispatch(selectElement(state.hoveredElement));
      document.removeEventListener(
        "pointermove",
        handlePointerMoveWhileDragging
      );
      document.removeEventListener("pointerup", handlePointerUpWhileDragging);
    }

    function handlePointerMoveWhileDrawing(ev: MouseEvent) {
      if (draftElementRef.current == null) {
        return;
      }
      dispatch(
        updateDraftElement(
          activeElementConfig.onDrawing(
            ev.clientX - lastClientX,
            ev.clientY - lastClientY,
            draftElementRef.current.props
          )
        )
      );
      lastClientX = ev.clientX;
      lastClientY = ev.clientY;
    }

    function handlePointerUpWhileDrawing() {
      dispatch(saveDraftElement());
      document.removeEventListener(
        "pointermove",
        handlePointerMoveWhileDrawing
      );
      document.removeEventListener("pointerup", handlePointerUpWhileDrawing);
    }

    function handleWheel(ev: WheelEvent) {
      dispatch(updateScrollPoint([-ev.deltaX, -ev.deltaY]));
    }

    document.addEventListener("wheel", handleWheel);

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [state.activeTool, state.hoveredElement, state.scrollPoint]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx == null) {
      return;
    }
    drawScene(
      ctx,
      state.drawElements,
      state.draftElement,
      state.selectedElement,
      state.scrollPoint
    );
  }, [
    state.drawElements,
    state.draftElement,
    state.scrollPoint,
    state.selectedElement,
  ]);

  function handleMouseMove(ev: React.MouseEvent) {
    if (ev.target !== canvasRef.current) {
      return;
    }
    const hoveredElement = getDrawElementAtPoint(state.drawElements, [
      ev.clientX - state.scrollPoint[0],
      ev.clientY - state.scrollPoint[1],
    ]);
    if (hoveredElement) canvasRef.current.style.cursor = "move";
    else canvasRef.current.style.cursor = ORIGINAL_CURSOR_STYLE;
    dispatch(setHoveredElement(hoveredElement));
  }

  return (
    <div className="App">
      <Island className="App__toolbar">
        {elementTypes.map((elementType) => (
          <button
            key={elementType}
            disabled={state.activeTool === elementType}
            onClick={() => dispatch(setActiveTool(elementType))}
          >
            {elementType}
          </button>
        ))}
      </Island>
      <Island className="App__toolbar">
        <button disabled={!history.hasPrev} onClick={goBack}>
          ←
        </button>
        <button disabled={!history.hasNext} onClick={goForward}>
          →
        </button>
      </Island>
      <canvas
        className="App__canvas"
        ref={canvasRef}
        onMouseMove={handleMouseMove}
      ></canvas>
    </div>
  );
}

function getDrawElementAtPoint(
  drawElements: DrawElement[],
  point: Point2D
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

export default App;

function drawScene(
  ctx: CanvasRenderingContext2D,
  drawElements: DrawElement[],
  draftElement: DrawElement | null,
  selectedElement: DrawElement | null,
  [scrollX, scrollY]: Point2D
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.translate(scrollX, scrollY);

  drawElements.forEach((drawElement) => {
    drawElementConfigRegistry[drawElement.type].draw(drawElement.props, ctx);
  });
  if (draftElement) {
    drawElementConfigRegistry[draftElement.type].draw(draftElement.props, ctx);
  }
  if (selectedElement) {
    drawBoundingBox(selectedElement, ctx);
  }

  ctx.translate(-scrollX, -scrollY);
}

const BOUNDING_BOX_DELTA = 6;
const BOUNDING_BOX_LINE_DASH = [5, 5];

function drawBoundingBox(
  drawElement: DrawElement<keyof DrawElements>,
  ctx: CanvasRenderingContext2D
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

function useCanvasAutoResize(
  state: AppState,
  canvasRef: RefObject<HTMLCanvasElement>
) {
  const lastState = useRef(state);
  lastState.current = state;

  useEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      const ctx = canvas.getContext("2d");
      if (ctx == null) {
        return;
      }
      ctx.scale(dpr, dpr);
      drawScene(
        ctx,
        lastState.current.drawElements,
        lastState.current.draftElement,
        lastState.current.selectedElement,
        lastState.current.scrollPoint
      );
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasRef]);
}
