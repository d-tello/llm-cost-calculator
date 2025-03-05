export interface LlmModel {
  id: string;
  name: string;
  inputCost: number; // Cost per 1000 input tokens in USD
  outputCost: number; // Cost per 1000 output tokens in USD
  logo?: string; // Path to the model logo
}

export interface CalculatorParams {
  modelId: string;
  systemPromptWordCount: number;
  systemPromptTokenCount: number;
  historySize: number;
  inputTokensPerInteraction: number;
  outputTokensPerInteraction: number;
  interactionsPerSession: number;
  sessionsPerMonth: number;
  totalUsers: number;
}

export interface CostBreakdown {
  inputTokensCost: number;
  outputTokensCost: number;
  totalCost: number;
  totalTokens: {
    input: number;
    output: number;
  };
} 