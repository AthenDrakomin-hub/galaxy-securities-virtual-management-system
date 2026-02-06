
export type TradeType = 'BUY' | 'SELL' | 'IPO' | 'BLOCK' | 'LIMIT_UP';

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: TradeType;
  price: number;
  quantity: number;
  amount: number;
  timestamp: Date;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

export interface Holding {
  userId?: string; // 用户标识，关联到 UserAccount.id
  symbol: string;
  name: string;
  market: 'CN' | 'HK';
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}
