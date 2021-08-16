import "./App.css";

import { useEffect, useReducer, useRef } from "react";

import { DrawElementType } from "./draw-elements/DrawElements";
import { getDrawElementConfigRegistry } from "./draw-elements-drawer/get-draw-element-config-registry";
import { getId } from "./global-id";
import { Island } from "./Island";
import {
  appReducer,
  getInitialState,
  setDrawElements,
  selectElement,
  createDraftElement,
  updateScrollPoint,
  dragSelectedDrawElements,
  updateDraftElement,
  saveDraftElement,
  setActiveTool,
} from "./AppState";
import { useStateHistory } from "./use-state-history";
import { useCanvasAutoResize } from "./use-canvas-auto-resize";
import { drawScene } from "./draw-scene";
import { getDrawElementAtPoint } from "./get-draw-element-at-point";

const ORIGINAL_CURSOR_STYLE = "crosshair";

const drawElementConfigRegistry = getDrawElementConfigRegistry();

const initialState = getInitialState(
  drawElementConfigRegistry,
  drawElementConfigRegistry.Draw.name
);

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [state, dispatch] = useReducer(appReducer, initialState);

  const history = useStateHistory(state.drawElements);

  const elementTypes = Object.keys(
    state.drawElementConfigRegistry
  ) as DrawElementType[];

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

  useCanvasAutoResize(canvasRef, () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx == null) {
      return;
    }
    drawScene(
      ctx,
      state.drawElements,
      state.draftElement,
      state.selectedElements,
      state.scrollPoint,
      state.drawElementConfigRegistry
    );
  });

  const draftElementRef = useRef(state.draftElement);
  draftElementRef.current = state.draftElement;

  const drawElementsRef = useRef(state.drawElements);
  drawElementsRef.current = state.drawElements;

  useEffect(() => {
    const activeElementConfig =
      state.drawElementConfigRegistry[state.activeTool];

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
        const elementUnderPointer = getDrawElementAtPoint(
          drawElementsRef.current,
          [
            ev.clientX - state.scrollPoint[0],
            ev.clientY - state.scrollPoint[1],
          ],
          state.drawElementConfigRegistry
        );
        if (elementUnderPointer) {
          dispatch(selectElement(elementUnderPointer.id));
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
      dispatch(dragSelectedDrawElements([dx, dy]));
      lastClientX = ev.clientX;
      lastClientY = ev.clientY;
    }

    function handlePointerUpWhileDragging() {
      if (canvasRef.current)
        canvasRef.current.style.cursor = ORIGINAL_CURSOR_STYLE;
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
  }, [state.activeTool, state.drawElementConfigRegistry, state.scrollPoint]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx == null) {
      return;
    }
    drawScene(
      ctx,
      state.drawElements,
      state.draftElement,
      state.selectedElements,
      state.scrollPoint,
      state.drawElementConfigRegistry
    );
  }, [
    state.drawElements,
    state.draftElement,
    state.scrollPoint,
    state.selectedElements,
    state.drawElementConfigRegistry,
  ]);

  function handleMouseMove(ev: React.MouseEvent) {
    if (ev.target !== canvasRef.current) {
      return;
    }
    const hoveredElement = getDrawElementAtPoint(
      state.drawElements,
      [ev.clientX - state.scrollPoint[0], ev.clientY - state.scrollPoint[1]],
      state.drawElementConfigRegistry
    );
    if (hoveredElement) canvasRef.current.style.cursor = "move";
    else canvasRef.current.style.cursor = ORIGINAL_CURSOR_STYLE;
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

export { App };
