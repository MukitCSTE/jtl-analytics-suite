/**
 * JTL Analytics AI HTTP Server
 *
 * HTTP API wrapper for the MCP tools.
 * Your frontend UI connects to this server.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.MCP_HTTP_PORT || 3006;

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
    expires: Date.now() + (data.expires_in - 60) * 1000,
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
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${error}`);
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
- Key insights highlighted
- Bullet points for lists
- German number format (1.234,56 EUR)
- Dates as DD.MM.YYYY
- Actionable recommendations
- Be concise but thorough
`;

// =============================================================================
// TOOL IMPLEMENTATIONS
// =============================================================================

async function queryJtlData(
  question: string,
  tenantId?: string
): Promise<{ answer: string; query: string; data: any }> {
  // Generate GraphQL
  const graphqlQuery = await callOpenAI([
    { role: 'system', content: GRAPHQL_SCHEMA },
    { role: 'user', content: question },
  ]);

  const cleanQuery = graphqlQuery.replace(/```graphql?/gi, '').replace(/```/g, '').trim();

  // Execute query
  const result = await executeGraphQL(cleanQuery, tenantId);

  if (result.errors) {
    return {
      answer: `I couldn't process that query. Error: ${result.errors[0]?.message}. Try rephrasing your question.`,
      query: cleanQuery,
      data: null,
    };
  }

  // Format response
  const answer = await callOpenAI([
    { role: 'system', content: RESPONSE_FORMAT },
    {
      role: 'user',
      content: `Question: ${question}\n\nData:\n${JSON.stringify(result.data, null, 2)}\n\nProvide a helpful, concise answer.`,
    },
  ]);

  return { answer, query: cleanQuery, data: result.data };
}

// =============================================================================
// HTTP ENDPOINTS
// =============================================================================

// Health check
app.get('/', (req, res) => {
  res.json({
    service: 'JTL Analytics AI Server',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'POST /query - Natural language query',
      'POST /analyze-sales - Sales analysis',
      'POST /detect-fraud - Fraud detection',
      'POST /predict-reorder - Inventory predictions',
      'POST /customer-insights - Customer analysis',
      'GET /suggestions - Query suggestions',
    ],
  });
});

// Main query endpoint
app.post('/query', async (req, res) => {
  try {
    const { question, tenantId } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Missing question' });
    }

    console.log(`[Query] ${question}`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({
      error: 'Query failed',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Sales analysis
app.post('/analyze-sales', async (req, res) => {
  try {
    const { timeframe = 'this_month', focus = 'all', tenantId } = req.body;
    const question = `Analyze ${focus} for ${timeframe}. Show trends, totals, comparisons, and key insights.`;

    console.log(`[Analyze Sales] ${timeframe} - ${focus}`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Fraud detection
app.post('/detect-fraud', async (req, res) => {
  try {
    const { lookbackDays = 7, tenantId } = req.body;
    const question = `Find potentially fraudulent or suspicious orders from the last ${lookbackDays} days.
      Look for: high-value orders from new customers, billing/shipping address mismatches,
      unusual patterns, weekend/late-night orders. Flag concerning orders with risk levels.`;

    console.log(`[Fraud Detection] Last ${lookbackDays} days`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Fraud detection error:', error);
    res.status(500).json({ error: 'Fraud detection failed' });
  }
});

// Reorder predictions
app.post('/predict-reorder', async (req, res) => {
  try {
    const { urgency = 'all', tenantId } = req.body;
    const question = `Show products that need reordering. Focus on ${urgency} priority items.
      Check stock levels vs minimum stock, items with high order volume but low availability.
      Recommend order quantities.`;

    console.log(`[Reorder] Urgency: ${urgency}`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ error: 'Reorder prediction failed' });
  }
});

// Customer insights
app.post('/customer-insights', async (req, res) => {
  try {
    const { segment = 'all', tenantId } = req.body;
    const question = `Analyze ${segment} customers. Show their order patterns, total spend,
      frequency, average order value, and recommendations for engagement or retention.`;

    console.log(`[Customer Insights] Segment: ${segment}`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Customer insights error:', error);
    res.status(500).json({ error: 'Customer analysis failed' });
  }
});

// Quick suggestions for UI
app.get('/suggestions', (req, res) => {
  res.json({
    suggestions: [
      { icon: '📊', text: "How are sales today compared to yesterday?" },
      { icon: '🚨', text: "Are there any suspicious orders I should check?" },
      { icon: '📦', text: "Which products need restocking?" },
      { icon: '👑', text: "Who are my top 5 customers this month?" },
      { icon: '🚚', text: "How many orders are pending shipment?" },
      { icon: '💰', text: "What's my average order value this week?" },
      { icon: '📈', text: "Show me sales trends for the last 30 days" },
      { icon: '⚠️', text: "Which customers haven't ordered in 60 days?" },
      { icon: '🎯', text: "What's my best selling product?" },
      { icon: '🌍', text: "Which countries generate the most revenue?" },
    ],
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`JTL Analytics AI Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /query          - Natural language query');
  console.log('  POST /analyze-sales  - Sales analysis');
  console.log('  POST /detect-fraud   - Fraud detection');
  console.log('  POST /predict-reorder - Inventory predictions');
  console.log('  POST /customer-insights - Customer analysis');
  console.log('  GET  /suggestions    - Query suggestions');
});
