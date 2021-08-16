import { RefObject, useEffect, useRef } from "react";

export function useCanvasAutoResize(
  canvasRef: RefObject<HTMLCanvasElement>,
  onResize: () => void
) {
  const lastOnResize = useRef(onResize);
  lastOnResize.current = onResize;

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
      lastOnResize.current();
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvasRef]);
}
