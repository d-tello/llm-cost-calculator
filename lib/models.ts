import { LlmModel } from "./types";

export const models: LlmModel[] = [
  {
    id: "amazon-nova-micro",
    name: "Amazon Nova Micro",
    inputCost: 0.000035,
    outputCost: 0.00014,
    logo: "/logos/amazon-nova.svg"
  },
  {
    id: "amazon-nova-lite",
    name: "Amazon Nova Lite",
    inputCost: 0.00006,
    outputCost: 0.00024,
    logo: "/logos/amazon-nova.svg"
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    inputCost: 0.003,
    outputCost: 0.015,
    logo: "/logos/claude.svg"
  },
  {
    id: "claude-3-5-haiku",
    name: "Claude 3.5 Haiku",
    inputCost: 0.0008,
    outputCost: 0.004,
    logo: "/logos/claude.svg"
  },
  {
    id: "mistral-large-2",
    name: "Mistral Large 2 (24.07)",
    inputCost: 0.002,
    outputCost: 0.006,
    logo: "/logos/mistral.svg"
  },
  {
    id: "llama-3-3-instruct",
    name: "Llama 3.3 Instruct (70B)",
    inputCost: 0.00072,
    outputCost: 0.00072,
    logo: "/logos/llama.svg"
  }
]; 