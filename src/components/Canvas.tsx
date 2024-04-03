import React, { useEffect, useRef } from "react";

export type DrawFunction = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number
) => void;

export interface CanvasProps {
  width: number;
  height: number;
  draw: DrawFunction;
}

export const Canvas: React.FC<CanvasProps> = ({ width, height, draw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context) {
      const devicePixelRatio = window.devicePixelRatio || 1;

      // Adjust canvas size based on devicePixelRatio for high DPI displays
      const scaledWidth = width * devicePixelRatio;
      const scaledHeight = height * devicePixelRatio;

      canvas.width = scaledWidth;
      canvas.height = scaledHeight;

      // Adjust canvas style to match original width/height in CSS pixels
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Scale the drawing context to ensure content is not stretched
      context.scale(devicePixelRatio, devicePixelRatio);

      // Clear and redraw the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      draw(context, width, height); // Note: drawing logic needs to account for scaling
    }
  }, [draw, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
