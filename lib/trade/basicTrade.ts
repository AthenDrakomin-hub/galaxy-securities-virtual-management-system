
import { db } from '../mongodb/client';
import { TradeType } from '../../types/trade';

export async function processBasicTrade(userId: string, symbol: string, type: TradeType, quantity: number, price: number) {
  return db.executeTrade(userId, symbol, type, quantity, price);
}
