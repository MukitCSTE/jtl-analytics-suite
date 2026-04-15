# E-commerce Analytics Suite - Implementation Plan

## Overview
Build a comprehensive analytics app for JTL Cloud ERP with 8 feature modules accessible via a sidebar menu.

## App Structure

```
/analytics                 → Main dashboard with sidebar navigation
/analytics/dashboard       → Order Status Dashboard (default)
/analytics/fraud           → Order Fraud Detector
/analytics/reorder         → Smart Reorder Alerts
/analytics/clv             → Customer Lifetime Value
/analytics/shipping        → Shipping Optimizer
/analytics/returns         → Return Risk Predictor
/analytics/heatmap         → Sales Heatmap
/analytics/bundles         → Product Bundler
```

## Files Created/Modified

### Frontend (packages/frontend)

#### 1. Analytics Page Structure
```
src/pages/analytics-page/
├── AnalyticsPage.tsx          # Main layout with sidebar
├── IAnalyticsPageProps.ts     # Props interface
├── index.ts                   # Export
├── components/
│   ├── Sidebar.tsx            # Navigation sidebar
│   └── shared/                # Shared components
│       ├── StatCard.tsx       # Stats display card
│       ├── DataTable.tsx      # Reusable data table
│       └── index.ts           # Exports
└── views/
    ├── DashboardView.tsx      # Order Status Dashboard
    ├── FraudDetectorView.tsx  # Order Fraud Detector
    ├── ReorderAlertsView.tsx  # Smart Reorder Alerts
    ├── CustomerValueView.tsx  # Customer Lifetime Value
    ├── ShippingView.tsx       # Shipping Optimizer
    ├── ReturnRiskView.tsx     # Return Risk Predictor
    ├── SalesHeatmapView.tsx   # Sales Heatmap
    └── ProductBundlerView.tsx # Product Bundler
```

#### 2. Modified App.tsx
- Added 'analytics' to AppMode type
- Added route case for AnalyticsPage
- Smart pathname parsing for /analytics/* routes

#### 3. Updated pages/index.ts
- Export AnalyticsPage

### Manifest (packages/frontend/manifest.json)

#### Updated Menu Items
```json
{
  "id": "analytics",
  "name": "Analytics Suite",
  "url": "http://localhost:50144/analytics",
  "children": [
    { "id": "analytics_dashboard", "name": "Dashboard", "url": ".../analytics/dashboard" },
    { "id": "analytics_fraud", "name": "Fraud Detector", "url": ".../analytics/fraud" },
    { "id": "analytics_reorder", "name": "Reorder Alerts", "url": ".../analytics/reorder" },
    { "id": "analytics_clv", "name": "Customer Value", "url": ".../analytics/clv" },
    { "id": "analytics_shipping", "name": "Shipping", "url": ".../analytics/shipping" },
    { "id": "analytics_returns", "name": "Return Risk", "url": ".../analytics/returns" },
    { "id": "analytics_heatmap", "name": "Sales Heatmap", "url": ".../analytics/heatmap" },
    { "id": "analytics_bundles", "name": "Product Bundles", "url": ".../analytics/bundles" }
  ]
}
```

## GraphQL Queries Used

### Dashboard - Recent orders & stats
```graphql
query DashboardData {
  QuerySalesOrders(first: 50, order: [{ salesOrderDate: DESC }]) {
    totalCount
    nodes {
      salesOrderNumber, salesOrderDate, totalGrossAmount,
      currencyIso, companyName, customerNumber
    }
  }
}
```

### Fraud Detection - Orders with flags
```graphql
query FraudAnalysis {
  QuerySalesOrders(first: 100) {
    nodes {
      salesOrderNumber, totalGrossAmount, companyName,
      shippingAddress { city, country }
      billingAddress { city, country }
      lineItems { quantity, unitPriceGross }
    }
  }
}
```

### Reorder Alerts - Stock levels
```graphql
query StockAnalysis {
  QueryItems(first: 100) {
    nodes {
      sku, name, stockTotal, stockAvailable, stockInOrders
    }
  }
}
```

### Customer Value - Order history per customer
```graphql
query CustomerAnalysis {
  QuerySalesOrders(first: 500) {
    nodes {
      customerNumber, companyName, totalGrossAmount, salesOrderDate
    }
  }
}
```

### Sales Heatmap - Orders by date/time
```graphql
query SalesTimeline {
  QuerySalesOrders(first: 500, order: [{ salesOrderDate: DESC }]) {
    nodes {
      salesOrderDate, totalGrossAmount
    }
  }
}
```

## Feature Details

### 1. Dashboard View
- Today's orders count and revenue
- Total orders count
- Average order value
- Recent orders table

### 2. Fraud Detector
- Risk scoring based on:
  - High order value (>5000 EUR)
  - Address mismatches (shipping vs billing)
  - High quantity items
  - Many line items
- Risk levels: low, medium, high

### 3. Reorder Alerts
- Stock status: critical, low, ok
- Days of stock calculation based on order velocity
- Reorder recommendations

### 4. Customer Lifetime Value
- Customer segmentation: VIP, regular, new
- CLV scoring based on recency, frequency, monetary
- Rankings and tiers

### 5. Shipping Optimizer
- Delivery estimates by country
- Shipping cost estimates
- Location aggregation

### 6. Return Risk Predictor
- Risk factors: high value, multiple items, first-time customer
- Weekend order detection
- Risk scoring

### 7. Sales Heatmap
- Visual grid by day and hour
- Peak detection
- Daily summaries

### 8. Product Bundler
- Co-occurrence analysis
- Confidence scoring
- Bundle value calculation

## UI Components Used
From `@jtl-software/platform-ui-react`:
- Card, CardHeader, CardTitle, CardContent
- Stack, Box, Text, Badge, Button
- Separator

Icons from `lucide-react`:
- AlertTriangle (fraud), Package (reorder), Users (CLV)
- Truck (shipping), RotateCcw (returns), Calendar (heatmap)
- ShoppingBag (bundles), LayoutDashboard (dashboard)

## Verification Steps
1. Start backend: `cd packages/backend && npm run dev`
2. Start frontend: `cd packages/frontend && npm run dev`
3. Open http://localhost:50144/analytics
4. Verify sidebar navigation works
5. Test each view loads data from GraphQL
6. Install app in JTL Platform Hub to test full flow

## Key Patterns Followed
- GraphQL client pattern from GraphqlDemoPage.tsx
- JTL UI component patterns from SetupPage.tsx
- Session token flow via appBridge.method.call('getSessionToken')
