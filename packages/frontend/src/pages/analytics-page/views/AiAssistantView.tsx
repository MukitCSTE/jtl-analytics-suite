import { useState, useRef, useEffect, useCallback } from 'react';
import { AppBridge } from '@jtl-software/cloud-apps-core';
import {
  Card,
  CardContent,
  Text,
  Stack,
  Box,
  Button,
  Badge,
} from '@jtl-software/platform-ui-react';
import { Send, Sparkles, Loader2, Bot, User, Code, RefreshCw } from 'lucide-react';

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

const AI_SERVER_URL = 'http://localhost:3006';

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
      { icon: '📊', text: "How are sales today?" },
      { icon: '🚨', text: "Any suspicious orders?" },
      { icon: '📦', text: "Which products need restocking?" },
      { icon: '👑', text: "Who are my top customers?" },
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
    <Stack spacing="4" direction="column" style={{ height: 'calc(100vh - 200px)' }}>
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
          <Button
            variant="outline"
            label="Clear Chat"
            onClick={clearChat}
            icon={<RefreshCw size={16} />}
          />
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
        <Text type="small" weight="semibold" style={{ color: '#8b5cf6' }}>
          Talk to your ERP like never before
        </Text>
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
              <div className="grid grid-cols-2 gap-2 w-full max-w-lg">
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
                        <div
                          className="whitespace-pre-wrap text-sm"
                          style={{ lineHeight: 1.6 }}
                        >
                          {message.content}
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
            <Button
              type="submit"
              variant="default"
              disabled={!input.trim() || isLoading}
              label=""
              icon={
                isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )
              }
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
              }}
            />
          </form>

          {/* Quick Actions */}
          {messages.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              <Badge
                variant="outline"
                label="📊 Sales today"
                onClick={() => sendMessage("How are sales today?")}
                style={{ cursor: 'pointer' }}
              />
              <Badge
                variant="outline"
                label="🚨 Fraud check"
                onClick={() => sendMessage("Any suspicious orders?")}
                style={{ cursor: 'pointer' }}
              />
              <Badge
                variant="outline"
                label="📦 Low stock"
                onClick={() => sendMessage("Products running low?")}
                style={{ cursor: 'pointer' }}
              />
              <Badge
                variant="outline"
                label="👑 Top customers"
                onClick={() => sendMessage("Who are my best customers?")}
                style={{ cursor: 'pointer' }}
              />
            </div>
          )}
        </div>
      </Card>
    </Stack>
  );
};

export default AiAssistantView;
