import { useState, useRef, useEffect, useMemo } from 'react';
import { streamMessageFromAPI } from '@/lib/api-client';
import type { Message as MessageType } from '@/lib/gemini';
import { Sidebar } from '@/components/Sidebar';
import { Conversation } from '@/components/ai-elements/conversation';
import { Message, MessageContent } from '@/components/ai-elements/message';
import { PromptInput, PromptInputTextarea } from '@/components/ai-elements/prompt-input';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';
import LoginButton from '@/components/LoginButton';
import { Button } from '@/components/ui/button';
import './App.css';

// --- Types and Helpers ---

const generateId = () => `conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

interface ConversationType {
  id: string;
  title: string;
  messages: MessageType[];
}


function App() {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const messages = useMemo(() => {
    if (!activeConversationId) return [];
    return conversations.find(c => c.id === activeConversationId)?.messages || [];
  }, [conversations, activeConversationId]);

  const handleNewChat = () => {
    const newConv = {
      id: generateId(),
      title: "New Chat",
      messages: [],
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setInput('');
    setError(null);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Load and migrate chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          if (parsedHistory.length === 0) {
            // Handle empty history
            handleNewChat();
          } else if ('role' in parsedHistory[0] && 'content' in parsedHistory[0]) {
            // Old format: migrate to the new structure
            const newConversation: ConversationType = {
              id: generateId(),
              title: parsedHistory.find(m => m.role === 'user')?.content.substring(0, 40).trim() + '...' || 'Untitled Chat',
              messages: parsedHistory,
            };
            setConversations([newConversation]);
            setActiveConversationId(newConversation.id);
          } else if ('id' in parsedHistory[0] && 'messages' in parsedHistory[0]) {
            // New format
            setConversations(parsedHistory);
            if (parsedHistory.length > 0) {
              setActiveConversationId(parsedHistory[0].id);
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse or migrate chat history:", e);
        localStorage.removeItem('chatHistory'); // Clear corrupted history
        handleNewChat();
      }
    } else {
      handleNewChat();
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(conversations));
    }
  }, [conversations]);

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userInput = text.trim();
    const userMessage: MessageType = {
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };

    setInput('');
    setIsLoading(true);
    setError(null);

    let convId = activeConversationId;
    let historyForApi: MessageType[] = [];

    if (convId) {
      historyForApi = conversations.find(c => c.id === convId)?.messages || [];
      // Update state with the new user message
      setConversations(prev =>
        prev.map(c =>
          c.id === convId ? { ...c, messages: [...c.messages, userMessage] } : c
        )
      );
    } else {
      // Create a new conversation
      const newConv: ConversationType = {
        id: generateId(),
        title: userInput.substring(0, 40) || "New Chat",
        messages: [userMessage],
      };
      convId = newConv.id;
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      // historyForApi is already []
    }

    try {
      const tempMessage: MessageType = { role: 'assistant', content: '', timestamp: Date.now() };
      // Add a placeholder for the streaming response
      setConversations(prev =>
        prev.map(c =>
          c.id === convId ? { ...c, messages: [...c.messages, tempMessage] } : c
        )
      );

      let fullContent = '';
      let reasoning = '';

      const updateLastMessage = (updater: (lastMessage: MessageType) => MessageType) => {
        setConversations(prev => {
          return prev.map(c => {
            if (c.id === convId) {
              const newMessages = [...c.messages];
              const lastIndex = newMessages.length - 1;
              if (lastIndex >= 0) {
                newMessages[lastIndex] = updater(newMessages[lastIndex]);
              }
              return { ...c, messages: newMessages };
            }
            return c;
          });
        });
      };

      await streamMessageFromAPI(
        historyForApi,
        userInput,
        (chunk) => {
          fullContent += chunk;
          updateLastMessage(lastMsg => ({ ...lastMsg, content: fullContent }));
        },
        (reasoningText) => {
          reasoning = reasoningText;
          updateLastMessage(lastMsg => ({ ...lastMsg, reasoning: reasoning }));
        },
        (toolCall) => {
          updateLastMessage(lastMsg => ({ ...lastMsg, tool: { ...toolCall, state: 'input-available' } }));
        },
        (toolResult) => {
          updateLastMessage(lastMsg => ({ ...lastMsg, tool: { ...toolResult, state: 'output-available' } }));
        },
        () => {
          setIsLoading(false);
        }
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
    }
  };


  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
      />
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
            <div className="login-container">
              <LoginButton />
            </div>
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
                  {msg.tool && (
                    <Tool defaultOpen>
                      <ToolHeader
                        type={msg.tool.toolName}
                        state={msg.tool.state}
                      />
                      <ToolContent>
                        <ToolInput input={msg.tool.args} />
                        {msg.tool.state === 'output-available' && (
                          <ToolOutput output={msg.tool.result} />
                        )}
                      </ToolContent>
                    </Tool>
                  )}
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
    </div>
  );
}

export default App;
