
import { NextResponse } from 'next/server';
import { chaseLimitUp } from '../../../../../lib/trade/oneClickLimitUp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await chaseLimitUp(body.userId, body.symbol, body.reserveAmount);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 400 });
  }
}
