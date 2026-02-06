
import { NextResponse } from 'next/server';
import { applyForIPO } from '../../../../../lib/trade/newStockIPO';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await applyForIPO(body.userId, body.stockCode, body.quantity);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 400 });
  }
}
