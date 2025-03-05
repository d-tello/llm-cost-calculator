"use client";

import { useState } from "react";
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
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CostBreakdownProps {
  modelId: string;
  breakdown: CostBreakdownType;
  historySize: number;
  totalUsers?: number;
}

export function CostBreakdown({ modelId, breakdown, historySize, totalUsers = 1 }: CostBreakdownProps) {
  const [isHistoryExplanationOpen, setIsHistoryExplanationOpen] = useState(false);
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

  const costPerUser = totalUsers > 0 ? breakdown.totalCost / totalUsers : 0;

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Monthly Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm text-muted-foreground">Total Cost</div>
              <div className="text-xl font-bold truncate">
                {formatCurrency(breakdown.totalCost)}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm text-muted-foreground">Cost Per User</div>
              <div className="text-xl font-bold truncate">
                {formatCurrency(costPerUser)}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm text-muted-foreground">Input Tokens</div>
              <div className="text-xl font-bold truncate">
                {formatNumber(breakdown.totalTokens.input)}
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="text-sm text-muted-foreground">Output Tokens</div>
              <div className="text-xl font-bold truncate">
                {formatNumber(breakdown.totalTokens.output)}
              </div>
            </div>
          </div>

          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Category</TableHead>
                <TableHead className="w-[30%]">Tokens</TableHead>
                <TableHead className="w-[30%] text-right">Cost</TableHead>
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
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Conversation History Explained</CardTitle>
                <CardDescription>
                  How history size of {historySize} affects token usage
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 cursor-pointer transition-transform duration-200 hover:bg-muted"
                onClick={() => setIsHistoryExplanationOpen(!isHistoryExplanationOpen)}
                aria-label={isHistoryExplanationOpen ? "Collapse explanation" : "Expand explanation"}
              >
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isHistoryExplanationOpen && "rotate-180"
                  )} 
                />
              </Button>
            </div>
          </CardHeader>
          <div className={cn(
            "grid transition-all duration-300 ease-in-out",
            isHistoryExplanationOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}>
            <div className="overflow-hidden">
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">1st Interaction</h3>
                    <div className="space-y-2">
                      <div className="bg-green-50 dark:bg-slate-800 border border-green-200 dark:border-slate-700 p-2 rounded">
                        System Prompt
                      </div>
                      <div className="bg-blue-50 dark:bg-indigo-950/40 border border-blue-200 dark:border-indigo-900 p-2 rounded">
                        User Input
                      </div>
                      <div className="bg-amber-50 dark:bg-purple-950/40 border border-amber-200 dark:border-purple-900 p-2 rounded">
                        Model Output
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">2nd Interaction</h3>
                    <div className="space-y-2">
                      <div className="bg-green-50 dark:bg-slate-800 border border-green-200 dark:border-slate-700 p-2 rounded">
                        System Prompt
                      </div>
                      {historySize >= 1 && (
                        <>
                          <div className="bg-blue-50 dark:bg-indigo-950/40 border border-blue-200 dark:border-indigo-900 p-2 rounded opacity-70">
                            Previous User Input (1)
                          </div>
                          <div className="bg-amber-50 dark:bg-purple-950/40 border border-amber-200 dark:border-purple-900 p-2 rounded opacity-70">
                            Previous Model Output (1)
                          </div>
                        </>
                      )}
                      <div className="bg-blue-50 dark:bg-indigo-950/40 border border-blue-200 dark:border-indigo-900 p-2 rounded">
                        Current User Input
                      </div>
                      <div className="bg-amber-50 dark:bg-purple-950/40 border border-amber-200 dark:border-purple-900 p-2 rounded">
                        Model Output
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="font-medium mb-2">3rd Interaction</h3>
                    <div className="space-y-2">
                      <div className="bg-green-50 dark:bg-slate-800 border border-green-200 dark:border-slate-700 p-2 rounded">
                        System Prompt
                      </div>
                      {historySize >= 2 && (
                        <>
                          <div className="bg-blue-50 dark:bg-indigo-950/40 border border-blue-200 dark:border-indigo-900 p-2 rounded opacity-50">
                            Previous User Input (1)
                          </div>
                          <div className="bg-amber-50 dark:bg-purple-950/40 border border-amber-200 dark:border-purple-900 p-2 rounded opacity-50">
                            Previous Model Output (1)
                          </div>
                        </>
                      )}
                      {historySize >= 1 && (
                        <>
                          <div className="bg-blue-50 dark:bg-indigo-950/40 border border-blue-200 dark:border-indigo-900 p-2 rounded opacity-70">
                            Previous User Input (2)
                          </div>
                          <div className="bg-amber-50 dark:bg-purple-950/40 border border-amber-200 dark:border-purple-900 p-2 rounded opacity-70">
                            Previous Model Output (2)
                          </div>
                        </>
                      )}
                      <div className="bg-blue-50 dark:bg-indigo-950/40 border border-blue-200 dark:border-indigo-900 p-2 rounded">
                        Current User Input
                      </div>
                      <div className="bg-amber-50 dark:bg-purple-950/40 border border-amber-200 dark:border-purple-900 p-2 rounded">
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
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 