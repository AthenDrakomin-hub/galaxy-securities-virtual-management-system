
import { Stock, Trade, UserAccount, Holding, ApiKey } from '../types';
import { MOCK_STOCKS } from '../constants';

class Store {
  stocks: Stock[] = [...MOCK_STOCKS as Stock[]];
  trades: Trade[] = [];
  users: UserAccount[] = [
    {
      id: 'admin_1',
      username: '银河管理员',
      balance: 10000000.00,
      totalAssets: 12500000.00,
      yesterdayProfit: 45000.00,
      totalProfit: 2500000.00,
      role: 'ADMIN',
      status: 'ACTIVE',
      createTime: new Date('2023-01-01')
    }
  ];
  holdings: Holding[] = [
    { symbol: '600519', name: '贵州茅台', market: 'CN', quantity: 1000, avgPrice: 1650, currentPrice: 1720.50 },
    { symbol: '00700', name: '腾讯控股', market: 'HK', quantity: 5000, avgPrice: 350, currentPrice: 382.40 }
  ];
  apiKeys: ApiKey[] = [
    {
      id: 'k1',
      clientName: '移动端App',
      apiKey: 'gy_ak_827f31c',
      apiSecret: 'gy_sec_f921a882e11...',
      permissions: ['行情查询', '交易操作'],
      status: 'ACTIVE',
      createTime: new Date()
    }
  ];

  // Helper to simulate updates
  updatePrices() {
    this.stocks = this.stocks.map(s => {
      const volatility = (Math.random() - 0.5) * 2;
      const newPrice = s.price * (1 + volatility / 100);
      return {
        ...s,
        price: Number(newPrice.toFixed(2)),
        change: Number((newPrice - s.price).toFixed(2)),
        changePercent: Number(((newPrice - s.price) / s.price * 100).toFixed(2))
      };
    });
  }
}

export const db = new Store();
