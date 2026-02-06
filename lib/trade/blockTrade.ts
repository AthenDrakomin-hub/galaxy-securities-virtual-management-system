
import { db } from '../mongodb/client';

export async function executeBlockTrade(userId: string, symbol: string, amount: number, discount: number) {
  const user = db.users.find(u => u.id === userId);
  const stock = db.stocks.find(s => s.symbol === symbol);

  if (!user || !stock) throw new Error('User or Stock not found');

  const discountedPrice = stock.price * discount;
  const quantity = Math.floor(amount / discountedPrice);

  if (user.balance < amount) {
    throw new Error('Insufficient balance for block trade');
  }

  // Execute as a special trade
  const result = db.executeTrade(userId, symbol, 'BLOCK', quantity, discountedPrice);
  
  if (result.success) {
    db.addLog('TRADE', `大宗交易执行: ${stock.name} @ 折价 ${discount * 100}%`, 'OK');
  }

  return result;
}
