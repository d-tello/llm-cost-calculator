import { CalculatorParams, CostBreakdown } from "./types";
import { models } from "./models";

export function calculateCost(params: CalculatorParams): CostBreakdown {
  const model = models.find(m => m.id === params.modelId);
  
  if (!model) {
    throw new Error(`Model with ID ${params.modelId} not found`);
  }
  
  // System prompt tokens (constant for all interactions)
  const systemPromptTokens = params.systemPromptTokenCount;
  
  // User input and output tokens per interaction
  const userInputTokensPerInteraction = params.inputTokensPerInteraction;
  const outputTokensPerInteraction = params.outputTokensPerInteraction;
  
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  
  // For each user
  for (let user = 0; user < params.totalUsers; user++) {
    // For each session this user has per month
    for (let session = 0; session < params.sessionsPerMonth; session++) {
      // For each interaction in this session
      for (let interaction = 0; interaction < params.interactionsPerSession; interaction++) {
        // For the first interaction, we only send the system prompt + user input
        if (interaction === 0) {
          totalInputTokens += systemPromptTokens + userInputTokensPerInteraction;
        } else {
          // For subsequent interactions, we include:
          // 1. System prompt (always included)
          // 2. Previous messages (limited by history size)
          // 3. Current user input
          
          // Calculate how many previous interactions to include based on history size
          const historyToInclude = Math.min(interaction, params.historySize);
          
          // Start with system prompt + current user input
          let inputTokensForThisInteraction = systemPromptTokens + userInputTokensPerInteraction;
          
          // Add tokens for previous messages (both user inputs and model outputs)
          // For each previous interaction in the history window
          for (let historyItem = 0; historyItem < historyToInclude; historyItem++) {
            // Add tokens for a previous user input
            inputTokensForThisInteraction += userInputTokensPerInteraction;
            
            // Add tokens for a previous model output
            inputTokensForThisInteraction += outputTokensPerInteraction;
          }
          
          totalInputTokens += inputTokensForThisInteraction;
        }
        
        // Output tokens for this interaction (same for all interactions)
        totalOutputTokens += outputTokensPerInteraction;
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