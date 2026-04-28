# JTL AI Analytics MCP Server
## Hackathon 2026 Presentation

---

# Slide 1: Title

## JTL AI Analytics MCP Server
### Intelligent E-Commerce Insights

**Team:** Mukit Khan
**Event:** JTL Hackathon 2026

---

# Slide 2: The Problem

## Challenges E-Commerce Merchants Face

- **Data Overload**: Too much data, not enough insights
- **Manual Analysis**: Hours spent on reports and spreadsheets
- **Fraud Risk**: Difficult to detect suspicious orders quickly
- **Stock Issues**: Stockouts and overstock problems
- **Customer Blindness**: No clear view of customer value

---

# Slide 3: Our Solution

## AI-Powered Analytics for JTL ERP

**One Platform. Real-Time Insights. Powered by AI.**

- Natural language queries - just ask questions
- Automatic fraud detection with AI scoring
- Smart reorder predictions
- Customer lifetime value analysis
- Real-time dashboards

---

# Slide 4: Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Dashboard │ │ Fraud    │ │ Report   │ │ Customer │  ...      │
│  │   View   │ │ Detector │ │  Agent   │ │   CLV    │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MCP AI SERVER (Node.js)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Natural Language → GraphQL                  │   │
│  │                   (GPT-4o-mini)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │  /query  │ │/ai-analyze│ │/detect-  │ │/predict- │           │
│  │          │ │          │ │  fraud   │ │ reorder  │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
└───────┼────────────┼────────────┼────────────┼──────────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    JTL ERP Cloud API                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  GraphQL Gateway                         │   │
│  │         https://api.jtl-cloud.com/erp/v2/graphql        │   │
│  └─────────────────────────────────────────────────────────┘   │
│     Orders │ Customers │ Products │ Invoices │ Inventory       │
└─────────────────────────────────────────────────────────────────┘
```

---

# Slide 5: Technology Stack

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + TypeScript + Vite |
| **UI Components** | JTL Platform UI React |
| **AI Server** | Node.js + Express |
| **AI Model** | Azure OpenAI (GPT-4o-mini) |
| **API** | JTL ERP Cloud GraphQL |
| **Auth** | OAuth 2.0 Client Credentials |
| **Protocol** | MCP (Model Context Protocol) |

---

# Slide 6: Key Features

## Feature 1: AI Report Agent

**Ask questions in plain English**

- "Show me top 10 customers by revenue"
- "Which products are low on stock?"
- "Analyze sales for July 2018"

**AI automatically:**
1. Converts to GraphQL query
2. Fetches real data from JTL ERP
3. Generates human-readable insights

---

# Slide 7: Key Features (continued)

## Feature 2: Fraud Detection

**Hybrid Approach: Rules + AI**

**Rule-Based Scoring:**
- High value orders (>500 EUR)
- Billing ≠ Shipping address
- Multiple orders same day
- Country mismatch

**AI Analysis:**
- Pattern recognition
- Anomaly detection
- Risk recommendations

---

# Slide 8: Key Features (continued)

## Feature 3: Customer Lifetime Value

**RFM Analysis (Recency, Frequency, Monetary)**

- **Recency**: How recently did they buy?
- **Frequency**: How often do they buy?
- **Monetary**: How much do they spend?

**Customer Segments:**
- VIP Customers
- Regular Customers
- New Customers
- At-Risk Customers

---

# Slide 9: Key Features (continued)

## Feature 4: Stock Alerts & Reorder Predictions

- Real-time stock level monitoring
- Automatic reorder quantity calculation
- Days of coverage prediction
- Critical/Low/OK/Overstock status
- Supplier recommendations

---

# Slide 10: MCP Integration

## Claude Desktop Integration

**Model Context Protocol (MCP)**

```json
{
  "mcpServers": {
    "jtl-analytics": {
      "command": "node",
      "args": [".../mcp-server/dist/index.js"],
      "env": {
        "OPENAI_API_KEY": "...",
        "CLIENT_ID": "...",
        "DEMO_TENANT_ID": "..."
      }
    }
  }
}
```

**Use Claude Desktop to query JTL ERP directly!**

---

# Slide 11: Data Flow

## How It Works

```
1. User asks: "Show me suspicious orders"
         │
         ▼
2. AI converts to GraphQL query
         │
         ▼
3. Fetch data from JTL ERP Cloud API
         │
         ▼
4. Apply fraud detection algorithms
         │
         ▼
5. AI generates insights & recommendations
         │
         ▼
6. Display results in beautiful UI
```

---

# Slide 12: Demo Screenshots

## Dashboard View
- Order statistics
- Revenue trends
- Top customers chart
- Recent orders table

## Fraud Detector
- Risk score visualization
- AI-powered analysis
- Per-order investigation

## Report Agent
- Natural language input
- Real-time results
- Export to CSV/PDF

---

# Slide 13: API Endpoints

## MCP Server Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /query` | Natural language → GraphQL |
| `POST /ai-analyze` | Direct AI analysis |
| `POST /detect-fraud` | Fraud detection |
| `POST /analyze-sales` | Sales analytics |
| `POST /analyze-customers` | Customer insights |
| `POST /predict-reorder` | Stock predictions |
| `GET /suggestions` | Query examples |
| `GET /schema` | GraphQL schema |

---

# Slide 14: Security

## Security & Authentication

- **OAuth 2.0** Client Credentials flow
- **JWT Bearer** tokens
- **X-Tenant-ID** header for multi-tenancy
- API keys stored in environment variables
- CORS enabled for frontend access

---

# Slide 15: Future Roadmap

## What's Next?

1. **Email Alerts** - Automated fraud notifications
2. **Predictive Analytics** - Sales forecasting
3. **Multi-language** - German, English, French
4. **Mobile App** - React Native version
5. **Webhook Integration** - Real-time events
6. **Custom Dashboards** - Drag & drop builder

---

# Slide 16: Demo

## Live Demo

**URL:** http://localhost:5004

1. Dashboard Overview
2. Report Agent - Ask a question
3. Fraud Detector - Analyze orders
4. Customer CLV - See segments
5. Stock Alerts - Check inventory

---

# Slide 17: Summary

## Key Takeaways

- **AI-Powered**: Natural language to insights
- **Real Data**: Connected to JTL ERP Cloud
- **Actionable**: Fraud detection, reorder alerts
- **Integrated**: MCP for Claude Desktop
- **Extensible**: Easy to add new features

---

# Slide 18: Thank You

## Questions?

**Mukit Khan**

- GitHub: mukit-jtl-app
- Tenant: Sportbedarf Sommer GmbH

**JTL Hackathon 2026**

---
