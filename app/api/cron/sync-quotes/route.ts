
import { NextResponse } from 'next/server';
import { db } from '@/lib/mongodb/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Logic to simulate a background price update from real markets
  db.updateMarket();
  
  db.addLog('SYS', '执行定时行情镜像同步 (CRON)', 'OK');

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    updated_stocks_count: db.stocks.length
  });
}
