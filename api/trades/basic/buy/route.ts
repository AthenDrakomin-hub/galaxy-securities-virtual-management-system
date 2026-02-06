
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/mongodb/client';

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, symbol, quantity, price } = body;
  
  const result = db.executeTrade(userId, symbol, 'BUY', quantity, price);
  return NextResponse.json(result);
}
