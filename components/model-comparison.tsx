"use client";

import Image from "next/image";
import { models } from "@/lib/models";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ModelComparison() {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px]">Model</TableHead>
            <TableHead className="text-right">Input Cost (per 1K tokens)</TableHead>
            <TableHead className="text-right">Output Cost (per 1K tokens)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model) => (
            <TableRow key={model.id}>
              <TableCell className="font-medium">
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
              </TableCell>
              <TableCell className="text-right">${model.inputCost.toFixed(6)}</TableCell>
              <TableCell className="text-right">${model.outputCost.toFixed(6)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 