# JTL Cloud App - Token & Tenant ID Flow Report

## Current Implementation Analysis

### How We Currently Get Tenant ID & Session Token

#### 1. Session Token Acquisition
```typescript
// Frontend obtains session token from AppBridge
const sessionToken = await appBridge.method.call<string>('getSessionToken');
```

The session token is a JWT that contains:
- `userId` - User identifier
- `tenantId` - JTL Platform tenant identifier

#### 2. Token Verification & Tenant Extraction (Backend)
```typescript
// packages/backend/src/index.ts

// 1. Fetch JWKS from JTL well-known endpoint
const response = await fetch(wellKnownEndpoint, {
  headers: { Authorization: `Bearer ${jwt}` }
});

// 2. Verify the session token
const { payload } = await jwtVerify(sessionToken, publicKey);
const tenantId = payload.tenantId;
```

#### 3. GraphQL API Authentication
```typescript
// Backend proxies requests to JTL ERP GraphQL API
const graphqlResponse = await fetch(
  `https://api${Environment}.jtl-cloud.com/erp/v2/graphql`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,  // Client credentials JWT
      'X-Tenant-ID': payload.tenantId,   // From session token
    },
    body: JSON.stringify(req.body),
  }
);
```

---

## Issues & Improvement Areas

### Issue 1: JWKS Endpoint Requires Authentication
**Current Behavior:**
The well-known JWKS endpoint (`/.well-known/jwks.json`) requires a Bearer token, which is non-standard.

**Standard Behavior:**
JWKS endpoints are typically public endpoints that don't require authentication, allowing any service to verify JWTs without needing credentials.

**Impact:**
- Forces applications to obtain client credentials before verifying session tokens
- Creates a chicken-and-egg problem for token verification
- Increases complexity of the authentication flow

**Recommendation:**
Make the JWKS endpoint publicly accessible without authentication, following OAuth 2.0 best practices (RFC 8414).

---

### Issue 2: Tenant ID Mapping Complexity
**Current Behavior:**
Applications must maintain their own mapping between internal tenant IDs and JTL Platform tenant IDs.

```typescript
// packages/backend/src/index.ts
const myMappingDatabase = new Map<string, string>();
myMappingDatabase.set(tenantId, sessionTokenPayload.tenantId);
```

**Issues:**
- Each application must implement its own tenant mapping logic
- No standardized way to persist or retrieve this mapping
- The example uses in-memory storage which is lost on restart

**Recommendation:**
1. Provide SDK utilities for tenant management
2. Document best practices for tenant ID storage
3. Consider a tenant context service or helper

---

### Issue 3: Double Token Flow
**Current Behavior:**
Two different tokens are required:
1. **Session Token** - From AppBridge, for user/tenant identification
2. **Client Credentials JWT** - For API authentication

**Flow:**
```
Frontend → Session Token (AppBridge)
   ↓
Backend → Verify Session Token (needs JWT for JWKS)
   ↓
Backend → Get Client Credentials JWT
   ↓
Backend → Call JTL API (with JWT + X-Tenant-ID)
```

**Improvement Suggestions:**
1. Allow session tokens to be used directly for API calls (with appropriate scopes)
2. Or, provide a token exchange endpoint that converts session tokens to API tokens
3. Simplify the dual-token requirement

---

### Issue 4: Environment Configuration
**Current Behavior:**
Environment switching is handled via `.env` configuration:
```typescript
const Environment = process.env.API_ENVIRONMENT; // '.dev', '.beta', 'prod'
```

**Issues:**
- Easy to misconfigure environment URLs
- No runtime validation of environment

**Recommendation:**
1. Provide environment constants/enum in the SDK
2. Add environment validation on startup
3. Document all available environments clearly

---

### Issue 5: Error Handling in Token Flow
**Current Behavior:**
```typescript
try {
  const { payload } = await jwtVerify(sessionToken, publicKey);
} catch (err) {
  console.error('❌ Invalid token:', err);
  // No proper error response to client
}
```

**Issues:**
- Errors may not propagate correctly to the frontend
- No standardized error codes for token-related failures

**Recommendation:**
1. Define standard error codes for authentication failures
2. Provide clear error messages for debugging
3. Document error handling patterns

---

## Security Considerations

### Current Security Measures (Good)
- Session tokens are JWTs signed with EdDSA
- JWKS key rotation support
- Tenant isolation via X-Tenant-ID header
- Client credentials flow for backend authentication

### Suggested Improvements
1. **Token Expiry Handling**: Document token lifetimes and refresh patterns
2. **Rate Limiting**: Implement rate limiting on token verification
3. **Audit Logging**: Log all token verification attempts for security monitoring
4. **Token Revocation**: Provide mechanism to check if tokens are revoked

---

### Issue 6: Icon URL Documentation Missing
**Current Behavior:**
The manifest.json requires icon URLs for light and dark themes:
```json
{
  "icon": {
    "light": "https://cdn-icons-png.flaticon.com/512/4727/4727424.png",
    "dark": "https://cdn-icons-png.flaticon.com/512/4727/4727424.png"
  }
}
```

**Issue:**
The JTL Cloud App documentation does not mention that developers need to:
1. Provide valid PNG icon URLs
2. Host icons on a publicly accessible CDN
3. Provide separate light/dark theme variants

**Impact:**
- Developers may use placeholder URLs that break in production
- No guidance on icon size requirements or format specifications
- No mention of whether icons can be relative paths or must be absolute URLs

**Recommendation:**
1. Document icon requirements clearly (size, format, hosting)
2. Specify if relative paths are supported
3. Provide icon templates or guidelines for branding compliance
4. Consider allowing icons to be uploaded during app registration

---

## Summary of Recommendations for JTL Management

| Priority | Issue | Recommendation |
|----------|-------|----------------|
| High | JWKS requires auth | Make JWKS endpoint public |
| High | Error handling | Standardize error codes |
| Medium | Dual token flow | Simplify or provide token exchange |
| Medium | Tenant mapping | Provide SDK utilities |
| Medium | Icon URL documentation | Document icon requirements (size, format, hosting) |
| Low | Environment config | Add validation/constants |

---

---

## How to Get Tenant ID (Workaround)

Since there's no documented way to easily retrieve the tenant ID, developers must use browser DevTools:

### Steps to Get Tenant ID via Network Inspector:
1. Open JTL ERP Cloud (https://erp.jtl-cloud.com)
2. Open Browser DevTools → Network tab
3. Filter by "tenants" or look for API calls to `/account/tenants`
4. Find the response which contains tenant information:

```json
[
  {
    "name": "JTL Software Hackathon 2026",
    "slug": "jtl-software-hackathon-2026",
    "kid": "110929",
    "id": "16eff290-3d20-4d32-8387-39e6e5c27506",  // <-- This is the Tenant ID
    "createdAt": "2026-04-09T15:44:39.248436Z"
  }
]
```

### Screenshot Reference:
The tenant ID can be found by inspecting the `/account/tenants` API response in the Network tab Preview panel. The `id` field contains the UUID tenant identifier needed for API calls.

**Issue:** This workflow is not intuitive and undocumented. Developers should not need to use DevTools to find essential configuration values.

**Recommendation:**
1. Display tenant ID in the JTL Platform UI settings
2. Include tenant ID in the app setup flow
3. Document the `/account/tenants` endpoint

---

## Technical References

### Endpoints Used
- Auth: `https://auth{env}.jtl-cloud.com/oauth2/token`
- JWKS: `https://api{env}.jtl-cloud.com/account/.well-known/jwks.json`
- GraphQL: `https://api{env}.jtl-cloud.com/erp/v2/graphql`
- ERP Info: `https://api{env}.jtl-cloud.com/erp/{endpoint}`

### Environment Values
- Production: `prod` (or `.beta`)
- Development: `.dev`
- QA: `.qa`

---

*Report generated for JTL Cloud App Development*
*Date: April 2026*
