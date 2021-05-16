import { useEffect, useReducer, useRef } from "react";
import {
  DrawElementByType,
  DrawElements,
  DrawElementType,
} from "./draw-elements/DrawElements";
import "./App.css";
import { getDrawElementConfigRegistry } from "./draw-elements-drawer/get-draw-element-config-registry";
import { getId, GlobalId } from "./global-id";

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
}

const initialState: AppState = {
  drawElements: [],
  draftElement: null,
  activeTool: elementTypes[0],
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

function setActiveTool(tool: DrawElementType) {
  return { type: "setActiveTool", tool } as const;
}

type Action =
  | ReturnType<typeof createDraftElement>
  | ReturnType<typeof saveDraftElement>
  | ReturnType<typeof setActiveTool>
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
  }
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, dispatch] = useReducer(appReducer, initialState);

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
      canvas.getContext("2d")?.scale(dpr, dpr);
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const draftElementRef = useRef(state.draftElement);
  draftElementRef.current = state.draftElement;

  useEffect(() => {
    const activeElementConfig = drawElementConfigRegistry[state.activeTool];

    let lastClientX = 0;
    let lastClientY = 0;
    function handleMouseMove(ev: MouseEvent) {
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

    function handlePointerDown(ev: MouseEvent) {
      lastClientX = ev.clientX;
      lastClientY = ev.clientY;
      dispatch(
        createDraftElement({
          id: getId(),
          type: state.activeTool,
          props: activeElementConfig.onCreate(ev.clientX, ev.clientY),
        })
      );
      document.addEventListener("pointermove", handleMouseMove);
    }

    function handlePointerUp() {
      dispatch(saveDraftElement());
      document.removeEventListener("pointermove", handleMouseMove);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [state.activeTool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (ctx == null) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    state.drawElements.forEach((drawElement) => {
      drawElementConfigRegistry[drawElement.type].draw(drawElement.props, ctx);
    });
    if (state.draftElement) {
      drawElementConfigRegistry[state.draftElement.type].draw(
        state.draftElement.props,
        ctx
      );
    }
  }, [state.drawElements, state.draftElement]);

  return (
    <div className="App">
      <div className="App__toolbar">
        {elementTypes.map((elementType) => (
          <button
            key={elementType}
            disabled={state.activeTool === elementType}
            onClick={() => dispatch(setActiveTool(elementType))}
          >
            {elementType}
          </button>
        ))}
      </div>
      <canvas className="App__canvas" ref={canvasRef}></canvas>
    </div>
  );
}

export default App;
