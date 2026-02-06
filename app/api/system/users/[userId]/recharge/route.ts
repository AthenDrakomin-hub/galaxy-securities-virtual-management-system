
import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/mongodb/client';

export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const userId = params.userId;
  const body = await request.json();
  const { amount } = body;
  db.recharge(userId, amount);
  return NextResponse.json({ success: true });
}
