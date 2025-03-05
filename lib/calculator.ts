import { CalculatorParams, CostBreakdown } from "./types";
import { models } from "./models";

// Token costs for different output formats
const LLM_GENERATED_TOKEN_COST = 500;
const JSON_FORMAT_TOKEN_COST = 100;

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
  
  // Calculate format-specific token costs based on the JSON output percentage
  const jsonPercentage = params.jsonOutputPercentage / 100;
  const llmPercentage = 1 - jsonPercentage;
  
  // Calculate the additional token cost for history based on output format
  const formatTokenCost = (jsonPercentage * JSON_FORMAT_TOKEN_COST) + (llmPercentage * LLM_GENERATED_TOKEN_COST);
  
  let totalInputTokens = 0;
  let totalOutputTokens = 0;
  
  // For each user
  for (let user = 0; user < params.totalUsers; user++) {
    // For each session this user has per month
    for (let session = 0; session < params.sessionsPerMonth; session++) {
      const conversationHistory = []; // Track all interactions in the conversation
      
      // For each interaction in this session
      for (let interaction = 0; interaction < params.interactionsPerSession; interaction++) {
        // For the first interaction, we only send the system prompt + user input
        if (interaction === 0) {
          totalInputTokens += systemPromptTokens + userInputTokensPerInteraction;
          
          // Add this interaction to the conversation history
          conversationHistory.push({
            input: userInputTokensPerInteraction,
            output: outputTokensPerInteraction
          });
        } else {
          // For subsequent interactions, we start with system prompt + current user input
          let inputTokensForThisInteraction = systemPromptTokens + userInputTokensPerInteraction;
          
          // Determine how many previous interactions to include based on history size
          // Important: we need to consider all previous interactions up to history size
          const historyCount = Math.min(conversationHistory.length, params.historySize);
          
          // Get the most recent history items based on the history size
          const relevantHistory = conversationHistory.slice(-historyCount);
          
          // Add tokens for each history item
          for (const historyItem of relevantHistory) {
            inputTokensForThisInteraction += historyItem.input; // Previous user input
            inputTokensForThisInteraction += historyItem.output; // Previous model output
          }
          
          // Add the format-specific token cost multiplied by history size
          if (historyCount > 0) {
            inputTokensForThisInteraction += formatTokenCost * historyCount;
          }
          
          totalInputTokens += inputTokensForThisInteraction;
          
          // Add this interaction to the conversation history
          conversationHistory.push({
            input: userInputTokensPerInteraction,
            output: outputTokensPerInteraction
          });
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