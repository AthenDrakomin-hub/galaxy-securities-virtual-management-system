
import { NextResponse } from 'next/server';
import { executeBlockTrade } from '../../../../../lib/trade/blockTrade';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await executeBlockTrade(body.userId, body.symbol, body.amount, body.discount);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 400 });
  }
}
