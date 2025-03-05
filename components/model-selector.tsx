"use client";

import Image from "next/image";
import { models } from "@/lib/models";
import { LlmModel } from "@/lib/types";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem
            key={model.id}
            value={model.id}
            className="flex items-center gap-2"
          >
            <ModelOption model={model} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface ModelOptionProps {
  model: LlmModel;
}

function ModelOption({ model }: ModelOptionProps) {
  return (
    <div className="flex items-center gap-2">
      {model.logo && (
        <div className="relative h-5 w-5 flex items-center justify-center">
          <div className={cn(
            "h-5 w-5",
            model.id.includes("amazon") && "scale-[0.85]",
            model.id.includes("claude") && "scale-[0.85]",
            model.id.includes("mistral") && "scale-[0.7]",
            model.id.includes("llama") && "scale-[0.85]"
          )}>
            <Image
              src={model.logo}
              alt={`${model.name} logo`}
              width={20}
              height={20}
              className="object-contain dark:invert"
            />
          </div>
        </div>
      )}
      <span>{model.name}</span>
    </div>
  );
} 