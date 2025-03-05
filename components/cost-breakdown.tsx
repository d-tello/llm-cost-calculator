"use client";

import { CostBreakdown as CostBreakdownType } from "@/lib/types";
import { models } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CostBreakdownProps {
  modelId: string;
  breakdown: CostBreakdownType;
}

export function CostBreakdown({ modelId, breakdown }: CostBreakdownProps) {
  const model = models.find((m) => m.id === modelId);

  if (!model) {
    return <div>Model not found</div>;
  }

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(2)}M`;
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(2)}K`;
    } else {
      return num.toFixed(2);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${amount.toFixed(2)}`;
    } else if (amount >= 1) {
      return `$${amount.toFixed(2)}`;
    } else if (amount >= 0.01) {
      return `$${amount.toFixed(2)}`;
    } else {
      return `$${amount.toFixed(5)}`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Monthly Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm text-muted-foreground">Total Cost</div>
            <div className="text-2xl font-bold">
              {formatCurrency(breakdown.totalCost)}
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm text-muted-foreground">Input Tokens</div>
            <div className="text-2xl font-bold">
              {formatNumber(breakdown.totalTokens.input)}
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm text-muted-foreground">Output Tokens</div>
            <div className="text-2xl font-bold">
              {formatNumber(breakdown.totalTokens.output)}
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Input Tokens</TableCell>
              <TableCell>{formatNumber(breakdown.totalTokens.input)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(breakdown.inputTokensCost)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Output Tokens</TableCell>
              <TableCell>{formatNumber(breakdown.totalTokens.output)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(breakdown.outputTokensCost)}
              </TableCell>
            </TableRow>
            <TableRow className="font-medium">
              <TableCell>Total</TableCell>
              <TableCell>
                {formatNumber(
                  breakdown.totalTokens.input + breakdown.totalTokens.output
                )}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(breakdown.totalCost)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="mt-4 text-xs text-muted-foreground">
          <p>
            Based on {model.name} pricing: ${model.inputCost.toFixed(6)} per 1K
            input tokens, ${model.outputCost.toFixed(6)} per 1K output tokens
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 