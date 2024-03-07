import classNames from "classnames";
import React, { FC } from "react";

export const StepIndicator: FC<{
  steps: number;
  currentStep: number;
  classname?: string;
}> = ({ steps, currentStep, classname = "" }) => (
  <div className="flex flex-row gap-2">
    {[...Array(steps)].map((_, i) => (
      <div
        key={`step-${i}`}
        className={classNames(
          "size-2 rounded-full bg-foreground/30",
          classname,
          i + 1 === currentStep && "!bg-foreground"
        )}
      />
    ))}
  </div>
);
