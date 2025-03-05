"use client";

import { CostBreakdown as CostBreakdownType } from "@/lib/types";
import { models } from "@/lib/models";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  historySize: number;
}

export function CostBreakdown({ modelId, breakdown, historySize }: CostBreakdownProps) {
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
    <div className="space-y-6">
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

      {historySize > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Conversation History Explained</CardTitle>
            <CardDescription>
              How history size of {historySize} affects token usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">1st Interaction</h3>
                <div className="space-y-2">
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-2 rounded">
                    System Prompt
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-2 rounded">
                    User Input
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-2 rounded">
                    Model Output
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">2nd Interaction</h3>
                <div className="space-y-2">
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-2 rounded">
                    System Prompt
                  </div>
                  {historySize >= 1 && (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-2 rounded opacity-70">
                        Previous User Input (1)
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-2 rounded opacity-70">
                        Previous Model Output (1)
                      </div>
                    </>
                  )}
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-2 rounded">
                    Current User Input
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-2 rounded">
                    Model Output
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-medium mb-2">3rd Interaction</h3>
                <div className="space-y-2">
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-2 rounded">
                    System Prompt
                  </div>
                  {historySize >= 2 && (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-2 rounded opacity-50">
                        Previous User Input (1)
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-2 rounded opacity-50">
                        Previous Model Output (1)
                      </div>
                    </>
                  )}
                  {historySize >= 1 && (
                    <>
                      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-2 rounded opacity-70">
                        Previous User Input (2)
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-2 rounded opacity-70">
                        Previous Model Output (2)
                      </div>
                    </>
                  )}
                  <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-2 rounded">
                    Current User Input
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-2 rounded">
                    Model Output
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mt-2">
                <p>
                  With a history size of {historySize}, each request includes the system prompt, 
                  up to {historySize} previous conversation turns, and the current user input. 
                  This increases token usage but improves the model&apos;s context awareness.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 