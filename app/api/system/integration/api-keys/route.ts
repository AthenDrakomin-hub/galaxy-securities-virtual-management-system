
import { NextResponse } from 'next/server';
import { generateApiKey } from '../../../../../lib/integration/apiKeyManager';
import { db } from '@/lib/mongodb/client';

// Simulated in-memory storage for keys
let MOCK_KEYS: any[] = [
  {
    id: 'k1',
    clientName: '移动端App',
    apiKey: 'gy_ak_827f31c',
    apiSecret: 'gy_sec_f921a882e117429188a82c114514',
    permissions: ['行情查询', '交易操作'],
    status: 'ACTIVE',
    createTime: new Date()
  }
];

export async function GET() {
  return NextResponse.json(MOCK_KEYS);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { clientName, permissions } = body;
  const newKey = generateApiKey(clientName, permissions);
  MOCK_KEYS.unshift(newKey);
  return NextResponse.json(newKey);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { id } = body;
  const index = MOCK_KEYS.findIndex(k => k.id === id);
  
  if (index !== -1) {
    MOCK_KEYS[index].status = MOCK_KEYS[index].status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE';
    db.addLog('SYS', `API 密钥状态变更: ${MOCK_KEYS[index].clientName} -> ${MOCK_KEYS[index].status}`, 'OK');
    return NextResponse.json(MOCK_KEYS[index]);
  }
  
  return NextResponse.json({ error: 'Key not found' }, { status: 404 });
}
