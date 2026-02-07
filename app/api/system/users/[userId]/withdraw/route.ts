
import { NextResponse } from 'next/server';
import { db } from '@/lib/mongodb/client';

export async function POST(request: import('next/server').NextRequest, _ctx: any) {
  const params = (_ctx as any).params;
  const userId = params.userId;
  const body = await request.json();
  const { amount } = body;
  db.withdraw(userId, amount);
  return NextResponse.json({ success: true });
}
