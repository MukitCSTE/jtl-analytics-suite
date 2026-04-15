# JTL Analytics Suite - Presentation

## Opening (30 seconds)

> "I built an AI-powered analytics suite for JTL Cloud ERP that transforms raw e-commerce data into actionable insights. It combines real-time dashboards, predictive analytics, and natural language AI - all in one application."

---

## Key Features Overview

### 1. AI Assistant ⭐ NEW
- Chat interface to ask questions in plain language
- "Show me today's sales" → AI generates GraphQL, fetches data, explains results
- No SQL or coding knowledge needed
- Quick suggestion buttons for common queries

### 2. Report Agent ⭐ NEW
- Conversational report wizard - just describe what you need
- Choose delivery: Download (CSV/JSON) or Email
- **Voice support** - speak your request, hear the response
- Multi-step workflow: Query → Review → Format → Download

### 3. Dashboard
- KPIs at a glance: Today's orders, revenue, average order value
- Weekly revenue trends (line chart)
- Monthly order breakdown (bar chart)
- Top customers visualization
- Recent orders table

### 4. Fraud Detector
- AI scoring system (0-100% risk)
- Detects: Address mismatches, high-value orders, first-time buyers, unusual timing
- Color-coded alerts: Red (high), Orange (medium), Green (low)
- Expandable help panel explaining how scoring works

### 5. Reorder Alerts
- Inventory health monitoring
- Stock status: Critical, Low, OK, Overstock
- Days of coverage calculations
- Automatic reorder quantity suggestions
- Stock value in EUR

### 6. Customer Lifetime Value (CLV)
- RFM analysis (Recency, Frequency, Monetary)
- Customer tiers: VIP, Regular, New
- Identifies at-risk customers (no order in 90+ days)
- Revenue breakdown by segment

### 7. Shipping & Fulfillment
- Pipeline visibility: Pending → Shipped → Delivered
- Destination tracking by country
- Shipping method distribution
- Delivery timing analysis

### 8. Return Risk Predictor
- Predicts which orders might be returned
- Risk factors: High-value, first-time, impulse buys
- Helps prepare customer service

### 9. Sales Heatmap
- 7-day × 24-hour grid visualization
- Shows when customers buy most
- Identifies peak sales hours
- Helps optimize marketing timing

### 10. Tax Analytics
- VAT breakdown by country (29 EU countries)
- Compliance warnings for OSS registration
- Export to CSV for accountants
- Total tax collected metrics

### 11. FAQ & Setup
- MCP server configuration guide
- Copy-paste ready config for Claude Code/Desktop

---

## Technical Highlights

### Architecture
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js/Express on port 3005
- **MCP Server:** Claude-compatible AI integration
- **Data:** Real-time GraphQL queries to JTL ERP API

### AI Integration
- OpenAI GPT-4 for natural language understanding
- Automatic GraphQL generation from questions
- German locale formatting (1.234,56 EUR)

### MCP Server Tools (for Claude Code/Desktop)
1. `query_jtl_data` - Ask anything
2. `analyze_sales` - Sales analysis
3. `detect_fraud` - Fraud detection
4. `predict_reorder` - Inventory predictions
5. `customer_insights` - Customer segmentation

---

## Closing (15 seconds)

> "This suite turns complex ERP data into instant insights - whether through dashboards, AI chat, or voice. It's built for e-commerce teams who want to detect fraud, manage inventory, understand customers, and make data-driven decisions without technical expertise."

---

## Demo Flow (if showing live)

1. Start with **AI Assistant** - ask "What were today's sales?"
2. Show **Dashboard** - highlight KPIs and charts
3. Open **Fraud Detector** - show risk scoring
4. Check **Reorder Alerts** - show critical stock items
5. View **Sales Heatmap** - identify peak hours
6. End with **Report Agent** - generate and download a report

---

## Feature Summary Table

| Feature | Category | Key Benefit |
|---------|----------|-------------|
| AI Assistant | AI/Chat | Natural language data queries |
| Report Agent | AI/Reports | Voice-enabled report generation |
| Dashboard | Analytics | Real-time KPIs and charts |
| Fraud Detector | Security | Risk scoring for orders |
| Reorder Alerts | Inventory | Stock management automation |
| Customer Value | CRM | Customer segmentation |
| Fulfillment | Operations | Shipping pipeline visibility |
| Return Risk | Predictive | Return probability scoring |
| Sales Heatmap | Analytics | Peak time identification |
| Tax Analytics | Compliance | Multi-country VAT tracking |
| FAQ & Setup | Documentation | MCP configuration guide |

---

*Built with React, TypeScript, Node.js, GraphQL, and OpenAI*
