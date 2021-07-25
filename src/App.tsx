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
  activeTool: DrawElementType;
  scrollPoint: Point2D;
}

const initialState: AppState = {
  drawElements: [],
  draftElement: null,
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

type Action =
  | ReturnType<typeof createDraftElement>
  | ReturnType<typeof saveDraftElement>
  | ReturnType<typeof setActiveTool>
  | ReturnType<typeof setDrawElements>
  | ReturnType<typeof updateScrollPoint>
  | ReturnType<typeof updateDraftElement>;

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "createDraftElement":
      return {
        ...state,
        draftElement: action.element,
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

      lastClientX = ev.clientX;
      lastClientY = ev.clientY;

      if (ev.buttons === 1) {
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
      document.removeEventListener(
        "pointermove",
        handlePointerMoveWhileScrolling
      );
      document.removeEventListener("pointerup", handlePointerUpWhileScrolling);
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

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [state.activeTool, state.scrollPoint]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx == null) {
      return;
    }
    drawScene(ctx, state.drawElements, state.draftElement, state.scrollPoint);
  }, [state.drawElements, state.draftElement, state.scrollPoint]);

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
      <canvas className="App__canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default App;

type Point2D = [x: number, y: number];

function drawScene(
  ctx: CanvasRenderingContext2D,
  drawElements: DrawElement[],
  draftElement: DrawElement | null,
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

  ctx.translate(-scrollX, -scrollY);
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
