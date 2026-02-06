/**
 * Seed script for MongoDB Atlas
 * Usage: MONGODB_URI="mongodb+srv://<user>:<pass>@.../galaxy_securities?retryWrites=true&w=majority" node scripts/seed-atlas.js
 */

const mongoose = require('mongoose');

const INITIAL_USERS = [
  { _id: 'admin_1', username: '银河主管理员 (SYS)', role: 'ADMIN', balance: 50000000.0, totalAssets: 50000000.0, totalProfit: 0, status: 'ACTIVE', createTime: new Date('2023-01-01'), updateTime: new Date() },
  { _id: 'op_101', username: '风控审计员_01', role: 'OPERATOR', balance: 1000000.0, totalAssets: 1000000.0, totalProfit: 0, status: 'ACTIVE', createTime: new Date('2023-05-20'), updateTime: new Date() },
  { _id: 'user_102', username: '龙腾资产管理中心', role: 'CLIENT', balance: 8500000.0, totalAssets: 12450000.0, totalProfit: 450000.0, status: 'ACTIVE', createTime: new Date('2023-06-12'), updateTime: new Date() }
];

const INITIAL_STOCKS = [
  { _id: '600519', symbol: '600519', name: '贵州茅台', market: 'CN', price: 1720.5, change: 12.3, changePercent: 0.72, volume: 1520000, lastSync: new Date() },
  { _id: '00700', symbol: '00700', name: '腾讯控股', market: 'HK', price: 382.4, change: -4.2, changePercent: -1.09, volume: 8540000, lastSync: new Date() },
  { _id: '000001', symbol: '000001', name: '平安银行', market: 'CN', price: 10.45, change: 0.12, changePercent: 1.16, volume: 45000000, lastSync: new Date() },
  { _id: '09988', symbol: '09988', name: '阿里巴巴-W', market: 'HK', price: 84.15, change: 1.25, changePercent: 1.51, volume: 12400000, lastSync: new Date() },
  { _id: '601318', symbol: '601318', name: '中国平安', market: 'CN', price: 42.15, change: -0.55, changePercent: -1.29, volume: 22000000, lastSync: new Date() },
  { _id: '03690', symbol: '03690', name: '美团-W', market: 'HK', price: 112.5, change: -2.1, changePercent: -1.83, volume: 9800000, lastSync: new Date() }
];

const INITIAL_HOLDINGS = [
  { _id: 'user_102_600519', userId: 'user_102', symbol: '600519', name: '贵州茅台', market: 'CN', quantity: 2000, avgPrice: 1650.0, lastUpdate: new Date() },
  { _id: 'user_102_00700', userId: 'user_102', symbol: '00700', name: '腾讯控股', market: 'HK', quantity: 5000, avgPrice: 340.5, lastUpdate: new Date() }
];

const INITIAL_TRADES = [
  { _id: 'T_20231124_001', userId: 'user_102', symbol: '600519', name: '贵州茅台', type: 'BUY', price: 1650.0, quantity: 2000, amount: 3301650.0, fee: 1650.0, status: 'COMPLETED', timestamp: new Date('2023-11-24T09:35:00') }
];

const INITIAL_LOGS = [
  { _id: 'L1', type: 'SYS', event: '银河虚拟核心引擎 V3.1 初始化完成', status: 'OK', time: new Date() },
  { _id: 'L2', type: 'DB', event: '镜像数据库快照挂载成功 (RAM_MODE)', status: 'OK', time: new Date() },
  { _id: 'L3', type: 'NET', event: '跨域行情网关建立连接 [GALAXY_NODE_SH]', status: 'OK', time: new Date() }
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERROR: Please set MONGODB_URI environment variable.');
    process.exit(1);
  }

  await mongoose.connect(uri, { dbName: 'galaxy_securities' });
  const db = mongoose.connection.db;
  console.log('Connected to', db.databaseName);

  // Ensure collections exist and insert seed data if empty
  const collections = await db.listCollections().toArray();
  const names = collections.map(c => c.name);

  if (!names.includes('virtual_users')) {
    await db.createCollection('virtual_users');
    console.log('Created collection virtual_users');
  }
  if (!names.includes('virtual_stocks')) {
    await db.createCollection('virtual_stocks');
    console.log('Created collection virtual_stocks');
  }
  if (!names.includes('virtual_holdings')) {
    await db.createCollection('virtual_holdings');
    console.log('Created collection virtual_holdings');
  }
  if (!names.includes('virtual_trades')) {
    await db.createCollection('virtual_trades');
    console.log('Created collection virtual_trades');
  }
  if (!names.includes('system_logs')) {
    await db.createCollection('system_logs');
    console.log('Created collection system_logs');
  }

  // Insert seed data if collections are empty
  async function seedIfEmpty(name, docs) {
    const count = await db.collection(name).countDocuments();
    if (count === 0) {
      await db.collection(name).insertMany(docs);
      console.log(`Seeded ${docs.length} documents into ${name}`);
    } else {
      console.log(`${name} already has ${count} documents, skipping seed`);
    }
  }

  await seedIfEmpty('virtual_users', INITIAL_USERS);
  await seedIfEmpty('virtual_stocks', INITIAL_STOCKS);
  await seedIfEmpty('virtual_holdings', INITIAL_HOLDINGS);
  await seedIfEmpty('virtual_trades', INITIAL_TRADES);
  await seedIfEmpty('system_logs', INITIAL_LOGS);

  // Create indexes
  await db.collection('virtual_users').createIndex({ username: 1 }, { unique: true });
  await db.collection('virtual_stocks').createIndex({ symbol: 1 }, { unique: true });
  await db.collection('virtual_trades').createIndex({ userId: 1, timestamp: -1 });
  await db.collection('virtual_holdings').createIndex({ userId: 1, symbol: 1 }, { unique: true });
  await db.collection('system_logs').createIndex({ time: -1 });

  console.log('Indexes ensured');
  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});