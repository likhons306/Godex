import type { Message } from './gemini';

// Use relative URLs - Vite dev server will proxy to backend API (port 3001)
// In production, this should be updated to use the actual backend URL
const API_BASE_URL = '';

export async function streamMessageFromAPI(
  messages: Message[],
  userMessage: string,
  onChunk: (text: string) => void,
  onReasoning?: (reasoning: string) => void,
  onToolCall?: (toolCall: any) => void,
  onToolResult?: (toolResult: any) => void,
  onComplete?: () => void
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, userMessage }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));

          if (data.type === 'chunk') {
            onChunk(data.content);
          } else if (data.type === 'reasoning') {
            onReasoning?.(data.content);
          } else if (data.type === 'tool-call') {
            onToolCall?.(data);
          } else if (data.type === 'tool-result') {
            onToolResult?.(data);
          } else if (data.type === 'complete') {
            onComplete?.();
          } else if (data.type === 'error') {
            throw new Error(data.message);
          }
        }
      }
    }
  } catch (error) {
    console.error('API streaming error:', error);
    throw error;
  }
}

export async function sendMessageToAPI(
  messages: Message[],
  userMessage: string
): Promise<{ text: string; reasoning?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, userMessage }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API message error:', error);
    throw error;
  }
}

export async function analyzeCodeWithAPI(
  code: string,
  query: string
): Promise<{ text: string; reasoning?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API analysis error:', error);
    throw error;
  }
}
