
import { db } from '../mongodb/client';
import { fetchRealQuote } from './fetchRealQuote';

export async function syncAllQuotes() {
  db.addLog('NET', '发起跨域行情实时对账...', 'OK');
  
  const updates = await Promise.all(
    db.stocks.map(async (s) => {
      const realData = await fetchRealQuote(s.symbol, s.market);
      return { ...s, ...realData };
    })
  );

  // Update DB state
  db.stocks = updates as any;
  db.updateMarket(); // Trigger calculations for holdings

  db.addLog('DB', '资产行情数据库同步对账完成', 'OK');
  return true;
}
