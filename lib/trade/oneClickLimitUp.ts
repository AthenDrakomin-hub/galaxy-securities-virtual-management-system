
import { db } from '../mongodb/client';

export async function chaseLimitUp(userId: string, symbol: string, reserveAmount: number) {
  const user = db.users.find(u => u.id === userId);
  const stock = db.stocks.find(s => s.symbol === symbol);

  if (!user || !stock) throw new Error('Target not found');

  // Limit up price is usually +10%
  const limitUpPrice = Number((stock.price * 1.1).toFixed(2));
  const quantity = Math.floor(reserveAmount / limitUpPrice);

  db.addLog('TRADE', `启动一键打板扫描: ${stock.name} 目标价 ${limitUpPrice}`, 'OK');

  // In this mock, we simulate immediate execution
  return db.executeTrade(userId, symbol, 'LIMIT_UP', quantity, limitUpPrice);
}
