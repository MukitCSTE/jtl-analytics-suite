import { AppBridge } from '@jtl-software/cloud-apps-core';
import { GraphQLClient } from 'graphql-request';
import { apiUrl } from '../../../common/constants';

export async function executeQuery<T>(
  appBridge: AppBridge,
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    // Try with session token first
    const sessionToken = await appBridge.method.call<string>('getSessionToken');
    const client = new GraphQLClient(`${apiUrl}/graphql`, {
      headers: { 'X-Session-Token': sessionToken },
    });
    return await client.request<T>(query, variables);
  } catch (error) {
    // If session token fails (demo mode), use demo endpoint
    const errorMsg = error instanceof Error ? error.message : '';
    if (errorMsg.includes('Demo mode') || errorMsg.includes('getSessionToken')) {
      console.log('Using demo-graphql endpoint for local testing');
      const response = await fetch(`${apiUrl}/demo-graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Demo GraphQL failed: ${errorText}`);
      }

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GraphQL error');
      }
      return result.data as T;
    }
    throw error;
  }
}
