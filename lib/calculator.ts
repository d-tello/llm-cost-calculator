import { CalculatorParams, CostBreakdown } from "./types";
import { models } from "./models";

export function calculateCost(params: CalculatorParams): CostBreakdown {
  const model = models.find(m => m.id === params.modelId);
  
  if (!model) {
    throw new Error(`Model with ID ${params.modelId} not found`);
  }
  
  // Calculate total input tokens
  const systemPromptTokens = params.systemPromptTokenCount;
  const historyTokensPerInteraction = params.historySize;
  const userInputTokensPerInteraction = params.inputTokensPerInteraction;
  
  // For each interaction, we need:
  // - System prompt (once per session)
  // - History (grows with each interaction)
  // - User input for that interaction
  
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  
  // For each user
  for (let user = 0; user < params.totalUsers; user++) {
    // For each session this user has per month
    for (let session = 0; session < params.sessionsPerMonth; session++) {
      // System prompt is sent once per session
      totalInputTokens += systemPromptTokens;
      
      // For each interaction in this session
      for (let interaction = 0; interaction < params.interactionsPerSession; interaction++) {
        // History grows with each interaction (simplified model)
        // In a real app, we might cap this or have a more complex model
        const currentHistoryTokens = interaction > 0 ? historyTokensPerInteraction * interaction : 0;
        
        // Input tokens for this interaction
        totalInputTokens += currentHistoryTokens + userInputTokensPerInteraction;
        
        // Output tokens for this interaction
        totalOutputTokens += params.outputTokensPerInteraction;
      }
    }
  }
  
  // Calculate costs (convert from per 1000 tokens to per token)
  const inputTokensCost = (totalInputTokens / 1000) * model.inputCost;
  const outputTokensCost = (totalOutputTokens / 1000) * model.outputCost;
  const totalCost = inputTokensCost + outputTokensCost;
  
  return {
    inputTokensCost,
    outputTokensCost,
    totalCost,
    totalTokens: {
      input: totalInputTokens,
      output: totalOutputTokens
    }
  };
} 