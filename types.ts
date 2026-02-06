
export type Market = 'CN' | 'HK';

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  market: Market;
  volume: number;
}

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL' | 'IPO' | 'BLOCK' | 'LIMIT_UP';
  price: number;
  quantity: number;
  amount: number;
  timestamp: Date;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

export interface UserAccount {
  id: string;
  username: string;
  balance: number;
  totalAssets: number;
  yesterdayProfit: number;
  totalProfit: number;
  role: 'ADMIN' | 'OPERATOR' | 'CLIENT';
  status: 'ACTIVE' | 'DISABLED';
  createTime: Date;
}

export interface Holding {
  symbol: string;
  name: string;
  market: Market;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

export interface ApiKey {
  id: string;
  clientName: string;
  apiKey: string;
  apiSecret: string;
  permissions: string[];
  status: 'ACTIVE' | 'REVOKED';
  createTime: Date;
}
