import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { streamMessage, type Message } from './lib/gemini';
import './App.css';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };
    
    const userInput = input.trim();

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Create a temporary message for streaming
      const tempMessage: Message = {
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };
      
      let fullContent = '';
      let reasoning = '';
      
      // Add the message to the list
      setMessages(prev => [...prev, tempMessage]);
      
      // Stream the response (streamMessage will add the userInput to history internally)
      await streamMessage(
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
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
        <div className="chat-container">
          {messages.length === 0 ? (
            <div className="welcome">
              <h2>What should we code next?</h2>
              <p>
                Godex is your state-of-the-art AI coding assistant, capable of reasoning
                over complex problems in code, math, and STEM. I can analyze large
                datasets, codebases, and documents using long context.
              </p>
              <div className="suggestions">
                <button
                  className="suggestion"
                  onClick={() => setInput('Explain how async/await works in JavaScript')}
                >
                  Explain async/await in JavaScript
                </button>
                <button
                  className="suggestion"
                  onClick={() => setInput('Help me optimize a React component for performance')}
                >
                  Optimize React performance
                </button>
                <button
                  className="suggestion"
                  onClick={() => setInput('Write a Python script to analyze CSV data')}
                >
                  Analyze CSV data with Python
                </button>
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'user' ? '👤' : '✦'}
                  </div>
                  <div className="message-content">
                    {msg.reasoning && (
                      <details className="reasoning">
                        <summary>🧠 Thinking Process</summary>
                        <div className="reasoning-content">
                          <ReactMarkdown>{msg.reasoning}</ReactMarkdown>
                        </div>
                      </details>
                    )}
                    <ReactMarkdown
                      components={{
                        code({ node, className, children, ...props }) {
                          const inline = !className;
                          const match = /language-(\w+)/.exec(className || '');
                          const language = match ? match[1] : '';
                          
                          return inline ? (
                            <code className="inline-code" {...props}>
                              {children}
                            </code>
                          ) : (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={language}
                              PreTag="div"
                              customStyle={{
                                borderRadius: '8px',
                                margin: '1em 0',
                              }}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          );
                        },
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="message model">
                  <div className="message-avatar">✦</div>
                  <div className="message-content">
                    <div className="thinking">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form className="input-form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Godex anything about code, math, or STEM..."
              className="input"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? '⋯' : '→'}
            </button>
          </div>
          <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>
        </form>
      </main>
    </div>
  );
}

export default App;
