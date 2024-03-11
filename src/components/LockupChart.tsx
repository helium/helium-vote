"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "./Canvas";

type LockupChartProps = {
  type: "cliff" | "constant";
  lockupPeriodInDays: number;
};

export const LockupChart: React.FC<LockupChartProps> = ({
  type,
  lockupPeriodInDays,
}) => {
  const [width, setWidth] = useState<number | null>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const lightGrey = "#AAB6C5";
  const blue = "#3B82F6";
  const canvasHeight = 140;

  useEffect(() => {
    if (divRef.current) {
      setWidth(divRef.current.offsetWidth);
    }
  }, [divRef.current]);

  const draw = useMemo(() => {
    return (
      context: CanvasRenderingContext2D,
      width: number,
      height: number
    ) => {
      // Set basic styles for the canvas
      context.fillStyle = "white";
      context.strokeStyle = lightGrey;
      context.lineWidth = 2;
      context.font = "10px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";

      // Draw the X and Y axis lines
      context.beginPath();
      context.moveTo(40, 0);
      context.lineTo(40, height - 20);
      context.lineTo(width, height - 20);
      context.stroke();

      // Draw the Y-axis
      context.save();
      context.translate(10, height / 2);
      context.rotate(-Math.PI / 2);
      context.fillText("Voting Power", 0, 10);
      context.restore();

      // Draw 100% on the Y-axis
      context.fillStyle = lightGrey;
      context.fillText("100%", 20, 10);

      // Draw the X-axis
      for (let i = 0; i <= 6; i++) {
        context.fillStyle = lightGrey;
        context.textAlign = i === 0 ? "left" : i === 6 ? "right" : "center";
        context.fillText(
          i === 0 ? "" : `${i}y`,
          40 + ((width - 40) / 6) * i,
          height - 10
        );
      }

      const scalePerYear = (width - 40) / 6; // Assuming the chart spans 6 years
      const rectangleWidth = scalePerYear * 2; // Rectangle spans 2 years
      let triangleStartX = 40;

      if (type === "constant") {
        triangleStartX += scalePerYear * 2; // Move start to the right by 2 years

        // Additional logic for drawing a rectangle if type is 'constant'
        context.fillStyle = "white";
        context.fillRect(40, 10, rectangleWidth, height - 30); // Fill rectangle starting from the Y axis

        // Draw top stroke of rectangle
        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(40, 10);
        context.lineTo(40 + rectangleWidth, 10);
        context.strokeStyle = blue;
        context.stroke();
      }

      // calculate the lockup period and draw the triangle...
      const lockupPeriodInYears = lockupPeriodInDays / 365;
      const lockupEndPointX =
        triangleStartX + (width - 40) * (lockupPeriodInYears / 6);

      context.beginPath();
      context.moveTo(triangleStartX, 10); // Adjusted start point
      context.lineTo(lockupEndPointX, height - 20);
      context.lineTo(triangleStartX, height - 20);
      context.closePath();
      context.fillStyle = "white";
      context.fill();

      // Draw slope stroke of triangle
      context.beginPath();
      context.moveTo(triangleStartX, 10);
      context.lineTo(lockupEndPointX, height - 20);
      context.strokeStyle = blue;
      context.stroke();

      if (type === "constant") {
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(40 + rectangleWidth, 0);
        context.lineTo(40 + rectangleWidth, height - 20);
        context.strokeStyle = blue;
        context.stroke();

        // Draw a dot where the rectangle and triangle meet
        context.beginPath();
        context.arc(40 + rectangleWidth, 10, 6, 0, 2 * Math.PI); // Draw a circle with radius 3
        context.fillStyle = blue;
        context.fill();

        // "Cooldown Initiated" label setup
        const text = "Cooldown Initiated";
        context.font = "10px Arial"; // Ensure font is set before measuring text
        const textMetrics = context.measureText(text);
        const textWidth = textMetrics.width;
        const labelPadding = 10;
        const labelWidth = textWidth + labelPadding * 2;
        const labelHeight = 20;
        const labelX = triangleStartX - labelWidth / 2;
        const labelY = height / 2 - labelHeight / 2;

        const borderRadius = 5; // Set the desired border radius

        // Function to draw rounded rectangle
        const drawRoundedRect = (
          x: any,
          y: any,
          w: any,
          h: any,
          radius: any
        ) => {
          context.beginPath();
          context.moveTo(x + radius, y);
          context.lineTo(x + w - radius, y);
          context.quadraticCurveTo(x + w, y, x + w, y + radius);
          context.lineTo(x + w, y + h - radius);
          context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
          context.lineTo(x + radius, y + h);
          context.quadraticCurveTo(x, y + h, x, y + h - radius);
          context.lineTo(x, y + radius);
          context.quadraticCurveTo(x, y, x + radius, y);
          context.closePath();
        };

        // Additional logic for drawing a rectangle if type is 'constant'...
        // Separation line and label setup...

        // Draw label background with border radius
        context.fillStyle = "white";
        drawRoundedRect(labelX, labelY, labelWidth, labelHeight, borderRadius);
        context.fill();

        // Draw border with border radius
        context.strokeStyle = blue;
        context.lineWidth = 2;
        drawRoundedRect(labelX, labelY, labelWidth, labelHeight, borderRadius);
        context.stroke();

        // Draw the text centered within the label
        context.textAlign = "center"; // Center text alignment
        context.textBaseline = "middle"; // Middle text baseline for vertical centering
        context.fillStyle = blue; // Set text color
        context.fillText(text, triangleStartX, labelY + labelHeight / 2);

        // Reset styles
        context.fillStyle = "white";
        context.strokeStyle = "white";
        context.lineWidth = 2;
      }
    };
  }, [type, lockupPeriodInDays]);

  return (
    <div className="w-full bg-background pt-4 pr-4 rounded-[4px]">
      <div ref={divRef} className="w-full overflow-none">
        {width && <Canvas width={width} height={canvasHeight} draw={draw} />}
      </div>
    </div>
  );
};
