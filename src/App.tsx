import { useState, useRef, useEffect } from 'react';
import { streamMessageFromAPI } from '@/lib/api-client';
import type { Message as MessageType } from '@/lib/gemini';
import { Conversation } from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { PromptInput, PromptInputTextarea } from '@/components/ai-elements/prompt-input';
import { Button } from '@/components/ui/button';
import './App.css';

function App() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: MessageType = {
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    };
    
    const userInput = text.trim();

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Create a temporary message for streaming
      const tempMessage: MessageType = {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };
      
      let fullContent = '';
      let reasoning = '';
      
      // Add the message to the list
      setMessages(prev => [...prev, tempMessage]);
      
      // Stream the response (streamMessageFromAPI will add the userInput to history internally)
      await streamMessageFromAPI(
        messages,
        userInput,
        // On each chunk, update the message content
        (chunk) => {
          fullContent += chunk;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastIndex = newMessages.length - 1;
            if (newMessages[lastIndex]?.role === 'assistant') {
              newMessages[lastIndex] = {
                ...newMessages[lastIndex],
                content: fullContent,
              };
            }
            return newMessages;
          });
        },
        // On reasoning available
        (reasoningText) => {
          reasoning = reasoningText;
        },
        // On complete
        () => {
          // Update the final message with reasoning
          if (reasoning) {
            setMessages(prev => {
              const newMessages = [...prev];
              const lastIndex = newMessages.length - 1;
              if (newMessages[lastIndex]?.role === 'assistant') {
                newMessages[lastIndex] = {
                  ...newMessages[lastIndex],
                  reasoning: reasoning,
                };
              }
              return newMessages;
            });
          }
          setIsLoading(false);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };


  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">✦</span>
            Godex
          </h1>
          <p className="tagline">
            Powered by Gemini 2.5 Pro • Advanced reasoning for code, math & STEM
          </p>
        </div>
      </header>

      <main className="main">
        <Conversation>
          {messages.map((msg, idx) => (
            <Message key={idx} from={msg.role}>
              <MessageContent>
                {msg.reasoning && (
                  <details className="reasoning">
                    <summary>🧠 Thinking Process</summary>
                    <div className="reasoning-content">
                      {msg.reasoning}
                    </div>
                  </details>
                )}
                {msg.content}
              </MessageContent>
            </Message>
          ))}
          {isLoading && (
            <Message from="assistant">
              <MessageContent>
                <div className="thinking">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </MessageContent>
            </Message>
          )}
          <div ref={messagesEndRef} />
        </Conversation>

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        <PromptInput
          onSubmit={async ({ text }) => {
            if (text) {
              await handleSubmit(text);
            }
          }}
          className="input-form"
        >
          <PromptInputTextarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            placeholder="Ask Godex anything about code, math, or STEM..."
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? '⋯' : '→'}
          </Button>
        </PromptInput>
      </main>
    </div>
  );
}

export default App;
