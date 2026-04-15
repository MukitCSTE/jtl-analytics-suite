import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { importJWK, jwtVerify } from 'jose';
import { Environment } from './constants.js';
dotenv.config();
const app = express();
const PORT = 3005;

app.use(cors());

app.use(express.json());
console.log('CORS enabled');
console.log('Environment', process.env.API_ENVIRONMENT);

/**
 * This is a simple example of how to maintain the mapping between a tenant ID from THIS application and the JTL Platform tenant ID.
 * In a real application, you would probably want to use a database or some other persistent storage.
 * The key is the tenant ID from THIS application and the value is the JTL Platform tenant ID.
 */
const myMappingDatabase = new Map<string, string>();

app.get('/', async (_req, res) => {
  res.send('Hello from TypeScript + Express!');
});

app.post('/connect-tenant', async (req, res) => {
  const { sessionToken } = req.body;

  // Verify the session token & extract the payload
  const sessionTokenPayload = await verifySessionTokenAndExtractPayload(sessionToken);

  // the tenant ID can be read from header with authorization or from the JWT or whatever your backend will do
  // in this example we just use the current time as tenant ID
  const tenantId = new Date().getTime().toString();

  // Store the mapping in the database
  myMappingDatabase.set(tenantId, sessionTokenPayload.tenantId);

  res.send(`The tenant ID is ${tenantId} and the JTL Platform tenant ID is ${sessionTokenPayload.tenantId}`);

  res.end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wellKnownEndpoint = `https://api${Environment}.jtl-cloud.com/account/.well-known/jwks.json`;
async function verifySessionTokenAndExtractPayload(sessionToken: string): Promise<SessionTokenPayload> {
  // Fetch the JWKS
  const jwt = await getJwt();
  const response = await fetch(wellKnownEndpoint, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
  const jwks = await response.json();
  const key = jwks.keys[0];
  // Convert the JWK to a CryptoKey
  const publicKey = await importJWK(key, 'EdDSA');

  try {
    const { payload } = await jwtVerify(sessionToken, publicKey);
    console.log('✅ Token is valid:', payload);
    return payload as SessionTokenPayload;
  } catch (err) {
    console.error('❌ Invalid token:', err);
  }
}

type SessionTokenPayload = {
  userId: string;
  tenantId: string;
};

/**
 * Get the authentication endpoint URL for the specified environment.
 * @param env 'prod' | '.dev' | '.beta' | '.qa'
 * @returns The authentication endpoint URL.
 */
const getAuthEndpoint = (env: string) => {
  if (env === 'prod' || env === '.beta') return `https://auth.jtl-cloud.com/oauth2/token`;
  return `https://auth${env}.jtl-cloud.com/oauth2/token`;
};

/**
 * This function can be removed once we have exposed the endpoint to public.
 */
export async function getJwt(): Promise<string> {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  console.log('clientId', clientId);
  console.log('clientSecret', clientSecret ? `${clientSecret.slice(0, 3)}***${clientSecret.slice(-3)}` : 'undefined');
  if (!clientId || !clientSecret) {
    throw new Error('CLIENT_ID and CLIENT_SECRET must be defined in .env file');
  }
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch(getAuthEndpoint(Environment), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${authString}`,
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });
  const data = await response.json();

  if (response.ok) {
    return data.access_token;
  } else {
    throw new Error(`Failed to fetch JWT (${response.status}): ${data.error}`);
  }
}

app.post('/graphql', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.headers['x-session-token'] as string;
    if (!sessionToken) {
      res.status(401).json({ error: 'Missing X-Session-Token header' });
      return;
    }

    const payload = await verifySessionTokenAndExtractPayload(sessionToken);
    const jwt = await getJwt();

    const graphqlResponse = await fetch(`https://api${Environment}.jtl-cloud.com/erp/v2/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
        'X-Tenant-ID': payload.tenantId,
      },
      body: JSON.stringify(req.body),
    });

    const responseBody = await graphqlResponse.text();
    res.status(graphqlResponse.status).type('application/json').send(responseBody);
  } catch (error) {
    console.error('Error in /graphql route:', error);
    res.status(500).json({
      error: 'Failed to proxy GraphQL request',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// Endpoint to extract and return tenant ID from session token
app.post('/get-tenant-id', async (req: Request, res: Response) => {
  try {
    const sessionToken = req.headers['x-session-token'] as string;
    if (!sessionToken) {
      res.status(401).json({ error: 'Missing X-Session-Token header' });
      return;
    }

    const payload = await verifySessionTokenAndExtractPayload(sessionToken);
    console.log('=== TENANT ID ===', payload.tenantId);
    res.json({ tenantId: payload.tenantId, userId: payload.userId });
  } catch (error) {
    console.error('Error extracting tenant ID:', error);
    res.status(500).json({ error: 'Failed to extract tenant ID' });
  }
});

// TEST ENDPOINT - bypasses session token, pass tenantId in body
app.post('/test-graphql', async (req: Request, res: Response) => {
  try {
    const { tenantId, query, variables } = req.body;

    if (!tenantId) {
      res.status(400).json({ error: 'Missing tenantId in request body' });
      return;
    }

    if (!query) {
      res.status(400).json({ error: 'Missing query in request body' });
      return;
    }

    console.log('Test GraphQL - tenantId:', tenantId);
    const jwt = await getJwt();

    const graphqlResponse = await fetch(`https://api${Environment}.jtl-cloud.com/erp/v2/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
        'X-Tenant-ID': tenantId,
      },
      body: JSON.stringify({ query, variables }),
    });

    const responseBody = await graphqlResponse.text();
    console.log('GraphQL Response Status:', graphqlResponse.status);
    res.status(graphqlResponse.status).type('application/json').send(responseBody);
  } catch (error) {
    console.error('Error in /test-graphql route:', error);
    res.status(500).json({
      error: 'Failed to execute GraphQL request',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// DEMO ENDPOINT - uses DEMO_TENANT_ID from .env for local testing
app.post('/demo-graphql', async (req: Request, res: Response) => {
  try {
    const tenantId = process.env.DEMO_TENANT_ID;
    const { query, variables } = req.body;

    if (!tenantId) {
      res.status(400).json({ error: 'DEMO_TENANT_ID not configured in .env' });
      return;
    }

    if (!query) {
      res.status(400).json({ error: 'Missing query in request body' });
      return;
    }

    console.log('Demo GraphQL - tenantId:', tenantId);
    const jwt = await getJwt();

    const graphqlResponse = await fetch(`https://api${Environment}.jtl-cloud.com/erp/v2/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
        'X-Tenant-ID': tenantId,
      },
      body: JSON.stringify({ query, variables }),
    });

    const responseBody = await graphqlResponse.text();
    console.log('Demo GraphQL Response Status:', graphqlResponse.status);
    res.status(graphqlResponse.status).type('application/json').send(responseBody);
  } catch (error) {
    console.error('Error in /demo-graphql route:', error);
    res.status(500).json({
      error: 'Failed to execute GraphQL request',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

// =============================================================================
// AI-POWERED ANALYTICS ENDPOINT
// =============================================================================

const GRAPHQL_SCHEMA_CONTEXT = `
You are a JTL ERP GraphQL expert. Convert natural language questions into GraphQL queries.

Available GraphQL Types:

1. QuerySalesOrders - Sales order data
   Fields: salesOrderNumber, salesOrderDate, totalGrossAmount, totalNetAmount, currencyIso,
           companyName, customerNumber, customerId,
           billingAddressCity, billingAddressCountryIso, billingAddressCountryName,
           shipmentAddressCity, shipmentAddressCountryIso, shipmentAddressCountryName,
           deliveryStatus, deliveryCompleteStatus, paymentStatus,
           shippingMethodName, shippingPriority, estimatedDeliveryDate, lastShippingDate,
           isPending, isCancelled

   Filters: where: { and/or: [...conditions...] }
   Conditions: { fieldName: { eq/neq/gt/gte/lt/lte/contains: value } }
   Ordering: order: [{ fieldName: ASC/DESC }]
   Pagination: first: N, after: "cursor"

2. QueryItems - Product/inventory data
   Fields: id, sku, name, description,
           stockTotal, stockAvailable, stockInOrders, stockIncoming,
           minimumStock, hasMinimumStock,
           salesPriceGross, salesPriceNet, profit,
           defaultSupplier, lastPurchaseDate,
           isActive, createdDate, modifiedDate

RULES:
1. Always use "first: N" for pagination (default 50, max 500)
2. Return ONLY the GraphQL query, no explanation
3. Use proper field names exactly as listed
4. For date comparisons, use ISO format: "2026-04-15"
5. Always include totalCount in response
6. Today's date is: ${new Date().toISOString().split('T')[0]}
`;

const RESPONSE_FORMATTER_CONTEXT = `
You are a helpful business analytics assistant for JTL ERP users.
Format the data into a clear, actionable response.

Guidelines:
- Be concise but informative
- Highlight key insights and trends
- Use bullet points for lists
- Include specific numbers and percentages
- Suggest actionable next steps when relevant
- Use German number format (1.234,56) for currency
- Format dates as DD.MM.YYYY
- If data is empty, explain what that means and suggest alternatives
`;

// Call Azure OpenAI
async function callOpenAI(messages: Array<{role: string, content: string}>): Promise<string> {
  const apiUrl = process.env.OPENAI_API_URL;
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiUrl || !apiKey) {
    throw new Error('OpenAI API configuration missing');
  }

  const response = await fetch(`${apiUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      model,
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

// AI Query endpoint - natural language to insights
app.post('/ai/query', async (req: Request, res: Response) => {
  try {
    const { question, tenantId: bodyTenantId } = req.body;
    const sessionToken = req.headers['x-session-token'] as string;

    if (!question) {
      res.status(400).json({ error: 'Missing question in request body' });
      return;
    }

    // Get tenant ID from session token or use demo tenant
    let tenantId = bodyTenantId || process.env.DEMO_TENANT_ID;
    if (sessionToken) {
      try {
        const payload = await verifySessionTokenAndExtractPayload(sessionToken);
        tenantId = payload.tenantId;
      } catch (e) {
        console.log('Using demo tenant - session token invalid');
      }
    }

    if (!tenantId) {
      res.status(400).json({ error: 'No tenant ID available' });
      return;
    }

    console.log('AI Query:', question);
    console.log('Tenant:', tenantId);

    // Step 1: Generate GraphQL query from natural language
    const graphqlQuery = await callOpenAI([
      { role: 'system', content: GRAPHQL_SCHEMA_CONTEXT },
      { role: 'user', content: question }
    ]);

    console.log('Generated GraphQL:', graphqlQuery);

    // Clean the query (remove markdown code blocks if present)
    const cleanQuery = graphqlQuery
      .replace(/```graphql?/gi, '')
      .replace(/```/g, '')
      .trim();

    // Step 2: Execute GraphQL query
    const jwt = await getJwt();
    const graphqlResponse = await fetch(`https://api${Environment}.jtl-cloud.com/erp/v2/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
        'X-Tenant-ID': tenantId,
      },
      body: JSON.stringify({ query: cleanQuery }),
    });

    const graphqlData = await graphqlResponse.json();
    console.log('GraphQL Response:', JSON.stringify(graphqlData).substring(0, 500));

    // Check for GraphQL errors
    if (graphqlData.errors) {
      res.json({
        answer: `I had trouble understanding that query. The system returned: ${graphqlData.errors[0]?.message || 'Unknown error'}. Try rephrasing your question.`,
        query: cleanQuery,
        error: graphqlData.errors,
        data: null
      });
      return;
    }

    // Step 3: Format response with AI
    const formattedResponse = await callOpenAI([
      { role: 'system', content: RESPONSE_FORMATTER_CONTEXT },
      { role: 'user', content: `
Question: ${question}

Data from JTL ERP:
${JSON.stringify(graphqlData.data, null, 2)}

Please provide a helpful, concise answer based on this data.
` }
    ]);

    res.json({
      answer: formattedResponse,
      query: cleanQuery,
      data: graphqlData.data
    });

  } catch (error) {
    console.error('Error in /ai/query:', error);
    res.status(500).json({
      error: 'AI query failed',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// AI Demo endpoint - uses DEMO_TENANT_ID, no auth required
app.post('/ai/demo-query', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const tenantId = process.env.DEMO_TENANT_ID;

    if (!question) {
      res.status(400).json({ error: 'Missing question in request body' });
      return;
    }

    if (!tenantId) {
      res.status(400).json({ error: 'DEMO_TENANT_ID not configured' });
      return;
    }

    console.log('AI Demo Query:', question);

    // Step 1: Generate GraphQL query
    const graphqlQuery = await callOpenAI([
      { role: 'system', content: GRAPHQL_SCHEMA_CONTEXT },
      { role: 'user', content: question }
    ]);

    const cleanQuery = graphqlQuery
      .replace(/```graphql?/gi, '')
      .replace(/```/g, '')
      .trim();

    // Step 2: Execute GraphQL
    const jwt = await getJwt();
    const graphqlResponse = await fetch(`https://api${Environment}.jtl-cloud.com/erp/v2/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
        'X-Tenant-ID': tenantId,
      },
      body: JSON.stringify({ query: cleanQuery }),
    });

    const graphqlData = await graphqlResponse.json();

    if (graphqlData.errors) {
      res.json({
        answer: `I couldn't process that query. Error: ${graphqlData.errors[0]?.message}. Please try a different question.`,
        query: cleanQuery,
        error: graphqlData.errors,
        data: null
      });
      return;
    }

    // Step 3: Format response
    const formattedResponse = await callOpenAI([
      { role: 'system', content: RESPONSE_FORMATTER_CONTEXT },
      { role: 'user', content: `
Question: ${question}

Data:
${JSON.stringify(graphqlData.data, null, 2)}

Provide a helpful answer.
` }
    ]);

    res.json({
      answer: formattedResponse,
      query: cleanQuery,
      data: graphqlData.data
    });

  } catch (error) {
    console.error('Error in /ai/demo-query:', error);
    res.status(500).json({
      error: 'AI query failed',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

// =============================================================================
// ERP INFO ENDPOINT
// =============================================================================

app.all('/erp-info/:tenantId/:endpoint', async (req: Request, res: Response) => {
  try {
    // Get parameters from the URL and the body if available
    const urlTenantId = req.params.tenantId;
    const urlEndpoint = req.params.endpoint;
    const method = req.method;

    // For POST, PUT, PATCH, check for tenantId and endpoint in the request body
    let tenantId = urlTenantId;
    let endpoint = urlEndpoint;
    let bodyToSend = req.body;

    if (['POST', 'PUT', 'PATCH'].includes(method) && req.body) {
      // Extract _tenantId and _endpoint from body if present
      if (req.body._tenantId) {
        tenantId = req.body._tenantId;
      }

      if (req.body._endpoint) {
        endpoint = req.body._endpoint;
      }

      // Create a new copy of the body without _tenantId and _endpoint
      const { _tenantId, _endpoint, ...cleanedBody } = req.body;
      bodyToSend = cleanedBody;
    }

    // Get JWT for authentication
    const jwt = await getJwt();

    // Set up request options
    const options: RequestInit = {
      method: method,
      headers: {
        'X-Tenant-ID': tenantId as string,
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    };

    // Add body for methods that support it
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      options.body = JSON.stringify(bodyToSend);
    }

    // Call the JTL Platform API

    const erpInfoResponse = await fetch(`https://api${Environment}.jtl-cloud.com/erp/${endpoint}`, options);

    // Check if the response is OK and return the appropriate response
    if (erpInfoResponse.ok) {
      const data = await erpInfoResponse.json();
      res.json(data);
    } else {
      const errorText = await erpInfoResponse.text();
      res.status(erpInfoResponse.status).send(errorText);
    }
  } catch (error) {
    console.error('Error in /erp-info route:', error);
    res.status(500).json({
      error: 'Failed to fetch ERP info',
      message: error instanceof Error ? error.message : String(error),
    });
  }
});
