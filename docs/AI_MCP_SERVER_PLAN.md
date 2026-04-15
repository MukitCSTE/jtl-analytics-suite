# AI-Powered JTL Analytics Assistant - MCP Server Plan

## The Vision: "Talk to Your ERP"

Instead of clicking through dashboards, users simply ask questions in natural language:

```
User: "Which customers haven't ordered in 3 months but spent over 1000€ last year?"
AI: "I found 12 at-risk VIP customers. Here are the top 5..."

User: "What's my best selling day this month?"
AI: "Tuesday the 8th with 47 orders totaling 12,450€..."

User: "Show me suspicious orders from new customers"
AI: "I detected 3 orders with fraud indicators..."
```

## Why This Wins Competitions

1. **Innovation**: First AI-powered analytics for JTL ecosystem
2. **Accessibility**: Non-technical users can query complex data
3. **Speed**: Instant insights without building dashboards
4. **Differentiation**: No competitor has this capability

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ Claude Code  │  │  Chat Widget │  │  Analytics Dashboard │   │
│  │   (MCP)      │  │  (Frontend)  │  │    (React App)       │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
└─────────┼─────────────────┼─────────────────────┼───────────────┘
          │                 │                     │
          ▼                 ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AI Gateway (Express Backend)                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    /ai/query endpoint                    │    │
│  │  1. Receive natural language question                   │    │
│  │  2. Call OpenAI to generate GraphQL query               │    │
│  │  3. Execute GraphQL against JTL API                     │    │
│  │  4. Call OpenAI to format response in natural language  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│  ┌───────────────┐  ┌───────┴───────┐  ┌───────────────────┐    │
│  │ Query Builder │  │ GraphQL Proxy │  │ Response Formatter│    │
│  │   (OpenAI)    │  │  (JTL API)    │  │     (OpenAI)      │    │
│  └───────────────┘  └───────────────┘  └───────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MCP Server (Standalone)                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Tools exposed to Claude Code / AI assistants:           │    │
│  │                                                          │    │
│  │ • query_jtl_data    - Natural language → GraphQL → Data │    │
│  │ • analyze_sales     - Sales analysis with AI insights   │    │
│  │ • detect_fraud      - AI-powered fraud detection        │    │
│  │ • predict_reorder   - Smart inventory predictions       │    │
│  │ • customer_insights - CLV and churn analysis            │    │
│  │ • generate_report   - Create PDF/Excel reports          │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## MCP Server Tools

### 1. `query_jtl_data` - Universal Query Tool
```typescript
{
  name: "query_jtl_data",
  description: "Query JTL ERP data using natural language",
  inputSchema: {
    type: "object",
    properties: {
      question: {
        type: "string",
        description: "Natural language question about your business data"
      },
      format: {
        type: "string",
        enum: ["summary", "detailed", "table", "chart_data"],
        description: "How to format the response"
      }
    },
    required: ["question"]
  }
}
```

**Example queries:**
- "What's my revenue this week vs last week?"
- "List top 10 customers by order count"
- "Which products are running low on stock?"
- "Show orders pending shipment over 3 days"

### 2. `analyze_sales` - Sales Intelligence
```typescript
{
  name: "analyze_sales",
  description: "Get AI-powered sales analysis and trends",
  inputSchema: {
    type: "object",
    properties: {
      timeframe: { type: "string", enum: ["today", "week", "month", "quarter", "year"] },
      focus: { type: "string", enum: ["revenue", "orders", "customers", "products"] },
      compare: { type: "boolean", description: "Compare to previous period" }
    }
  }
}
```

### 3. `detect_fraud` - Fraud Detection
```typescript
{
  name: "detect_fraud",
  description: "AI-powered fraud detection on recent orders",
  inputSchema: {
    type: "object",
    properties: {
      lookback_days: { type: "number", default: 7 },
      sensitivity: { type: "string", enum: ["low", "medium", "high"] }
    }
  }
}
```

### 4. `predict_reorder` - Smart Inventory
```typescript
{
  name: "predict_reorder",
  description: "AI predictions for inventory reordering",
  inputSchema: {
    type: "object",
    properties: {
      category: { type: "string", description: "Product category to analyze" },
      urgency: { type: "string", enum: ["critical", "soon", "all"] }
    }
  }
}
```

### 5. `customer_insights` - Customer Intelligence
```typescript
{
  name: "customer_insights",
  description: "AI analysis of customer behavior and value",
  inputSchema: {
    type: "object",
    properties: {
      segment: { type: "string", enum: ["vip", "at_risk", "new", "churned", "all"] },
      insight_type: { type: "string", enum: ["clv", "churn_risk", "upsell", "summary"] }
    }
  }
}
```

### 6. `generate_report` - Report Builder
```typescript
{
  name: "generate_report",
  description: "Generate business reports with AI summaries",
  inputSchema: {
    type: "object",
    properties: {
      report_type: { type: "string", enum: ["daily", "weekly", "monthly", "custom"] },
      sections: {
        type: "array",
        items: { type: "string", enum: ["sales", "inventory", "customers", "fraud", "shipping"] }
      },
      format: { type: "string", enum: ["markdown", "html", "pdf_data"] }
    }
  }
}
```

---

## Implementation Files

```
packages/
├── mcp-server/                      # NEW: MCP Server package
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts                 # MCP server entry point
│   │   ├── tools/
│   │   │   ├── queryJtlData.ts      # Natural language query tool
│   │   │   ├── analyzeSales.ts      # Sales analysis tool
│   │   │   ├── detectFraud.ts       # Fraud detection tool
│   │   │   ├── predictReorder.ts    # Inventory predictions
│   │   │   ├── customerInsights.ts  # Customer analysis
│   │   │   └── generateReport.ts    # Report generator
│   │   ├── services/
│   │   │   ├── openai.ts            # OpenAI gateway client
│   │   │   ├── graphql.ts           # JTL GraphQL client
│   │   │   └── prompts.ts           # System prompts for AI
│   │   └── schemas/
│   │       └── jtlSchema.ts         # GraphQL schema for context
│   └── README.md
│
├── backend/
│   └── src/
│       └── index.ts                 # Add /ai/query endpoint
│
└── frontend/
    └── src/
        └── pages/
            └── ai-assistant-page/   # NEW: Chat UI for AI queries
                ├── AiAssistantPage.tsx
                └── components/
                    ├── ChatInterface.tsx
                    └── QuerySuggestions.tsx
```

---

## OpenAI Integration

### System Prompt for Query Generation
```
You are a JTL ERP GraphQL expert. Convert natural language questions into GraphQL queries.

Available types:
- QuerySalesOrders: salesOrderNumber, salesOrderDate, totalGrossAmount, currencyIso,
  companyName, customerNumber, billingAddressCity, billingAddressCountryIso,
  shipmentAddressCity, shipmentAddressCountryIso, deliveryStatus, paymentStatus,
  shippingMethodName, isPending, isCancelled, lastShippingDate

- QueryItems: sku, name, stockTotal, stockAvailable, stockInOrders, stockIncoming,
  minimumStock, hasMinimumStock, salesPriceGross, defaultSupplier

Rules:
1. Always use pagination (first: N)
2. Use appropriate filters and ordering
3. Only query fields that exist
4. Return valid GraphQL syntax
```

### Example Flow
```
User: "Which German customers ordered over 500€ this week?"

AI generates:
query {
  QuerySalesOrders(
    first: 50,
    where: {
      and: [
        { totalGrossAmount: { gte: 500 } },
        { billingAddressCountryIso: { eq: "DE" } },
        { salesOrderDate: { gte: "2026-04-08" } }
      ]
    },
    order: [{ totalGrossAmount: DESC }]
  ) {
    nodes {
      salesOrderNumber
      companyName
      totalGrossAmount
      billingAddressCity
      salesOrderDate
    }
  }
}
```

---

## Frontend Chat UI

### Features
- **Chat Interface**: Message-style conversation with AI
- **Quick Queries**: One-click common questions
- **Data Visualization**: Auto-generate charts from responses
- **Export**: Download results as CSV/PDF
- **History**: Save and replay previous queries

### Quick Query Suggestions
```typescript
const suggestions = [
  "📊 How are sales today compared to yesterday?",
  "🚨 Any suspicious orders I should check?",
  "📦 Which products need restocking?",
  "👑 Who are my top 5 customers this month?",
  "🚚 How many orders are pending shipment?",
  "💰 What's my average order value this week?",
  "📈 Show me the sales trend for the last 30 days",
  "⚠️ Which customers haven't ordered in 60 days?",
];
```

---

## Competitive Advantages

| Feature | Traditional Dashboards | AI Analytics Assistant |
|---------|----------------------|------------------------|
| Learning curve | Hours to learn UI | Zero - just ask |
| Custom queries | Build new dashboard | Ask any question |
| Speed to insight | Minutes of clicking | Seconds of typing |
| Non-technical users | Need training | Natural conversation |
| Ad-hoc analysis | Limited to pre-built | Unlimited flexibility |
| Multi-language | UI language only | Any language |

---

## Phase 1 Implementation (MVP)

### Backend: `/ai/query` endpoint
```typescript
app.post('/ai/query', async (req, res) => {
  const { question, tenantId, sessionToken } = req.body;

  // 1. Generate GraphQL from question
  const graphqlQuery = await openai.chat({
    messages: [
      { role: 'system', content: GRAPHQL_SYSTEM_PROMPT },
      { role: 'user', content: question }
    ]
  });

  // 2. Execute GraphQL
  const data = await executeGraphQL(tenantId, sessionToken, graphqlQuery);

  // 3. Generate natural language response
  const response = await openai.chat({
    messages: [
      { role: 'system', content: 'Format this data as a helpful response' },
      { role: 'user', content: JSON.stringify({ question, data }) }
    ]
  });

  return res.json({
    answer: response,
    data,
    query: graphqlQuery // for transparency
  });
});
```

### MCP Server: Basic tools
```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

const server = new Server({
  name: 'jtl-analytics',
  version: '1.0.0',
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case 'query_jtl_data':
      return await handleQuery(request.params.arguments);
    // ... other tools
  }
});
```

---

## What I Need From You

1. **OpenAI Gateway URL** - Your gateway endpoint
2. **API Key** (or how to authenticate)
3. **Any specific model preference** (GPT-4o, etc.)

Once you provide these, I can start building the MCP server immediately!

---

## Demo Script (For Competition)

```
"Watch this. Instead of building dashboards, we just ask..."

[Types]: "Hey, which customers ordered more than 3 times last month
          but haven't ordered this month yet?"

[AI responds]: "I found 8 customers matching your criteria:
               1. Tech Solutions GmbH - 5 orders in March, €2,340 total
               2. Digital Factory AG - 4 orders in March, €1,890 total
               ...

               These are potentially churning customers. Would you like me
               to analyze their order patterns or suggest re-engagement strategies?"

[Types]: "Yes, suggest how to re-engage them"

[AI responds]: "Based on their purchase history, here's a personalized strategy..."
```

**This is the future of ERP analytics.**
