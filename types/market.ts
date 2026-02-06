
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
