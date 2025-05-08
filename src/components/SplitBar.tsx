import React from "react"

interface SplitBarProps {
  title: string
  leftValue: string
  rightValue: string
  leftPercentage: number
  rightPercentage: number
  leftColor: string
  rightColor: string
  leftLabel: string
  rightLabel: string
}

export const SplitBar: React.FC<SplitBarProps> = ({
  title,
  leftValue,
  rightValue,
  leftPercentage,
  rightPercentage,
  leftColor,
  rightColor,
  leftLabel,
  rightLabel,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium">{title}</div>
      <div className="flex flex-row rounded-full items-center w-full h-3 overflow-hidden bg-background">
        <div
          style={{ width: `${leftPercentage}%` }}
          className={`h-3 flex ${leftColor}`}
        />
        <div
          style={{ width: `${rightPercentage}%` }}
          className={`h-3 flex ${rightColor}`}
        />
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{leftValue}</span>
          <span className="text-xs text-muted-foreground">{leftLabel}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{rightValue}</span>
          <span className="text-xs text-muted-foreground">{rightLabel}</span>
        </div>
      </div>
    </div>
  )
} 