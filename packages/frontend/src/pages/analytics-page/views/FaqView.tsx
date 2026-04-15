import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Text,
  Stack,
  Box,
} from '@jtl-software/platform-ui-react';
import { HelpCircle, Terminal, Code, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const FaqView: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const mcpConfig = `{
  "mcpServers": {
    "jtl-analytics": {
      "command": "node",
      "args": ["/path/to/mukit-jtl-app/packages/mcp-server/dist/index.js"],
      "env": {
        "OPENAI_API_URL": "https://apim-ai-hub-jtlpltf-beta.azure-api.net/openai/v1",
        "OPENAI_API_KEY": "your-api-key",
        "CLIENT_ID": "your-jtl-client-id",
        "CLIENT_SECRET": "your-jtl-client-secret",
        "DEMO_TENANT_ID": "your-tenant-id"
      }
    }
  }
}`;

  const faqs: FaqItem[] = [
    {
      question: 'How do I connect JTL Analytics to Claude Code?',
      answer: (
        <div className="space-y-4">
          <Text type="small" color="muted">
            Follow these steps to connect the JTL Analytics MCP server to Claude Code:
          </Text>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">1</span>
              </div>
              <div>
                <Text type="small" weight="semibold">Build the MCP Server</Text>
                <div className="mt-2 p-3 bg-gray-900 rounded-lg relative group">
                  <code className="text-green-400 text-sm">
                    cd packages/mcp-server && npm install && npm run build
                  </code>
                  <button
                    onClick={() => copyToClipboard('cd packages/mcp-server && npm install && npm run build', 1)}
                    className="absolute right-2 top-2 p-1 rounded hover:bg-gray-700"
                  >
                    {copiedIndex === 1 ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">2</span>
              </div>
              <div>
                <Text type="small" weight="semibold">Open Claude Code Settings</Text>
                <Text type="small" color="muted">
                  In Claude Code, go to Settings → MCP Servers or edit your <code className="bg-gray-100 px-1 rounded">~/.claude/settings.json</code>
                </Text>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">3</span>
              </div>
              <div className="w-full">
                <Text type="small" weight="semibold">Add the MCP Server Configuration</Text>
                <div className="mt-2 p-3 bg-gray-900 rounded-lg relative">
                  <pre className="text-green-400 text-xs overflow-x-auto">{mcpConfig}</pre>
                  <button
                    onClick={() => copyToClipboard(mcpConfig, 3)}
                    className="absolute right-2 top-2 p-1 rounded hover:bg-gray-700"
                  >
                    {copiedIndex === 3 ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold text-sm">4</span>
              </div>
              <div>
                <Text type="small" weight="semibold">Restart Claude Code</Text>
                <Text type="small" color="muted">
                  The JTL Analytics tools will now be available. Try asking: "Use the query_jtl_data tool to show my recent orders"
                </Text>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      question: 'What tools are available in the MCP server?',
      answer: (
        <div className="space-y-3">
          <div className="p-3 rounded-lg border" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-purple-500" />
              <Text type="small" weight="semibold">query_jtl_data</Text>
            </div>
            <Text type="small" color="muted">
              Ask any question in natural language. Example: "Which customers ordered more than 500€ last week?"
            </Text>
          </div>

          <div className="p-3 rounded-lg border" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center gap-2 mb-1">
              <Terminal size={16} className="text-blue-500" />
              <Text type="small" weight="semibold">analyze_sales</Text>
            </div>
            <Text type="small" color="muted">
              Get AI-powered sales analysis. Parameters: timeframe (today, this_week, this_month), focus (revenue, orders, customers)
            </Text>
          </div>

          <div className="p-3 rounded-lg border" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center gap-2 mb-1">
              <Terminal size={16} className="text-red-500" />
              <Text type="small" weight="semibold">detect_fraud</Text>
            </div>
            <Text type="small" color="muted">
              Scan for suspicious orders. Parameters: lookback_days (default: 7)
            </Text>
          </div>

          <div className="p-3 rounded-lg border" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center gap-2 mb-1">
              <Terminal size={16} className="text-orange-500" />
              <Text type="small" weight="semibold">predict_reorder</Text>
            </div>
            <Text type="small" color="muted">
              Get inventory restock recommendations. Parameters: urgency (critical, soon, all)
            </Text>
          </div>

          <div className="p-3 rounded-lg border" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center gap-2 mb-1">
              <Terminal size={16} className="text-green-500" />
              <Text type="small" weight="semibold">customer_insights</Text>
            </div>
            <Text type="small" color="muted">
              Analyze customer segments. Parameters: segment (vip, at_risk, new, inactive, all)
            </Text>
          </div>
        </div>
      ),
    },
    {
      question: 'How do I run the HTTP server for the web UI?',
      answer: (
        <div className="space-y-3">
          <Text type="small" color="muted">
            The HTTP server exposes the same AI tools via REST API for the web interface:
          </Text>

          <div className="p-3 bg-gray-900 rounded-lg relative">
            <code className="text-green-400 text-sm">
              cd packages/mcp-server && npm run start:http
            </code>
            <button
              onClick={() => copyToClipboard('cd packages/mcp-server && npm run start:http', 10)}
              className="absolute right-2 top-2 p-1 rounded hover:bg-gray-700"
            >
              {copiedIndex === 10 ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
            </button>
          </div>

          <Text type="small" color="muted">
            The server runs on <code className="bg-gray-100 px-1 rounded">http://localhost:3006</code> by default.
          </Text>

          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <Text type="small" weight="semibold" style={{ color: '#3b82f6' }}>
              Available Endpoints:
            </Text>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• <code>POST /query</code> - Natural language queries</li>
              <li>• <code>POST /analyze-sales</code> - Sales analysis</li>
              <li>• <code>POST /detect-fraud</code> - Fraud detection</li>
              <li>• <code>POST /predict-reorder</code> - Inventory predictions</li>
              <li>• <code>POST /customer-insights</code> - Customer analysis</li>
              <li>• <code>GET /suggestions</code> - Quick query suggestions</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      question: 'What data can I query?',
      answer: (
        <div className="space-y-3">
          <Text type="small" color="muted">
            The AI can query two main data types from JTL ERP:
          </Text>

          <div className="p-3 rounded-lg bg-gray-50">
            <Text type="small" weight="semibold">Sales Orders (QuerySalesOrders)</Text>
            <Text type="xs" color="muted" className="mt-1">
              Order details, amounts, customer info, billing/shipping addresses, delivery status, payment status, shipping methods
            </Text>
          </div>

          <div className="p-3 rounded-lg bg-gray-50">
            <Text type="small" weight="semibold">Products/Inventory (QueryItems)</Text>
            <Text type="xs" color="muted" className="mt-1">
              SKU, name, stock levels (total, available, in orders, incoming), minimum stock, prices, supplier info
            </Text>
          </div>

          <div className="mt-3 p-3 bg-purple-50 rounded-lg">
            <Text type="small" weight="semibold" style={{ color: '#8b5cf6' }}>
              Example Questions:
            </Text>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• "What's my revenue this week vs last week?"</li>
              <li>• "Which products are running low on stock?"</li>
              <li>• "Show orders from Germany over 500€"</li>
              <li>• "Who are my top 10 customers by total spend?"</li>
              <li>• "Find orders with shipping/billing address mismatch"</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      question: 'How does the AI generate GraphQL queries?',
      answer: (
        <div className="space-y-3">
          <Text type="small" color="muted">
            The system uses a three-step process:
          </Text>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <div>
                <Text type="small" weight="semibold">Question → GraphQL</Text>
                <Text type="xs" color="muted">AI converts your natural language to a valid GraphQL query</Text>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <Text type="small" weight="semibold">Execute Query</Text>
                <Text type="xs" color="muted">GraphQL runs against JTL ERP API with your tenant credentials</Text>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <Text type="small" weight="semibold">Format Response</Text>
                <Text type="xs" color="muted">AI analyzes results and provides a helpful, readable answer</Text>
              </div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-gray-100 rounded-lg">
            <Text type="xs" color="muted">
              You can always click "Show GraphQL" on any response to see the exact query that was executed.
            </Text>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Stack spacing="6" direction="column">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
        >
          <HelpCircle size={24} color="white" />
        </div>
        <div>
          <Text type="h2" weight="bold">
            FAQ & Setup Guide
          </Text>
          <Text type="small" color="muted">
            Learn how to connect JTL Analytics AI to Claude Code and make the most of it
          </Text>
        </div>
      </div>

      {/* Quick Start Card */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-purple-50 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Terminal size={24} className="text-purple-600" />
              </div>
              <Text type="small" weight="semibold">1. Build MCP Server</Text>
              <Text type="xs" color="muted" className="mt-1">
                npm install && npm run build
              </Text>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Code size={24} className="text-blue-600" />
              </div>
              <Text type="small" weight="semibold">2. Configure Claude Code</Text>
              <Text type="xs" color="muted" className="mt-1">
                Add to settings.json
              </Text>
            </div>

            <div className="p-4 rounded-lg bg-green-50 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={24} className="text-green-600" />
              </div>
              <Text type="small" weight="semibold">3. Start Asking</Text>
              <Text type="xs" color="muted" className="mt-1">
                "Show my sales today"
              </Text>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden"
                style={{ borderColor: '#e5e7eb' }}
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <Text type="small" weight="semibold">
                    {faq.question}
                  </Text>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-transform"
                    style={{
                      background: expandedIndex === index ? '#8b5cf6' : '#e5e7eb',
                      transform: expandedIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      style={{ color: expandedIndex === index ? 'white' : '#6b7280' }}
                    >
                      <path
                        d="M2 4L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
                {expandedIndex === index && (
                  <div className="px-4 pb-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                    <div className="pt-4">{faq.answer}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* External Links */}
      <div className="flex gap-4">
        <a
          href="https://github.com/anthropics/claude-code"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#e5e7eb' }}
        >
          <ExternalLink size={16} className="text-gray-500" />
          <Text type="small">Claude Code Docs</Text>
        </a>
        <a
          href="https://modelcontextprotocol.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#e5e7eb' }}
        >
          <ExternalLink size={16} className="text-gray-500" />
          <Text type="small">MCP Documentation</Text>
        </a>
      </div>
    </Stack>
  );
};

export default FaqView;
