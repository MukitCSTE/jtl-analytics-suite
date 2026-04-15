#!/usr/bin/env node
/**
 * JTL Analytics AI MCP Server
 *
 * Provides natural language query capabilities for JTL ERP data.
 * Can be used with Claude Code, Claude Desktop, or any MCP-compatible client.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

dotenv.config();

// =============================================================================
// CONFIGURATION
// =============================================================================

const CONFIG = {
  openai: {
    url: process.env.OPENAI_API_URL || 'https://apim-ai-hub-jtlpltf-beta.azure-api.net/openai/v1',
    key: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
  jtl: {
    apiUrl: process.env.JTL_API_URL || 'https://api.beta.jtl-cloud.com',
    clientId: process.env.CLIENT_ID || '',
    clientSecret: process.env.CLIENT_SECRET || '',
    demoTenantId: process.env.DEMO_TENANT_ID || '',
  },
};

// =============================================================================
// JTL API CLIENT
// =============================================================================

let cachedJwt: { token: string; expires: number } | null = null;

async function getJwt(): Promise<string> {
  // Return cached token if still valid
  if (cachedJwt && Date.now() < cachedJwt.expires) {
    return cachedJwt.token;
  }

  const authString = Buffer.from(`${CONFIG.jtl.clientId}:${CONFIG.jtl.clientSecret}`).toString('base64');

  const response = await fetch('https://auth.jtl-cloud.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${authString}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get JWT: ${response.status}`);
  }

  const data = await response.json();
  cachedJwt = {
    token: data.access_token,
    expires: Date.now() + (data.expires_in - 60) * 1000, // Refresh 60s before expiry
  };

  return cachedJwt.token;
}

async function executeGraphQL(query: string, tenantId?: string): Promise<any> {
  const jwt = await getJwt();
  const tenant = tenantId || CONFIG.jtl.demoTenantId;

  const response = await fetch(`${CONFIG.jtl.apiUrl}/erp/v2/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
      'X-Tenant-ID': tenant,
    },
    body: JSON.stringify({ query }),
  });

  return response.json();
}

// =============================================================================
// OPENAI CLIENT
// =============================================================================

async function callOpenAI(messages: Array<{ role: string; content: string }>): Promise<string> {
  const response = await fetch(`${CONFIG.openai.url}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': CONFIG.openai.key,
    },
    body: JSON.stringify({
      model: CONFIG.openai.model,
      messages,
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// =============================================================================
// AI PROMPTS
// =============================================================================

const GRAPHQL_SCHEMA = `
You are a JTL ERP GraphQL expert. Convert natural language to GraphQL queries.

Available Types:

1. QuerySalesOrders - Sales orders
   Fields: salesOrderNumber, salesOrderDate, totalGrossAmount, totalNetAmount, currencyIso,
           companyName, customerNumber, customerId,
           billingAddressCity, billingAddressCountryIso, billingAddressCountryName,
           shipmentAddressCity, shipmentAddressCountryIso, shipmentAddressCountryName,
           deliveryStatus, deliveryCompleteStatus, paymentStatus,
           shippingMethodName, shippingPriority, estimatedDeliveryDate, lastShippingDate,
           isPending, isCancelled

2. QueryItems - Products/Inventory
   Fields: id, sku, name, description,
           stockTotal, stockAvailable, stockInOrders, stockIncoming,
           minimumStock, hasMinimumStock,
           salesPriceGross, salesPriceNet, profit,
           defaultSupplier, lastPurchaseDate,
           isActive, createdDate, modifiedDate

Filters: where: { and/or: [{ field: { eq/neq/gt/gte/lt/lte/contains: value } }] }
Order: order: [{ field: ASC/DESC }]
Pagination: first: N (default 50)

Today: ${new Date().toISOString().split('T')[0]}

Return ONLY valid GraphQL, no explanation.
`;

const RESPONSE_FORMAT = `
You are a helpful JTL ERP analytics assistant.
Format data clearly with:
- Key insights first
- Bullet points for lists
- German number format (1.234,56 EUR)
- Dates as DD.MM.YYYY
- Actionable recommendations when relevant
`;

// =============================================================================
// TOOL IMPLEMENTATIONS
// =============================================================================

async function queryJtlData(question: string, tenantId?: string): Promise<{
  answer: string;
  query: string;
  data: any;
}> {
  // Generate GraphQL from question
  const graphqlQuery = await callOpenAI([
    { role: 'system', content: GRAPHQL_SCHEMA },
    { role: 'user', content: question },
  ]);

  const cleanQuery = graphqlQuery.replace(/```graphql?/gi, '').replace(/```/g, '').trim();

  // Execute query
  const result = await executeGraphQL(cleanQuery, tenantId);

  if (result.errors) {
    return {
      answer: `Query error: ${result.errors[0]?.message}. Try rephrasing.`,
      query: cleanQuery,
      data: null,
    };
  }

  // Format response
  const answer = await callOpenAI([
    { role: 'system', content: RESPONSE_FORMAT },
    { role: 'user', content: `Question: ${question}\n\nData:\n${JSON.stringify(result.data, null, 2)}\n\nProvide a helpful answer.` },
  ]);

  return { answer, query: cleanQuery, data: result.data };
}

async function analyzeSales(timeframe: string, focus: string, tenantId?: string): Promise<string> {
  const question = `Analyze ${focus} for ${timeframe}. Show trends, totals, and key insights.`;
  const result = await queryJtlData(question, tenantId);
  return result.answer;
}

async function detectFraud(lookbackDays: number, tenantId?: string): Promise<string> {
  const question = `Find potentially fraudulent orders from the last ${lookbackDays} days.
    Look for: high-value orders from new customers, billing/shipping address mismatches,
    unusual order patterns, weekend/late-night orders with high amounts.`;
  const result = await queryJtlData(question, tenantId);
  return result.answer;
}

async function predictReorder(urgency: string, tenantId?: string): Promise<string> {
  const question = `Show products that need reordering. Focus on ${urgency} priority items.
    Check stock levels vs minimum stock, items with high order volume but low availability.`;
  const result = await queryJtlData(question, tenantId);
  return result.answer;
}

async function customerInsights(segment: string, tenantId?: string): Promise<string> {
  const question = `Analyze ${segment} customers. Show their order patterns, total spend,
    frequency, and recommendations for engagement.`;
  const result = await queryJtlData(question, tenantId);
  return result.answer;
}

// =============================================================================
// MCP SERVER
// =============================================================================

const TOOLS: Tool[] = [
  {
    name: 'query_jtl_data',
    description: 'Query JTL ERP data using natural language. Ask any question about orders, customers, products, inventory, shipping, etc.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        question: {
          type: 'string',
          description: 'Your question in natural language, e.g., "What were my top 5 customers last month?"',
        },
        tenant_id: {
          type: 'string',
          description: 'Optional tenant ID. Uses demo tenant if not provided.',
        },
      },
      required: ['question'],
    },
  },
  {
    name: 'analyze_sales',
    description: 'Get AI-powered sales analysis and trends for a specific time period.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        timeframe: {
          type: 'string',
          enum: ['today', 'yesterday', 'this_week', 'last_week', 'this_month', 'last_month', 'this_quarter', 'this_year'],
          description: 'Time period to analyze',
        },
        focus: {
          type: 'string',
          enum: ['revenue', 'orders', 'customers', 'products', 'all'],
          description: 'What aspect to focus on',
        },
        tenant_id: {
          type: 'string',
          description: 'Optional tenant ID',
        },
      },
      required: ['timeframe', 'focus'],
    },
  },
  {
    name: 'detect_fraud',
    description: 'AI-powered fraud detection on recent orders. Identifies suspicious patterns.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        lookback_days: {
          type: 'number',
          description: 'Number of days to analyze (default: 7)',
        },
        tenant_id: {
          type: 'string',
          description: 'Optional tenant ID',
        },
      },
    },
  },
  {
    name: 'predict_reorder',
    description: 'Smart inventory predictions. Find products that need restocking.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        urgency: {
          type: 'string',
          enum: ['critical', 'soon', 'all'],
          description: 'Filter by urgency level',
        },
        tenant_id: {
          type: 'string',
          description: 'Optional tenant ID',
        },
      },
    },
  },
  {
    name: 'customer_insights',
    description: 'AI analysis of customer behavior, lifetime value, and churn risk.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        segment: {
          type: 'string',
          enum: ['vip', 'at_risk', 'new', 'inactive', 'all'],
          description: 'Customer segment to analyze',
        },
        tenant_id: {
          type: 'string',
          description: 'Optional tenant ID',
        },
      },
    },
  },
];

const server = new Server(
  {
    name: 'jtl-analytics',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'query_jtl_data': {
        const result = await queryJtlData(
          args?.question as string,
          args?.tenant_id as string | undefined
        );
        return {
          content: [
            {
              type: 'text' as const,
              text: `${result.answer}\n\n---\n**GraphQL Query:**\n\`\`\`graphql\n${result.query}\n\`\`\``,
            },
          ],
        };
      }

      case 'analyze_sales': {
        const answer = await analyzeSales(
          args?.timeframe as string,
          args?.focus as string,
          args?.tenant_id as string | undefined
        );
        return { content: [{ type: 'text' as const, text: answer }] };
      }

      case 'detect_fraud': {
        const answer = await detectFraud(
          (args?.lookback_days as number) || 7,
          args?.tenant_id as string | undefined
        );
        return { content: [{ type: 'text' as const, text: answer }] };
      }

      case 'predict_reorder': {
        const answer = await predictReorder(
          (args?.urgency as string) || 'all',
          args?.tenant_id as string | undefined
        );
        return { content: [{ type: 'text' as const, text: answer }] };
      }

      case 'customer_insights': {
        const answer = await customerInsights(
          (args?.segment as string) || 'all',
          args?.tenant_id as string | undefined
        );
        return { content: [{ type: 'text' as const, text: answer }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('JTL Analytics MCP Server running on stdio');
}

main().catch(console.error);
