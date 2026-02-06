
import { ApiTestResult } from '../../types/integration';

export async function simulateApiCall(path: string, method: string = 'GET', apiKey: string): Promise<ApiTestResult> {
  // Artificial latency simulation
  const latency = Math.floor(Math.random() * 200) + 50;
  await new Promise(resolve => setTimeout(resolve, latency));

  if (!apiKey || !apiKey.startsWith('gy_ak_')) {
    return {
      status: 'UNAUTHORIZED',
      code: 401,
      timestamp: Date.now(),
      data: { error: 'Invalid API Key provided' }
    };
  }

  // Simulated logic for specific endpoints
  if (path.includes('/market/quotes')) {
    return {
      status: 'OK',
      code: 200,
      timestamp: Date.now(),
      data: {
        symbol: "600519",
        price: 1720.50,
        quote_source: "GALAXY_REALTIME_MIRROR",
        latency: `${latency}ms`
      }
    };
  }

  return {
    status: 'NOT_FOUND',
    code: 404,
    timestamp: Date.now(),
    data: { error: `Endpoint ${path} not implemented in test mock` }
  };
}
