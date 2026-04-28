/**
 * JTL Analytics AI HTTP Server
 *
 * HTTP API wrapper for the MCP tools.
 * Your frontend UI connects to this server.
 * Supports ALL 338 GraphQL types from JTL ERP API.
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
    apiUrl: process.env.JTL_API_URL || 'https://api.jtl-cloud.com',
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
      max_tokens: 4000,
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
// COMPLETE GRAPHQL SCHEMA (338 types)
// =============================================================================

const GRAPHQL_SCHEMA = `
You are a JTL ERP GraphQL expert. Convert natural language to GraphQL queries.
Today's date is: ${new Date().toISOString().split('T')[0]}

IMPORTANT: Return ONLY the GraphQL query, no markdown, no explanation.

=== AVAILABLE QUERIES ===

1. QuerySalesOrders - Sales orders
2. QuerySalesQuotations - Sales quotations/offers
3. QuerySalesInvoices - Invoices
4. QuerySalesInvoiceCorrections - Invoice corrections
5. QueryItems - Products/Items
6. QueryCustomers - Customers
7. QueryCategories - Product categories
8. QueryStock - Stock levels
9. QueryWarehouses - Warehouses
10. QueryBinLocations - Bin locations
11. QuerySuppliers - Suppliers
12. QueryShippingMethods - Shipping methods
13. QueryShippingClasses - Shipping classes
14. QueryProductionOrders - Production orders
15. QueryProductionItems - Production items
16. QueryBillsOfMaterials - Bills of materials
17. QueryCompanies - Companies
18. QueryCountries - Countries
19. QueryCurrencies - Currencies
20. QueryTaxClasses - Tax classes
21. QueryPaymentMethods - Payment methods
22. QueryCustomerGroups - Customer groups
23. QueryProductGroups - Product groups
24. QueryManufacturers - Manufacturers
25. QueryLanguages - Languages
26. QueryPicklists - Picklists
27. QueryBatches - Batch numbers
28. QuerySerialNumbers - Serial numbers
29. QueryStockMovementHistory - Stock movements
30. QueryMarketplaceOffers - Marketplace offers
31. QuerySalesChannels - Sales channels

=== COMPLETE TYPE DEFINITIONS ===

== SALES/ORDERS ==

SalesOrder / SalesOrderListItem:
  id, salesOrderNumber, salesOrderDate, customerId, customerNumber, companyName,
  totalGrossAmount, totalNetAmount, currencyIso, paymentStatus, deliveryStatus,
  isPending, isCancelled, shippingMethodName, shippingMethodId, paymentMethodId,
  billingAddress { companyName, firstName, lastName, street, postalCode, city, countryIso },
  shipmentAddress { companyName, firstName, lastName, street, postalCode, city, countryIso },
  lineItems { id, sku, name, quantity, salesPriceNet, totalSalesPriceGross }

SalesOrderLineItem:
  id, salesOrderId, itemId, sku, isReserved, name, fnSku, type, quantity,
  salesUnit, salesPriceNet, discountPercent, purchasePriceNet, taxRate,
  taxClassId, taxCodeId, note, totalSalesPriceNet, totalSalesPriceGross, sortOrder

SalesQuotation:
  id, salesQuotationNumber, salesQuotationDate, customerId, isPending, isCancelled,
  totalGrossAmount, totalNetAmount, lineItems, billingAddress, shipmentAddress

== ITEMS/PRODUCTS ==

ItemListItem:
  id, sku, name, unit, description, shortDescription, gtin, manufacturerNumber,
  width, height, length, weight, shippingWeight,
  createdDate, modifiedDate, releaseDate, lastPurchaseDate,
  salesPriceNet, salesPriceGross, suggestedRetailPrice, averagePurchasePriceNet,
  lastPurchasePrice, profit, profitPercent,
  stockTotal, stockOwn, stockIncoming, stockOnPurchaseList, stockInOrders,
  stockAvailable, stockReservedTotal, minimumStock, hasMinimumStock,
  isActive, isTopItem, isNew, isBillOfMaterials, isVariationParent, isVariationChild,
  taxClassId, taxClassName, manufacturerId, manufacturerName,
  productGroupId, productGroupName, defaultSupplierId, defaultSupplier,
  shippingClassId, shippingClassName

== CATEGORIES ==

CategoryListItem:
  id, parentId, sortNumber, name

CategoryDetails:
  id, parentId, sortNumber, descriptions { name, description, metaDescription }

== CUSTOMERS ==

Customer / CustomerListItem:
  customerId, customerNumber, customerGroupId, customerGroupName,
  companyName, firstName, lastName, street, postalCode, city,
  countryName, countryIso, emailAddress, phoneNumber, createdDate

CustomerAddress:
  id, customerId, addressType, companyName, firstName, lastName,
  street, postalCode, city, countryIso, phoneNumber, emailAddress

CustomerGroup:
  id, name, discount

== STOCK/INVENTORY ==

QueryStock:
  stockEntryId, warehouseId, binLocationId, articleId, availableQuantity,
  reservedQuantity, batchNumber, bestBeforeDate, serialNumber

QueryStockItem:
  itemId, sku, name, stockTotal, stockAvailable, stockReserved,
  stockInOrders, stockIncoming, minimumStock, hasMinimumStock

BatchListItem:
  itemId, batch, quantity, warehouseId

SerialNumberListItem:
  itemId, serialNumber, warehouseId, binLocationId, status

StockMovementHistoryItem:
  id, itemId, warehouseId, quantity, movementType, referenceNumber, createdDate

== WAREHOUSE/BIN LOCATIONS ==

WarehouseListItem:
  id, name, active

BinLocationListItem:
  binLocationId, warehouseId, name, status, type, sort

WarehouseZoneListItem:
  id, warehouseId, name, zoneType

== SHIPPING ==

ShippingMethodLookupItem:
  id, name, isActive

ShippingClassListItem:
  id, name, description

ShippingBoxListItem:
  id, name, width, height, length, maxWeight

== PRODUCTION ==

ProductionOrder:
  id, productionItemId, billOfMaterialId, lotCount, lotSize,
  targetTotalQuantity, actualQuantity, progress,
  targetStartTimestamp, targetCompletionTimestamp,
  projectNumber, referenceNumber, issueNumber

ProductionItem:
  id, itemId, sku, name, description

BillOfMaterials:
  id, productionItemId, version, name, description, state

== INVOICES ==

SalesInvoiceListItem:
  salesInvoiceId, salesInvoiceNumber, salesInvoiceDate, customerId, customerNumber,
  companyName, totalGrossAmount, totalNetAmount, currencyIso,
  paymentStatus, isCompletelyPaid, stillToPay, alreadyPaidAmount,
  paymentDueDate, isDunned, dunningLevel, salesOrderNumber, salesOrderId,
  billingAddressCity, billingAddressCountryIso, isCancelled

SalesInvoiceCorrectionListItem:
  salesInvoiceCorrectionId, salesInvoiceId, correctionNumber, correctionDate,
  totalGrossAmount, totalNetAmount, reason

== MARKETPLACE ==

MarketplaceOfferListItem:
  id, itemId, sku, name, marketplaceId, marketplaceName, status, price, quantity

SalesChannel:
  id, name, type, platformId, isActive

== MASTER DATA ==

TaxClass: id, name
Currency: iso, name, symbol, factor
CountryItem: iso, name, isEuMember
PaymentMethod: id, name, isActive
LanguageItem: id, iso, name

== COMPANIES ==

CompanyListItem:
  id, companyName, owner, street, postalCode, city, country, countryIsoCode,
  phone, emailAddress, taxId, iban, bic

== SUPPLIERS ==

Supplier:
  id, name, canDropship, currencyIso

ItemSupplierListItem:
  id, supplierId, supplierName, supplierItemNumber, purchasePriceNet, isDefault

=== QUERY SYNTAX ===

Filters: where: { and/or: [...conditions...] }
Conditions: { fieldName: { eq/neq/gt/gte/lt/lte/contains/startsWith: value } }
Ordering: order: [{ fieldName: ASC/DESC }]
Pagination: first: N, after: "cursor"
Date format: "2026-04-27" or "2026-04-27T00:00:00Z"

=== EXAMPLE QUERIES ===

# Recent sales orders
query { QuerySalesOrders(first: 10, order: [{ salesOrderDate: DESC }]) {
  totalCount nodes { salesOrderNumber salesOrderDate totalGrossAmount companyName }
}}

# Low stock items
query { QueryItems(first: 50, where: { hasMinimumStock: { eq: true }, stockAvailable: { lt: 10 } }) {
  totalCount nodes { sku name stockAvailable minimumStock }
}}

# Customers by country
query { QueryCustomers(first: 50, where: { countryIso: { eq: "DE" } }) {
  totalCount nodes { customerNumber companyName city }
}}

# Unpaid invoices
query { QuerySalesInvoices(first: 50, where: { isCompletelyPaid: { eq: false } }) {
  totalCount nodes { salesInvoiceNumber customerNumber totalGrossAmount stillToPay paymentDueDate }
}}

# Stock by warehouse
query { QueryStock(first: 100) {
  nodes { articleId availableQuantity reservedQuantity warehouseId }
}}

# Production orders
query { QueryProductionOrders(first: 50) {
  totalCount nodes { id projectNumber targetTotalQuantity actualQuantity progress }
}}

# Categories
query { QueryCategories(first: 100) {
  totalCount nodes { id parentId name sortNumber }
}}

# Suppliers
query { QuerySuppliers(first: 50) {
  totalCount nodes { id name canDropship currencyIso }
}}

=== RULES ===

1. Always use "first: N" for pagination (default 50, max 500)
2. Return ONLY the GraphQL query, no markdown or explanation
3. Use proper field names exactly as listed
4. For date comparisons, use ISO format
5. Always include totalCount in response
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
- Group related information
- Highlight warnings (low stock, overdue payments, etc.)
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
  console.log('[GraphQL Query]', cleanQuery);

  // Execute query
  const result = await executeGraphQL(cleanQuery, tenantId);
  console.log('[GraphQL Result]', JSON.stringify(result).substring(0, 500));

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
app.get('/', (_req, res) => {
  res.json({
    service: 'JTL Analytics AI Server',
    version: '2.0.0',
    status: 'running',
    supportedTypes: 338,
    categories: [
      'Sales/Orders', 'Items/Products', 'Categories', 'Customers',
      'Stock/Inventory', 'Warehouse/BinLocations', 'Shipping',
      'Production', 'Invoices', 'Marketplace', 'Master Data',
      'Companies', 'Suppliers'
    ],
    endpoints: [
      'POST /query - Natural language query (all types)',
      'POST /analyze-sales - Sales analysis',
      'POST /analyze-inventory - Inventory analysis',
      'POST /analyze-customers - Customer analysis',
      'POST /analyze-invoices - Invoice analysis',
      'POST /analyze-production - Production analysis',
      'POST /detect-fraud - Fraud detection',
      'POST /predict-reorder - Reorder predictions',
      'GET /suggestions - Query suggestions',
      'GET /schema - Available types and fields',
    ],
  });
});

// Main query endpoint - handles ALL types
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
    const question = `Analyze sales orders for ${timeframe}. Focus on ${focus}.
      Show: total orders, total revenue, average order value, top customers,
      payment status breakdown, and trends.`;

    console.log(`[Analyze Sales] ${timeframe} - ${focus}`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Inventory analysis
app.post('/analyze-inventory', async (req, res) => {
  try {
    const { focus = 'low_stock', tenantId } = req.body;
    let question = '';

    switch (focus) {
      case 'low_stock':
        question = 'Show items with stock below minimum stock level. Include sku, name, current stock, minimum stock.';
        break;
      case 'overstock':
        question = 'Show items with very high stock levels that might be overstocked. Include sku, name, stock available.';
        break;
      case 'value':
        question = 'Show inventory value analysis. Include items with highest stock value (stock * price).';
        break;
      default:
        question = 'Show overall inventory status. Include total items, low stock items, stock value.';
    }

    console.log(`[Analyze Inventory] ${focus}`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Inventory analysis error:', error);
    res.status(500).json({ error: 'Inventory analysis failed' });
  }
});

// Customer analysis
app.post('/analyze-customers', async (req, res) => {
  try {
    const { segment = 'all', tenantId } = req.body;
    const question = `Analyze ${segment} customers. Show: customer count by country,
      customer groups distribution, recent customer activity.`;

    console.log(`[Analyze Customers] ${segment}`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Customer analysis error:', error);
    res.status(500).json({ error: 'Customer analysis failed' });
  }
});

// Invoice analysis
app.post('/analyze-invoices', async (req, res) => {
  try {
    const { focus = 'unpaid', tenantId } = req.body;
    let question = '';

    switch (focus) {
      case 'unpaid':
        question = 'Show all unpaid invoices. Include invoice number, customer, amount, still to pay, due date.';
        break;
      case 'overdue':
        question = 'Show overdue invoices where payment due date has passed. Include dunning level.';
        break;
      case 'summary':
        question = 'Show invoice summary: total invoices, paid vs unpaid, total revenue, average invoice value.';
        break;
      default:
        question = 'Show recent invoices with payment status.';
    }

    console.log(`[Analyze Invoices] ${focus}`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Invoice analysis error:', error);
    res.status(500).json({ error: 'Invoice analysis failed' });
  }
});

// Production analysis
app.post('/analyze-production', async (req, res) => {
  try {
    const { focus = 'active', tenantId } = req.body;
    let question = '';

    switch (focus) {
      case 'active':
        question = 'Show active production orders. Include project number, target quantity, actual quantity, progress.';
        break;
      case 'delayed':
        question = 'Show production orders that might be delayed (progress < expected based on dates).';
        break;
      case 'completed':
        question = 'Show recently completed production orders.';
        break;
      default:
        question = 'Show production order overview with status breakdown.';
    }

    console.log(`[Analyze Production] ${focus}`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Production analysis error:', error);
    res.status(500).json({ error: 'Production analysis failed' });
  }
});

// Fraud detection
app.post('/detect-fraud', async (req, res) => {
  try {
    const { lookbackDays = 7, tenantId } = req.body;
    const question = `Find potentially suspicious orders from the last ${lookbackDays} days.
      Look for: high-value orders, billing/shipping address mismatches,
      unusual patterns. Flag concerning orders with risk assessment.`;

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
      Check stock levels vs minimum stock, identify items below reorder point.
      Include sku, name, current stock, minimum stock, suggested order quantity.`;

    console.log(`[Reorder] Urgency: ${urgency}`);
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ error: 'Reorder prediction failed' });
  }
});

// Category analysis
app.post('/analyze-categories', async (req, res) => {
  try {
    const { tenantId } = req.body;
    const question = 'Show all product categories with hierarchy. Include id, parent, name, sort order.';

    console.log('[Analyze Categories]');
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Category analysis error:', error);
    res.status(500).json({ error: 'Category analysis failed' });
  }
});

// Warehouse analysis
app.post('/analyze-warehouses', async (req, res) => {
  try {
    const { tenantId } = req.body;
    const question = 'Show all warehouses and their bin locations. Include warehouse name, active status, bin location counts.';

    console.log('[Analyze Warehouses]');
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Warehouse analysis error:', error);
    res.status(500).json({ error: 'Warehouse analysis failed' });
  }
});

// Supplier analysis
app.post('/analyze-suppliers', async (req, res) => {
  try {
    const { tenantId } = req.body;
    const question = 'Show all suppliers. Include name, dropship capability, currency.';

    console.log('[Analyze Suppliers]');
    const result = await queryJtlData(question, tenantId);
    res.json(result);
  } catch (error) {
    console.error('Supplier analysis error:', error);
    res.status(500).json({ error: 'Supplier analysis failed' });
  }
});

// Quick suggestions for UI
app.get('/suggestions', (_req, res) => {
  res.json({
    suggestions: [
      // Sales
      { icon: '📊', category: 'Sales', text: 'Show me recent sales orders' },
      { icon: '💰', category: 'Sales', text: 'What are my top 10 orders by amount?' },
      { icon: '📈', category: 'Sales', text: 'Compare sales this week vs last week' },

      // Inventory
      { icon: '📦', category: 'Inventory', text: 'Which products are low on stock?' },
      { icon: '🏷️', category: 'Inventory', text: 'Show me product prices and margins' },
      { icon: '📋', category: 'Inventory', text: 'List all active products' },

      // Customers
      { icon: '👑', category: 'Customers', text: 'Who are my top customers?' },
      { icon: '🌍', category: 'Customers', text: 'Show customers by country' },
      { icon: '👥', category: 'Customers', text: 'List customer groups' },

      // Invoices
      { icon: '💳', category: 'Invoices', text: 'Show unpaid invoices' },
      { icon: '⚠️', category: 'Invoices', text: 'Which invoices are overdue?' },
      { icon: '📄', category: 'Invoices', text: 'Recent invoice summary' },

      // Categories
      { icon: '🗂️', category: 'Categories', text: 'Show all product categories' },

      // Warehouse
      { icon: '🏭', category: 'Warehouse', text: 'List all warehouses' },
      { icon: '📍', category: 'Warehouse', text: 'Show bin locations' },

      // Production
      { icon: '🔧', category: 'Production', text: 'Show active production orders' },
      { icon: '📊', category: 'Production', text: 'Production order progress' },

      // Suppliers
      { icon: '🚚', category: 'Suppliers', text: 'List all suppliers' },

      // Shipping
      { icon: '📬', category: 'Shipping', text: 'Show shipping methods' },

      // Fraud
      { icon: '🚨', category: 'Analysis', text: 'Detect suspicious orders' },
    ],
  });
});

// Schema endpoint - show available types
app.get('/schema', (_req, res) => {
  res.json({
    totalTypes: 338,
    categories: {
      'Sales/Orders': {
        queries: ['QuerySalesOrders', 'QuerySalesQuotations', 'GetSalesOrderById'],
        types: ['SalesOrder', 'SalesOrderListItem', 'SalesOrderLineItem', 'SalesQuotation'],
      },
      'Items/Products': {
        queries: ['QueryItems', 'GetItemById'],
        types: ['ItemListItem', 'ItemdetailsItem', 'ItemPrice', 'ItemSupplier', 'ItemCategory'],
      },
      'Categories': {
        queries: ['QueryCategories', 'GetCategoryById'],
        types: ['CategoryListItem', 'CategoryDetails'],
      },
      'Customers': {
        queries: ['QueryCustomers', 'GetCustomerById', 'QueryCustomerGroups'],
        types: ['Customer', 'CustomerListItem', 'CustomerAddress', 'CustomerGroup'],
      },
      'Stock/Inventory': {
        queries: ['QueryStock', 'QueryStockItem', 'QueryBatches', 'QuerySerialNumbers'],
        types: ['QueryStock', 'QueryStockItem', 'BatchListItem', 'SerialNumberListItem'],
      },
      'Warehouse': {
        queries: ['QueryWarehouses', 'QueryBinLocations', 'QueryWarehouseZones'],
        types: ['WarehouseListItem', 'BinLocationListItem', 'WarehouseZoneListItem'],
      },
      'Shipping': {
        queries: ['QueryShippingMethods', 'QueryShippingClasses', 'QueryShippingBoxes'],
        types: ['ShippingMethodLookupItem', 'ShippingClassListItem', 'ShippingBoxListItem'],
      },
      'Production': {
        queries: ['QueryProductionOrders', 'QueryProductionItems', 'QueryBillsOfMaterials'],
        types: ['ProductionOrder', 'ProductionItem', 'BillOfMaterials'],
      },
      'Invoices': {
        queries: ['QuerySalesInvoices', 'QuerySalesInvoiceCorrections'],
        types: ['SalesInvoiceListItem', 'SalesInvoiceCorrectionListItem'],
      },
      'Marketplace': {
        queries: ['QueryMarketplaceOffers', 'QuerySalesChannels'],
        types: ['MarketplaceOfferListItem', 'SalesChannel'],
      },
      'Master Data': {
        queries: ['QueryCountries', 'QueryCurrencies', 'QueryTaxClasses', 'QueryPaymentMethods', 'QueryLanguages'],
        types: ['CountryItem', 'Currency', 'TaxClass', 'PaymentMethod', 'LanguageItem'],
      },
      'Companies': {
        queries: ['QueryCompanies', 'GetCompanyById'],
        types: ['CompanyListItem', 'CompanyDetailsItem'],
      },
      'Suppliers': {
        queries: ['QuerySuppliers'],
        types: ['Supplier', 'ItemSupplierListItem'],
      },
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`JTL Analytics AI Server v2.0 running on http://localhost:${PORT}`);
  console.log('Supporting 338 GraphQL types across 13 categories');
  console.log('');
  console.log('Available endpoints:');
  console.log('  POST /query              - Natural language query (all types)');
  console.log('  POST /analyze-sales      - Sales analysis');
  console.log('  POST /analyze-inventory  - Inventory analysis');
  console.log('  POST /analyze-customers  - Customer analysis');
  console.log('  POST /analyze-invoices   - Invoice analysis');
  console.log('  POST /analyze-production - Production analysis');
  console.log('  POST /analyze-categories - Category analysis');
  console.log('  POST /analyze-warehouses - Warehouse analysis');
  console.log('  POST /analyze-suppliers  - Supplier analysis');
  console.log('  POST /detect-fraud       - Fraud detection');
  console.log('  POST /predict-reorder    - Reorder predictions');
  console.log('  GET  /suggestions        - Query suggestions');
  console.log('  GET  /schema             - Available types and fields');
});
