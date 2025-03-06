"use client";

import { useState, useEffect, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ParameterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  tooltip?: string;
}

export function ParameterInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  tooltip,
}: ParameterInputProps) {
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Update the input value when the prop value changes
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleSliderChange = (newValue: number[]) => {
    const value = newValue[0];
    onChange(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Only update the actual value if it's a valid number
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    // Ensure the input value is valid when the user leaves the input
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue < min) {
      setInputValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setInputValue(max.toString());
      onChange(max);
    } else {
      // Round to the nearest step
      const roundedValue = Math.round(numValue / step) * step;
      setInputValue(roundedValue.toString());
      onChange(roundedValue);
    }
  };

  // Improved tooltip toggle handler with explicit prevention of default behavior
  const handleTooltipClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTooltipOpen((prev) => !prev);
  }, []);

  // Separate handler for touch events
  const handleTooltipTouch = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTooltipOpen((prev) => !prev);
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Label
            htmlFor={`param-${label.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-sm font-medium"
          >
            {label}
          </Label>
          {tooltip && (
            <TooltipProvider>
              <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                  <span
                    className="ml-1 cursor-pointer text-muted-foreground hover:text-foreground transition-colors rounded-full w-4 h-4 inline-flex items-center justify-center border border-muted-foreground/30 text-xs"
                    role="button"
                    tabIndex={0}
                    aria-label="Show information"
                    onClick={handleTooltipClick}
                    onTouchEnd={handleTooltipTouch}
                  >
                    ?
                  </span>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Input
          id={`param-${label.toLowerCase().replace(/\s+/g, "-")}`}
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          min={min}
          max={max}
          step={step}
          className="w-20 text-right"
        />
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleSliderChange}
        className="py-2"
      />
    </div>
  );
}
