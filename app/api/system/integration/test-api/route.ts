
import { NextResponse } from 'next/server';
import { simulateApiCall } from '../../../../../lib/integration/apiTester';

export async function POST(request: Request) {
  const body = await request.json();
  const { path, apiKey } = body;
  const result = await simulateApiCall(path, 'POST', apiKey);
  return NextResponse.json(result);
}
