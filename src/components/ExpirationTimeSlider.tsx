import React from "react";
import { Slider } from "./ui/slider";

export const ExpirationTimeSlider: React.FC<{
  maxDays: number;
  selectedDays: number;
  setSelectedDays: (days: number) => void;
  expirationTime: number;
}> = ({ maxDays, selectedDays, setSelectedDays, expirationTime }) => {
  return (
    <div>
      <h2 className="text-lg mt-4 mb-2">Expiration Time</h2>
      <Slider
        min={1}
        step={1}
        max={maxDays}
        value={[selectedDays]}
        onValueChange={(e) => {
          setSelectedDays(e[0]);
        }}
      />
      <div className="mt-2 text-right text-gray-500 text-xs font-medium leading-none">
        {new Date(expirationTime * 1000).toLocaleString()}
      </div>
    </div>
  );
};
