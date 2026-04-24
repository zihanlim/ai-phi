import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export type AIProvider = "openai" | "anthropic";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

let openaiClient: OpenAI | null = null;
let anthropicClient: Anthropic | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.minimax.io/v1",
    });
  }
  return openaiClient;
}

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export async function chat(
  messages: ChatMessage[],
  philosopherSystemPrompt: string,
  provider: AIProvider = "openai"
) {
  if (provider === "anthropic" && !process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  if (provider === "openai" && !process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  // Truncate message history to prevent API errors with long conversations
  const MAX_MESSAGES = 20;
  const MAX_TOTAL_CHARS = 40000;
  
  let truncatedMessages = messages;
  if (messages.length > MAX_MESSAGES) {
    truncatedMessages = messages.slice(-MAX_MESSAGES);
  }
  
  // Also limit total characters
  let totalChars = truncatedMessages.reduce((sum, m) => sum + m.content.length, 0);
  while (totalChars > MAX_TOTAL_CHARS && truncatedMessages.length > 2) {
    truncatedMessages = truncatedMessages.slice(1);
    totalChars = truncatedMessages.reduce((sum, m) => sum + m.content.length, 0);
  }

  const systemMessage = {
    role: "system" as const,
    content: philosopherSystemPrompt,
  };

  if (provider === "anthropic") {
    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: philosopherSystemPrompt,
      messages: truncatedMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    });
    return response.content[0].type === "text"
      ? response.content[0].text
      : "";
  }

  const client = getOpenAIClient();
  const response = await client.chat.completions.create({
    model: "MiniMax-M2.7",
    messages: [systemMessage, ...truncatedMessages],
  });

  let content = response.choices[0]?.message?.content ?? "";

  // Strip thinking tags if present
  content = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  return content;
}
