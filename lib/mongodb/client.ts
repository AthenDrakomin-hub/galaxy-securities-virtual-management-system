
import { Stock } from '../../types/market';
import { UserAccount } from '../../types/user';
import { Trade, Holding, TradeType } from '../../types/trade';
import { INITIAL_USERS, INITIAL_STOCKS, INITIAL_HOLDINGS, INITIAL_TRADES, INITIAL_LOGS } from './seed';
import { LogSchema } from './schema';

class MockDB {
  stocks: Stock[] = INITIAL_STOCKS.map(s => ({ ...s }));
  
  // Fix: Map INITIAL_USERS (_id, missing yesterdayProfit) to UserAccount (id)
  users: UserAccount[] = INITIAL_USERS.map(u => ({ 
    id: u._id,
    username: u.username,
    balance: u.balance,
    totalAssets: u.totalAssets,
    yesterdayProfit: 0,
    totalProfit: u.totalProfit,
    role: u.role,
    status: u.status,
    createTime: u.createTime
  }));

  // Fix: Map INITIAL_HOLDINGS to Holding (requires currentPrice)
  holdings: Holding[] = INITIAL_HOLDINGS.map(h => ({ 
    userId: h.userId,
    symbol: h.symbol,
    name: h.name,
    market: h.market,
    quantity: h.quantity,
    avgPrice: h.avgPrice,
    currentPrice: h.avgPrice
  }));

  // Fix: Map INITIAL_TRADES (_id) to Trade (id)
  trades: Trade[] = INITIAL_TRADES.map(t => ({ 
    id: t._id,
    userId: t.userId,
    symbol: t.symbol,
    name: t.name,
    type: t.type,
    price: t.price,
    quantity: t.quantity,
    amount: t.amount,
    timestamp: t.timestamp,
    status: t.status
  }));

  logs: LogSchema[] = INITIAL_LOGS.map(l => ({ ...l }));

  addLog(type: LogSchema['type'], event: string, status: LogSchema['status'] = 'OK') {
    this.logs.unshift({
      _id: 'L_' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      type,
      event,
      time: new Date(),
      status
    });
    if (this.logs.length > 200) this.logs.pop();
  }

  updateMarket() {
    this.stocks = this.stocks.map(s => {
      const vol = (Math.random() - 0.5) * 1.2; // 模拟波动
      const newPrice = Math.max(0.01, s.price * (1 + vol / 100));
      return {
        ...s,
        price: Number(newPrice.toFixed(2)),
        change: Number((newPrice - (s.price / (1 + vol / 100))).toFixed(2)),
        changePercent: Number(vol.toFixed(2))
      };
    });
    
    // 同步持仓现价
    this.holdings = this.holdings.map(h => {
      const stock = this.stocks.find(s => s.symbol === h.symbol);
      return stock ? { ...h, currentPrice: stock.price } : h;
    });

    // 重新计算用户总资产
    this.users.forEach(u => {
      // Fix: Filter logic now correctly references h.userId on Holding
      const userHoldings = this.holdings.filter(h => h.userId === u.id || (u.id === 'admin_1' && !h.userId)); 
      const marketValue = userHoldings.reduce((sum, h) => sum + (h.currentPrice || h.avgPrice) * h.quantity, 0);
      u.totalAssets = u.balance + marketValue;
    });
  }

  executeTrade(userId: string, symbol: string, type: TradeType, quantity: number, price: number) {
    const user = this.users.find(u => u.id === userId);
    const stock = this.stocks.find(s => s.symbol === symbol);
    
    if (!user || !stock) {
      this.addLog('TRADE', `交易拒绝: 主体或标的不存在 [${symbol}]`, 'ERROR');
      return { success: false, msg: '主体或标的未找到' };
    }

    const amount = quantity * price;
    const fee = amount * 0.0005;

    if (type === 'BUY' && user.balance < (amount + fee)) {
      this.addLog('TRADE', `交易失败: 账户 ${user.username} 余额不足`, 'WARN');
      return { success: false, msg: '余额不足' };
    }

    if (type === 'BUY') {
      user.balance -= (amount + fee);
      // Fix: Holding now has userId property
      const existing = this.holdings.find(h => h.symbol === stock.symbol && (h.userId === userId || !h.userId));
      if (existing) {
        existing.avgPrice = (existing.avgPrice * existing.quantity + amount) / (existing.quantity + quantity);
        existing.quantity += quantity;
      } else {
        this.holdings.push({
          userId,
          symbol: stock.symbol,
          name: stock.name,
          market: stock.market,
          quantity,
          avgPrice: price,
          currentPrice: stock.price
        });
      }
    } else if (type === 'SELL') {
      // Fix: Holding now has userId property
      const holding = this.holdings.find(h => h.symbol === stock.symbol && (h.userId === userId || !h.userId));
      if (!holding || holding.quantity < quantity) {
        this.addLog('TRADE', `交易失败: 账户 ${user.username} 持仓不足`, 'WARN');
        return { success: false, msg: '持仓不足' };
      }
      user.balance += (amount - fee);
      holding.quantity -= quantity;
      if (holding.quantity === 0) {
        this.holdings = this.holdings.filter(h => h !== holding);
      }
    }

    const trade: Trade = {
      id: 'T_' + Date.now().toString().substr(-8),
      userId,
      symbol: stock.symbol,
      name: stock.name,
      type,
      price,
      quantity,
      amount,
      timestamp: new Date(),
      status: 'COMPLETED'
    };

    this.trades.unshift(trade);
    this.addLog('TRADE', `指令成交: ${type} ${stock.name} ${quantity}股 @ ¥${price}`, 'OK');
    return { success: true, trade };
  }

  recharge(userId: string, amount: number) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.balance += amount;
      this.addLog('DB', `资产上分指令执行: ${user.username} +¥${amount.toLocaleString()}`, 'OK');
    }
  }

  withdraw(userId: string, amount: number) {
    const user = this.users.find(u => u.id === userId);
    if (user && user.balance >= amount) {
      user.balance -= amount;
      this.addLog('DB', `资产下分指令执行: ${user.username} -¥${amount.toLocaleString()}`, 'OK');
    }
  }

  createUser(username: string, role: UserAccount['role'], balance: number) {
    const newUser: UserAccount = {
      id: 'u_' + Math.random().toString(36).substr(2, 5),
      username,
      balance,
      totalAssets: balance,
      yesterdayProfit: 0,
      totalProfit: 0,
      role,
      status: 'ACTIVE',
      createTime: new Date()
    };
    this.users.push(newUser);
    this.addLog('SYS', `新主体准入: ${username} (LEVEL: ${role})`, 'OK');
    return newUser;
  }
}

// Toggle between MockDB and RealDB (production or when USE_REAL_DB=true)
const useReal = process.env.USE_REAL_DB === 'true' || process.env.NODE_ENV === 'production';

let dbInstance: any = new MockDB();

if (useReal) {
  // Start loading real DB in background; keep a mock instance available until ready
  import('./realClient').then(async (mod) => {
    try {
      await mod.ensureRealDbInitialized(process.env.MONGODB_URI || '');
      // Replace properties on the existing mock instance so references across app remain valid
      Object.assign(dbInstance, mod.realDb);
      console.log('✅ Switched to RealDB (MongoDB)');
    } catch (err) {
      console.error('Failed to initialize RealDB, continuing with MockDB:', err);
    }
  }).catch(err => {
    console.error('Failed to import realClient, continuing with MockDB:', err);
  });
}

export const db = dbInstance;
