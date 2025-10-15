import { GoogleGenAI } from "@google/genai";

// Gemini API integration using the @google/genai SDK
// Using Gemini 2.5 Pro for advanced reasoning and coding tasks
const ai = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" 
});

export interface Message {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export async function sendMessage(
  messages: Message[], 
  userMessage: string
): Promise<string> {
  try {
    // Convert our message format to Gemini format
    const history = messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: `You are Godex, a state-of-the-art AI coding assistant powered by Gemini 2.5 Pro. 
You are capable of reasoning over complex problems in code, math, and STEM. 
You can analyze large datasets, codebases, and documents using long context.
You provide clear, detailed explanations and high-quality code solutions.
When writing code, always include comments and follow best practices.
Format your responses in markdown for better readability.`,
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
      contents: [
        ...history,
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ],
    });

    return response.text || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to get response: ${error}`);
  }
}

export async function analyzeCode(code: string, query: string): Promise<string> {
  try {
    const prompt = `${query}\n\n\`\`\`\n${code}\n\`\`\``;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: `You are Godex, an expert code analyzer powered by Gemini 2.5 Pro.
Provide detailed analysis, suggestions for improvements, and explain complex concepts clearly.`,
        temperature: 0.3,
        maxOutputTokens: 8192,
      },
      contents: prompt,
    });

    return response.text || "Unable to analyze code.";
  } catch (error) {
    console.error("Code analysis error:", error);
    throw new Error(`Failed to analyze code: ${error}`);
  }
}
