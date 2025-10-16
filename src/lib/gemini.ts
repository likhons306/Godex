import { google } from "@ai-sdk/google";
import { streamText, generateText } from "ai";
import { z } from "zod";
import { DuckDuckGoSearchClient } from "@agent-infra/duckduckgo-search";

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  reasoning?: string;
  tool?: any;
}

// Stream messages with thinking/reasoning support using AI SDK
export async function streamMessage(
  messages: Message[],
  userMessage: string,
  onChunk: (text: string) => void,
  onReasoning?: (reasoning: string) => void,
  onToolCall?: (toolCall: any) => void,
  onToolResult?: (toolResult: any) => void,
  onComplete?: () => void
) {
  try {
    // Convert messages to AI SDK format
    const history = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const result = streamText({
      model: google('gemini-2.5-pro'),
      system: `You are Godex, an AI coding assistant powered by Gemini 2.5 Pro.

Your personality is concise, direct, and friendly. You communicate efficiently, keeping the user clearly informed without unnecessary detail. You prioritize actionable guidance, clearly stating assumptions and next steps.

When coding:
- Write clean, maintainable code following best practices
- Add brief comments only when code isn't self-explanatory
- Focus on solving the root problem, not surface-level patches
- Keep changes minimal and consistent with existing style

Format responses in markdown with syntax-highlighted code blocks. Be precise, safe, and helpful.`,
      messages: [
        ...history,
        {
          role: 'user',
          content: userMessage,
        },
      ],
      tools: {
        search: {
          description: "Search the web for information.",
          parameters: z.object({
            query: z.string().describe("The search query."),
          }),
          execute: async ({ query }) => {
            const client = new DuckDuckGoSearchClient();
            const searchResults = await client.search({ query });
            return JSON.stringify(searchResults, null, 2);
          },
        },
      },
      temperature: 0.7,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 8192,
            includeThoughts: true,
          },
        },
      },
    });

    for await (const part of result.fullStream) {
      switch (part.type) {
        case 'text-delta':
          onChunk(part.textDelta);
          break;
        case 'tool-call':
          onToolCall?.(part);
          break;
        case 'tool-result':
          onToolResult?.(part);
          break;
      }
    }

    // Handle reasoning/thinking if available
    const finalResult = await result;
    const reasoning = await finalResult.reasoning;
    if (reasoning && reasoning.length > 0) {
      const reasoningText = reasoning.map((r: any) => r.text).join('\n');
      onReasoning?.(reasoningText);
    }

    onComplete?.();
  } catch (error) {
    console.error("Gemini streaming error:", error);
    throw new Error(`Failed to stream response: ${error}`);
  }
}

// Generate text without streaming (for simpler use cases)
export async function sendMessage(
  messages: Message[],
  userMessage: string
): Promise<{ text: string; reasoning?: string }> {
  try {
    const history = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const result = await generateText({
      model: google('gemini-2.5-pro'),
      system: `You are Godex, an AI coding assistant powered by Gemini 2.5 Pro.

Your personality is concise, direct, and friendly. You communicate efficiently, keeping the user clearly informed without unnecessary detail. You prioritize actionable guidance, clearly stating assumptions and next steps.

When coding:
- Write clean, maintainable code following best practices
- Add brief comments only when code isn't self-explanatory
- Focus on solving the root problem, not surface-level patches
- Keep changes minimal and consistent with existing style

Format responses in markdown with syntax-highlighted code blocks. Be precise, safe, and helpful.`,
      messages: [
        ...history,
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 8192,
            includeThoughts: true,
          },
        },
      },
    });

    const reasoning = await result.reasoning;
    return {
      text: result.text,
      reasoning: reasoning && reasoning.length > 0 
        ? reasoning.map((r: any) => r.text).join('\n')
        : undefined,
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to get response: ${error}`);
  }
}

// Analyze code with Gemini 2.5 Pro
export async function analyzeCode(
  code: string,
  query: string
): Promise<{ text: string; reasoning?: string }> {
  try {
    const prompt = `${query}\n\n\`\`\`\n${code}\n\`\`\``;

    const result = await generateText({
      model: google('gemini-2.5-pro'),
      system: `You are Godex, an expert code analyzer powered by Gemini 2.5 Pro.

You MUST return your analysis in a structured XML format. The XML should have a root element named 'analysis', and child elements for 'summary', 'bugs', 'risks', and 'maintainability'. Each of these child elements should contain a list of 'issue' elements, with each 'issue' element having a 'severity' attribute (low, medium, high) and a 'description' attribute.

Be concise, direct, and friendly. Provide actionable analysis and concrete suggestions for improvement. Focus on bugs, risks, and maintainability. Explain complex concepts clearly but efficiently.`,
      prompt: prompt,
      temperature: 0.3,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 8192,
            includeThoughts: true,
          },
        },
      },
    });

    const reasoning = await result.reasoning;
    return {
      text: result.text,
      reasoning: reasoning && reasoning.length > 0 
        ? reasoning.map((r: any) => r.text).join('\n')
        : undefined,
    };
  } catch (error) {
    console.error("Code analysis error:", error);
    throw new Error(`Failed to analyze code: ${error}`);
  }
}
