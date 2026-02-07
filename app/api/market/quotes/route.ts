import { NextResponse } from 'next/server';
import { db } from '../../../../lib/mongodb/client';

export async function GET() {
  db.updateMarket();
  return NextResponse.json(db.stocks);
}