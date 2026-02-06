import mongoose from 'mongoose';
import { INITIAL_USERS, INITIAL_STOCKS, INITIAL_HOLDINGS, INITIAL_TRADES, INITIAL_LOGS } from './seed';

// Minimal interfaces mirroring MockDB shape used around the app
type Role = 'ADMIN' | 'OPERATOR' | 'CLIENT';

interface UserAccount {
  id: string;
  username: string;
  balance: number;
  totalAssets: number;
  yesterdayProfit?: number;
  totalProfit: number;
  role: Role;
  status: string;
  createTime: Date;
}

interface Stock {
  _id?: string;
  symbol: string;
  name: string;
  market: 'CN' | 'HK';
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  lastSync?: Date;
}

interface Holding {
  _id?: string;
  userId: string;
  symbol: string;
  name: string;
  market: 'CN' | 'HK';
  quantity: number;
  avgPrice: number;
  lastUpdate?: Date;
}

interface Trade {
  id: string;
  userId: string;
  symbol: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  amount: number;
  timestamp: Date;
  status: string;
}

interface LogSchema {
  _id?: string;
  type: string;
  event: string;
  operatorId?: string;
  status: string;
  time: Date;
}

class RealDB {
  users: UserAccount[] = [];
  stocks: Stock[] = [];
  holdings: Holding[] = [];
  trades: Trade[] = [];
  logs: LogSchema[] = [];

  private db: any;

  async init(uri: string) {
    await mongoose.connect(uri, { dbName: 'galaxy_securities' });
    this.db = mongoose.connection.db;

    // Ensure collections exist and seed if empty
    const existing = await this.db.listCollections().toArray();
    const names = existing.map((c: any) => c.name);

    if (!names.includes('virtual_users')) await this.db.createCollection('virtual_users');
    if (!names.includes('virtual_stocks')) await this.db.createCollection('virtual_stocks');
    if (!names.includes('virtual_holdings')) await this.db.createCollection('virtual_holdings');
    if (!names.includes('virtual_trades')) await this.db.createCollection('virtual_trades');
    if (!names.includes('system_logs')) await this.db.createCollection('system_logs');

    // Seed if empty
    async function seedIfEmpty(name: string, docs: any[]) {
      const count = await mongoose.connection.db.collection(name).countDocuments();
      if (count === 0) {
        await mongoose.connection.db.collection(name).insertMany(docs);
      }
    }

    await seedIfEmpty('virtual_users', INITIAL_USERS as any);
    await seedIfEmpty('virtual_stocks', INITIAL_STOCKS as any);
    await seedIfEmpty('virtual_holdings', INITIAL_HOLDINGS as any);
    await seedIfEmpty('virtual_trades', INITIAL_TRADES as any);
    await seedIfEmpty('system_logs', INITIAL_LOGS as any);

    // Load into memory and map ids
    const usersDb = await this.db.collection('virtual_users').find().toArray();
    this.users = usersDb.map((u: any) => ({ id: u._id, username: u.username, balance: u.balance, totalAssets: u.totalAssets, yesterdayProfit: u.yesterdayProfit || 0, totalProfit: u.totalProfit || 0, role: u.role, status: u.status || 'ACTIVE', createTime: u.createTime }));

    const stocksDb = await this.db.collection('virtual_stocks').find().toArray();
    this.stocks = stocksDb.map((s: any) => ({ _id: s._id, symbol: s.symbol, name: s.name, market: s.market, price: s.price, change: s.change, changePercent: s.changePercent, volume: s.volume, lastSync: s.lastSync }));

    const holdingsDb = await this.db.collection('virtual_holdings').find().toArray();
    this.holdings = holdingsDb.map((h: any) => ({ _id: h._id, userId: h.userId, symbol: h.symbol, name: h.name, market: h.market, quantity: h.quantity, avgPrice: h.avgPrice, lastUpdate: h.lastUpdate }));

    const tradesDb = await this.db.collection('virtual_trades').find().toArray();
    this.trades = tradesDb.map((t: any) => ({ id: t._id, userId: t.userId, symbol: t.symbol, name: t.name, type: t.type, price: t.price, quantity: t.quantity, amount: t.amount, timestamp: t.timestamp, status: t.status }));

    const logsDb = await this.db.collection('system_logs').find().sort({ time: -1 }).limit(200).toArray();
    this.logs = logsDb;

    // Ensure indexes
    await this.db.collection('virtual_users').createIndex({ username: 1 }, { unique: true });
    await this.db.collection('virtual_stocks').createIndex({ symbol: 1 }, { unique: true });
    await this.db.collection('virtual_trades').createIndex({ userId: 1, timestamp: -1 });
    await this.db.collection('virtual_holdings').createIndex({ userId: 1, symbol: 1 }, { unique: true });
    await this.db.collection('system_logs').createIndex({ time: -1 });

    console.log('✅ RealDB initialized and loaded into memory');
  }

  addLog(type: LogSchema['type'], event: string, status: LogSchema['status'] = 'OK') {
    const log = { _id: 'L_' + Math.random().toString(36).substr(2, 5).toUpperCase(), type, event, time: new Date(), status };
    this.logs.unshift(log);
    if (this.logs.length > 200) this.logs.pop();
    // persist
    this.db.collection('system_logs').insertOne(log).catch(console.error);
  }

  async updateMarket() {
    // simulate small random changes
    this.stocks = this.stocks.map(s => {
      const vol = (Math.random() - 0.5) * 1.2;
      const newPrice = Math.max(0.01, s.price * (1 + vol / 100));
      return { ...s, price: Number(newPrice.toFixed(2)), change: Number((newPrice - (s.price / (1 + vol / 100))).toFixed(2)), changePercent: Number(vol.toFixed(2)) };
    });

    // sync holdings current price (not stored explicitly)
    // persist stocks
    const bulk = this.db.collection('virtual_stocks').initializeUnorderedBulkOp();
    this.stocks.forEach(s => {
      bulk.find({ _id: s._id }).upsert().replaceOne({ ...s });
    });
    if (this.stocks.length) await bulk.execute();
  }

  executeTrade(userId: string, symbol: string, type: 'BUY' | 'SELL' | 'IPO' | 'BLOCK' | 'LIMIT_UP', quantity: number, price: number) {
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
      const existing = this.holdings.find(h => h.symbol === stock.symbol && h.userId === userId);
      if (existing) {
        existing.avgPrice = (existing.avgPrice * existing.quantity + amount) / (existing.quantity + quantity);
        existing.quantity += quantity;
        this.db.collection('virtual_holdings').updateOne({ _id: existing._id }, { $set: existing }, { upsert: true }).catch(console.error);
      } else {
        const newHolding = { _id: `${userId}_${stock.symbol}`, userId, symbol: stock.symbol, name: stock.name, market: stock.market, quantity, avgPrice: price, lastUpdate: new Date() };
        this.holdings.push(newHolding);
        this.db.collection('virtual_holdings').insertOne(newHolding).catch(console.error);
      }
      this.db.collection('virtual_users').updateOne({ _id: user.id }, { $set: { balance: user.balance, totalAssets: user.totalAssets } }).catch(console.error);
    } else if (type === 'SELL') {
      const holding = this.holdings.find(h => h.symbol === stock.symbol && h.userId === userId);
      if (!holding || holding.quantity < quantity) {
        this.addLog('TRADE', `交易失败: 账户 ${user.username} 持仓不足`, 'WARN');
        return { success: false, msg: '持仓不足' };
      }
      user.balance += (amount - fee);
      holding.quantity -= quantity;
      if (holding.quantity === 0) {
        this.holdings = this.holdings.filter(h => h !== holding);
        this.db.collection('virtual_holdings').deleteOne({ _id: holding._id }).catch(console.error);
      } else {
        this.db.collection('virtual_holdings').updateOne({ _id: holding._id }, { $set: holding }).catch(console.error);
      }
      this.db.collection('virtual_users').updateOne({ _id: user.id }, { $set: { balance: user.balance, totalAssets: user.totalAssets } }).catch(console.error);
    }

    const trade = { id: 'T_' + Date.now().toString().substr(-8), userId, symbol: stock.symbol, name: stock.name, type, price, quantity, amount, timestamp: new Date(), status: 'COMPLETED' };
    this.trades.unshift(trade);
    this.db.collection('virtual_trades').insertOne({ _id: trade.id, userId: trade.userId, symbol: trade.symbol, name: trade.name, type: trade.type, price: trade.price, quantity: trade.quantity, amount: trade.amount, fee: 0, status: trade.status, timestamp: trade.timestamp }).catch(console.error);

    this.addLog('TRADE', `指令成交: ${type} ${stock.name} ${quantity}股 @ ¥${price}`, 'OK');
    return { success: true, trade };
  }

  recharge(userId: string, amount: number) {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.balance += amount;
      this.addLog('DB', `资产上分指令执行: ${user.username} +¥${amount.toLocaleString()}`, 'OK');
      this.db.collection('virtual_users').updateOne({ _id: user.id }, { $set: { balance: user.balance } }).catch(console.error);
    }
  }

  withdraw(userId: string, amount: number) {
    const user = this.users.find(u => u.id === userId);
    if (user && user.balance >= amount) {
      user.balance -= amount;
      this.addLog('DB', `资产下分指令执行: ${user.username} -¥${amount.toLocaleString()}`, 'OK');
      this.db.collection('virtual_users').updateOne({ _id: user.id }, { $set: { balance: user.balance } }).catch(console.error);
    }
  }

  createUser(username: string, role: UserAccount['role'], balance: number) {
    const newUser = { id: 'u_' + Math.random().toString(36).substr(2, 5), username, balance, totalAssets: balance, yesterdayProfit: 0, totalProfit: 0, role, status: 'ACTIVE', createTime: new Date() };
    this.users.push(newUser);
    const toInsert = { _id: newUser.id, username: newUser.username, role: newUser.role, balance: newUser.balance, totalAssets: newUser.totalAssets, totalProfit: newUser.totalProfit, status: newUser.status, createTime: newUser.createTime, updateTime: new Date() };
    this.db.collection('virtual_users').insertOne(toInsert).catch(console.error);
    this.addLog('SYS', `新主体准入: ${username} (LEVEL: ${role})`, 'OK');
    return newUser;
  }
}

export const realDb = new RealDB();

export async function ensureRealDbInitialized(uri: string) {
  await realDb.init(uri);
}
