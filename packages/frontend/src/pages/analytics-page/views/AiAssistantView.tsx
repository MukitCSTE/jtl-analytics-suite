import { useState, useRef, useEffect, useCallback } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import {
  Card,
  CardContent,
  Text,
} from '@jtl-software/platform-ui-react';
import { Send, Sparkles, Loader2, Bot, User, Code, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AiAssistantViewProps {
  appBridge: AppBridge;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  query?: string;
  timestamp: Date;
  isLoading?: boolean;
}

interface Suggestion {
  icon: string;
  text: string;
}

const AI_SERVER_URL = 'http://localhost:3006/mcp';

const AiAssistantView: React.FC<AiAssistantViewProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showQuery, setShowQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Default suggestions (static list)
  useEffect(() => {
    setSuggestions([
      { icon: '📊', text: "Show me recent sales orders" },
      { icon: '🚨', text: "Any suspicious orders?" },
      { icon: '📦', text: "Which products need restocking?" },
      { icon: '👑', text: "Who are my top customers?" },
      { icon: '🧾', text: "Show me unpaid invoices" },
      { icon: '🏭', text: "Show production orders" },
      { icon: '🏬', text: "List all warehouses" },
      { icon: '🚚', text: "List all shipping methods" },
      { icon: '📈', text: "What are my best selling products?" },
      { icon: '💰', text: "Show highest value orders" },
      { icon: '🏷️', text: "List all product categories" },
      { icon: '📦', text: "Show items with low stock" },
    ]);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${AI_SERVER_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: data.answer || data.error || 'No response',
        query: data.query,
        timestamp: new Date(),
      };

      setMessages(prev => [
        ...prev.filter(m => !m.isLoading),
        assistantMessage,
      ]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `Connection error. Make sure the AI server is running on ${AI_SERVER_URL}`,
        timestamp: new Date(),
      };

      setMessages(prev => [
        ...prev.filter(m => !m.isLoading),
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  const clearChat = () => {
    setMessages([]);
    setShowQuery(null);
  };

  return (
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 200px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            }}
          >
            <Sparkles size={24} color="white" />
          </div>
          <div>
            <Text type="h2" weight="bold">
              AI Analytics Assistant
            </Text>
            <Text type="small" color="muted">
              Ask anything about your business data in natural language
            </Text>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            <RefreshCw size={16} />
            Clear Chat
          </button>
        )}
      </div>

      {/* Value Proposition */}
      <div
        className="p-4 rounded-lg border-l-4"
        style={{
          background: 'linear-gradient(90deg, rgba(139,92,246,0.1) 0%, transparent 100%)',
          borderColor: '#8b5cf6',
        }}
      >
        <div className="text-sm font-semibold" style={{ color: '#8b5cf6' }}>
          Talk to your ERP like never before
        </div>
        <Text type="small" color="muted">
          No more clicking through menus. Just ask questions like "Who are my top customers?" or
          "Which products need restocking?" and get instant AI-powered insights from your JTL data.
        </Text>
      </div>

      {/* Chat Area */}
      <Card style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <CardContent style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-6">
              <div className="text-center">
                <Bot size={48} className="mx-auto mb-4 text-gray-300" />
                <Text type="h4" weight="semibold">
                  What would you like to know?
                </Text>
                <Text type="small" color="muted">
                  Ask any question about your orders, customers, inventory, or sales
                </Text>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-2xl">
                {suggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(suggestion.text)}
                    className="p-3 text-left rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-all text-sm"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <span className="mr-2">{suggestion.icon}</span>
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}
                    >
                      {message.isLoading ? (
                        <Loader2 size={16} color="white" className="animate-spin" />
                      ) : (
                        <Bot size={16} color="white" />
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-md'
                        : 'bg-gray-100 rounded-bl-md'
                    }`}
                  >
                    {message.isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                          />
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          />
                        </div>
                        <Text type="small" color="muted">
                          Analyzing your data...
                        </Text>
                      </div>
                    ) : (
                      <>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown
                            components={{
                              table: ({ children }) => (
                                <table className="min-w-full border-collapse border border-gray-300 my-2 text-sm">
                                  {children}
                                </table>
                              ),
                              thead: ({ children }) => (
                                <thead className="bg-purple-100">{children}</thead>
                              ),
                              th: ({ children }) => (
                                <th className="border border-gray-300 px-3 py-2 text-left font-semibold text-purple-800">
                                  {children}
                                </th>
                              ),
                              td: ({ children }) => (
                                <td className="border border-gray-300 px-3 py-2">{children}</td>
                              ),
                              h1: ({ children }) => (
                                <h1 className="text-xl font-bold text-gray-800 mt-3 mb-2">{children}</h1>
                              ),
                              h2: ({ children }) => (
                                <h2 className="text-lg font-bold text-gray-800 mt-3 mb-2">{children}</h2>
                              ),
                              h3: ({ children }) => (
                                <h3 className="text-base font-semibold text-gray-700 mt-2 mb-1">{children}</h3>
                              ),
                              h4: ({ children }) => (
                                <h4 className="text-sm font-semibold text-gray-700 mt-2 mb-1">{children}</h4>
                              ),
                              ul: ({ children }) => (
                                <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-sm">{children}</li>
                              ),
                              strong: ({ children }) => {
                                // Check if it's a label (ends with :) or a value
                                const text = String(children);
                                const isLabel = text.endsWith(':');
                                return (
                                  <strong className={`font-semibold ${isLabel ? 'text-gray-700' : 'text-purple-600'}`}>
                                    {children}
                                  </strong>
                                );
                              },
                              p: ({ children }) => (
                                <p className="my-1 text-sm leading-relaxed">{children}</p>
                              ),
                              a: ({ children, href }) => (
                                <a href={href} className="text-purple-600 hover:text-purple-800 font-medium">{children}</a>
                              ),
                              code: ({ children }) => (
                                <code className="bg-gray-200 px-1 py-0.5 rounded text-purple-700 text-xs">{children}</code>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                        {message.query && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <button
                              onClick={() =>
                                setShowQuery(showQuery === message.id ? null : message.id)
                              }
                              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800"
                            >
                              <Code size={12} />
                              {showQuery === message.id ? 'Hide' : 'Show'} GraphQL
                            </button>
                            {showQuery === message.id && (
                              <pre className="mt-2 p-2 bg-gray-800 text-green-400 rounded text-xs overflow-x-auto">
                                {message.query}
                              </pre>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#6366f1' }}
                    >
                      <User size={16} color="white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4" style={{ borderColor: '#e5e7eb' }}>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about your orders, customers, inventory..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{ borderColor: '#e5e7eb' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex items-center justify-center px-4 py-3 rounded-xl text-white disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              }}
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>

          {/* Quick Actions */}
          {messages.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {[
                { icon: '📊', label: 'Recent sales', query: 'Show me recent sales orders' },
                { icon: '🚨', label: 'Fraud check', query: 'Any suspicious orders?' },
                { icon: '📦', label: 'Low stock', query: 'Show items with low stock' },
                { icon: '👑', label: 'Top customers', query: 'Who are my top customers?' },
                { icon: '🧾', label: 'Unpaid invoices', query: 'Show me unpaid invoices' },
                { icon: '📈', label: 'Best sellers', query: 'What are my best selling products?' },
                { icon: '🏭', label: 'Production', query: 'Show production orders' },
                { icon: '🏷️', label: 'Categories', query: 'List all product categories' },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(item.query)}
                  className="px-3 py-1 text-xs rounded-full border border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AiAssistantView;
