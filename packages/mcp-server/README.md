# JTL Analytics AI - MCP Server

Natural language analytics for JTL ERP. Ask questions about your business data and get instant AI-powered insights.

## Features

- **Natural Language Queries**: Ask questions like "What are my sales today?" or "Which products need restocking?"
- **AI-Powered Analysis**: Automatic GraphQL generation and response formatting
- **Multiple Tools**: Sales analysis, fraud detection, inventory predictions, customer insights
- **Dual Interface**: Works with Claude Code (MCP) and web UI (HTTP)

## Quick Start

### 1. Install Dependencies

```bash
cd packages/mcp-server
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```env
# Azure OpenAI Gateway
OPENAI_API_URL=https://apim-ai-hub-jtlpltf-beta.azure-api.net/openai/v1
OPENAI_API_KEY=your-api-key
OPENAI_MODEL=gpt-4o-mini

# JTL Platform API
CLIENT_ID=your-jtl-client-id
CLIENT_SECRET=your-jtl-client-secret
DEMO_TENANT_ID=your-tenant-id
```

### 3. Build

```bash
npm run build
```

## Usage

### With Claude Code (MCP Protocol)

Add to your Claude Code settings (`~/.claude/settings.json`):

```json
{
  "mcpServers": {
    "jtl-analytics": {
      "command": "node",
      "args": ["/path/to/mcp-server/dist/index.js"],
      "env": {
        "OPENAI_API_URL": "https://apim-ai-hub-jtlpltf-beta.azure-api.net/openai/v1",
        "OPENAI_API_KEY": "your-api-key",
        "CLIENT_ID": "your-jtl-client-id",
        "CLIENT_SECRET": "your-jtl-client-secret",
        "DEMO_TENANT_ID": "your-tenant-id"
      }
    }
  }
}
```

Then in Claude Code, ask:
- "Use query_jtl_data to show my recent orders"
- "Use analyze_sales to check this month's revenue"
- "Use detect_fraud to scan for suspicious orders"

### With Web UI (HTTP Server)

Start the HTTP server:

```bash
npm run start:http
```

Server runs on `http://localhost:3006` with these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/query` | POST | Natural language query |
| `/analyze-sales` | POST | Sales analysis |
| `/detect-fraud` | POST | Fraud detection |
| `/predict-reorder` | POST | Inventory predictions |
| `/customer-insights` | POST | Customer analysis |
| `/suggestions` | GET | Query suggestions |

Example request:
```bash
curl -X POST http://localhost:3006/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What were my top 5 customers last month?"}'
```

## Available Tools

### query_jtl_data
Ask any question in natural language.

```
"Which customers ordered more than 500€ this week?"
"What's my best selling product?"
"Show orders pending shipment"
```

### analyze_sales
Get AI-powered sales analysis.

Parameters:
- `timeframe`: today, yesterday, this_week, last_week, this_month, last_month, this_quarter, this_year
- `focus`: revenue, orders, customers, products, all

### detect_fraud
Scan for suspicious orders.

Parameters:
- `lookback_days`: Number of days to analyze (default: 7)

### predict_reorder
Get inventory restock recommendations.

Parameters:
- `urgency`: critical, soon, all

### customer_insights
Analyze customer segments.

Parameters:
- `segment`: vip, at_risk, new, inactive, all

## Architecture

```
┌─────────────────────┐     ┌─────────────────────┐
│    Claude Code      │     │      Web UI         │
│    (MCP Client)     │     │   (React App)       │
└─────────┬───────────┘     └──────────┬──────────┘
          │ stdio                      │ HTTP
          ▼                            ▼
┌─────────────────────┐     ┌─────────────────────┐
│    MCP Server       │     │    HTTP Server      │
│    (index.ts)       │     │  (http-server.ts)   │
└─────────┬───────────┘     └──────────┬──────────┘
          │                            │
          └──────────┬─────────────────┘
                     ▼
          ┌─────────────────────┐
          │   Shared Services   │
          │  - OpenAI Client    │
          │  - GraphQL Client   │
          │  - JTL Auth         │
          └─────────┬───────────┘
                    │
       ┌────────────┴────────────┐
       ▼                         ▼
┌─────────────┐          ┌─────────────┐
│ Azure OpenAI│          │  JTL ERP    │
│   Gateway   │          │  GraphQL    │
└─────────────┘          └─────────────┘
```

## Development

```bash
# Watch mode (MCP)
npm run dev

# Watch mode (HTTP)
npm run start:http

# Build
npm run build
```

## License

MIT
