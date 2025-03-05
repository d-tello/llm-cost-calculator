"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelSelector } from "@/components/model-selector";
import { ParameterInput } from "@/components/parameter-input";
import { CostBreakdown } from "@/components/cost-breakdown";
import { ModelComparison } from "./model-comparison";
import { calculateCost } from "@/lib/calculator";
import { CalculatorParams, CostBreakdown as CostBreakdownType } from "@/lib/types";

const defaultParams: CalculatorParams = {
  modelId: "claude-3-5-sonnet",
  systemPromptWordCount: 200,
  systemPromptTokenCount: 300,
  historySize: 3,
  inputTokensPerInteraction: 500,
  outputTokensPerInteraction: 1000,
  interactionsPerSession: 5,
  sessionsPerMonth: 10,
  totalUsers: 100,
};

export function Calculator() {
  const [params, setParams] = useState<CalculatorParams>(defaultParams);
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdownType | null>(null);
  const [activeTab, setActiveTab] = useState("monthly");

  // Calculate cost whenever params change
  useEffect(() => {
    try {
      const breakdown = calculateCost(params);
      setCostBreakdown(breakdown);
    } catch (error) {
      console.error("Error calculating cost:", error);
      setCostBreakdown(null);
    }
  }, [params]);

  const handleParamChange = (key: keyof CalculatorParams, value: number | string) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update system prompt token count based on word count (rough estimate)
  useEffect(() => {
    // Rough estimate: 1 word ≈ 1.5 tokens
    const estimatedTokens = Math.round(params.systemPromptWordCount * 1.5);
    handleParamChange("systemPromptTokenCount", estimatedTokens);
  }, [params.systemPromptWordCount]);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
  
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monthly" className="cursor-pointer">Monthly</TabsTrigger>
          <TabsTrigger value="models" className="cursor-pointer">Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly" className="mt-6">
          <div className="grid gap-6 md:grid-cols-5">
            <div className="space-y-6 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Model Selection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ModelSelector
                    value={params.modelId}
                    onChange={(value) => handleParamChange("modelId", value)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ParameterInput
                    label="System Prompt Word Count"
                    value={params.systemPromptWordCount}
                    onChange={(value) => handleParamChange("systemPromptWordCount", value)}
                    min={0}
                    max={2000}
                    step={10}
                    tooltip="Approximate number of words in your system prompt"
                  />
                  <ParameterInput
                    label="History Size"
                    value={params.historySize}
                    onChange={(value) => handleParamChange("historySize", value)}
                    min={0}
                    max={10}
                    step={1}
                    tooltip="Number of previous conversation turns to include in each request (0 means no history)"
                  />
                  <ParameterInput
                    label="Input Tokens Per Interaction"
                    value={params.inputTokensPerInteraction}
                    onChange={(value) => handleParamChange("inputTokensPerInteraction", value)}
                    min={0}
                    max={5000}
                    step={50}
                    tooltip="Average number of tokens in user input per interaction"
                  />
                  <ParameterInput
                    label="Output Tokens Per Interaction"
                    value={params.outputTokensPerInteraction}
                    onChange={(value) => handleParamChange("outputTokensPerInteraction", value)}
                    min={0}
                    max={10000}
                    step={100}
                    tooltip="Average number of tokens in model response per interaction"
                  />
                  <ParameterInput
                    label="Interactions Per Session"
                    value={params.interactionsPerSession}
                    onChange={(value) => handleParamChange("interactionsPerSession", value)}
                    min={1}
                    max={50}
                    tooltip="Number of back-and-forth exchanges in a typical session"
                  />
                  <ParameterInput
                    label="Sessions Per Month"
                    value={params.sessionsPerMonth}
                    onChange={(value) => handleParamChange("sessionsPerMonth", value)}
                    min={1}
                    max={100000}
                    step={100}
                    tooltip="Average number of sessions per user per month"
                  />
                  <ParameterInput
                    label="Total Users"
                    value={params.totalUsers}
                    onChange={(value) => handleParamChange("totalUsers", value)}
                    min={1}
                    max={10000}
                    step={10}
                    tooltip="Total number of users of your application"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              {costBreakdown && (
                <CostBreakdown
                  modelId={params.modelId}
                  breakdown={costBreakdown}
                  historySize={params.historySize}
                  totalUsers={params.totalUsers}
                />
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="models" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Pricing Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ModelComparison />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 