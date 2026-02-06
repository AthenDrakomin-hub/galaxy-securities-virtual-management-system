
import { ApiKey, ApiTestResult } from '../../types/integration';

export async function fetchApiKeys(): Promise<ApiKey[]> {
  const res = await fetch('/api/system/integration/api-keys');
  if (!res.ok) throw new Error('Failed to fetch API keys');
  return res.json();
}

export async function createNewApiKey(clientName: string, permissions: string[]): Promise<ApiKey> {
  const res = await fetch('/api/system/integration/api-keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientName, permissions })
  });
  if (!res.ok) throw new Error('Failed to create API key');
  return res.json();
}

export async function toggleApiKeyStatus(keyId: string): Promise<ApiKey> {
  const res = await fetch('/api/system/integration/api-keys', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: keyId })
  });
  if (!res.ok) throw new Error('Failed to toggle API key status');
  return res.json();
}

export async function testApiEndpoint(path: string, apiKey: string): Promise<ApiTestResult> {
  const res = await fetch('/api/system/integration/test-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, apiKey })
  });
  if (!res.ok) throw new Error('API Test failed');
  return res.json();
}
