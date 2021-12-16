import { useEffect, useRef } from "react";

export const Canvas = () => {

  const canvasRef = useRef(null);
  const canvas = canvasRef.current as unknown as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;

  useEffect(() => {

    window.addEventListener('resize', function () {

      const w = canvas.width = window.innerWidth;
      const h = canvas.height = window.innerHeight;

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, w, h);
    });

  }, [canvas]);


  return (
    <canvas ref={canvasRef} />
  )
}
