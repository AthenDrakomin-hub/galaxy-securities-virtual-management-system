
import { UserSchema, StockSchema, TradeSchema, HoldingSchema, LogSchema } from './schema';

/**
 * 初始化种子数据 - 模拟银河证券预置状态
 */

export const INITIAL_USERS: UserSchema[] = [
  {
    _id: 'admin_1',
    username: '银河主管理员 (SYS)',
    role: 'ADMIN',
    balance: 50000000.00,
    totalAssets: 50000000.00,
    totalProfit: 0,
    status: 'ACTIVE',
    createTime: new Date('2023-01-01'),
    updateTime: new Date()
  },
  {
    _id: 'op_101',
    username: '风控审计员_01',
    role: 'OPERATOR',
    balance: 1000000.00,
    totalAssets: 1000000.00,
    totalProfit: 0,
    status: 'ACTIVE',
    createTime: new Date('2023-05-20'),
    updateTime: new Date()
  },
  {
    _id: 'user_102',
    username: '龙腾资产管理中心',
    role: 'CLIENT',
    balance: 8500000.00,
    totalAssets: 12450000.00,
    totalProfit: 450000.00,
    status: 'ACTIVE',
    createTime: new Date('2023-06-12'),
    updateTime: new Date()
  }
];

export const INITIAL_STOCKS: StockSchema[] = [
  { _id: '600519', symbol: '600519', name: '贵州茅台', market: 'CN', price: 1720.50, change: 12.3, changePercent: 0.72, volume: 1520000, lastSync: new Date() },
  { _id: '00700', symbol: '00700', name: '腾讯控股', market: 'HK', price: 382.40, change: -4.2, changePercent: -1.09, volume: 8540000, lastSync: new Date() },
  { _id: '000001', symbol: '000001', name: '平安银行', market: 'CN', price: 10.45, change: 0.12, changePercent: 1.16, volume: 45000000, lastSync: new Date() },
  { _id: '09988', symbol: '09988', name: '阿里巴巴-W', market: 'HK', price: 84.15, change: 1.25, changePercent: 1.51, volume: 12400000, lastSync: new Date() },
  { _id: '601318', symbol: '601318', name: '中国平安', market: 'CN', price: 42.15, change: -0.55, changePercent: -1.29, volume: 22000000, lastSync: new Date() },
  { _id: '03690', symbol: '03690', name: '美团-W', market: 'HK', price: 112.50, change: -2.10, changePercent: -1.83, volume: 9800000, lastSync: new Date() }
];

export const INITIAL_HOLDINGS: HoldingSchema[] = [
  { _id: 'user_102_600519', userId: 'user_102', symbol: '600519', name: '贵州茅台', market: 'CN', quantity: 2000, avgPrice: 1650.00, lastUpdate: new Date() },
  { _id: 'user_102_00700', userId: 'user_102', symbol: '00700', name: '腾讯控股', market: 'HK', quantity: 5000, avgPrice: 340.50, lastUpdate: new Date() }
];

export const INITIAL_TRADES: TradeSchema[] = [
  {
    _id: 'T_20231124_001',
    userId: 'user_102',
    symbol: '600519',
    name: '贵州茅台',
    type: 'BUY',
    price: 1650.00,
    quantity: 2000,
    amount: 3301650.00,
    fee: 1650.00,
    status: 'COMPLETED',
    timestamp: new Date('2023-11-24T09:35:00')
  }
];

export const INITIAL_LOGS: LogSchema[] = [
  { _id: 'L1', type: 'SYS', event: '银河虚拟核心引擎 V3.1 初始化完成', status: 'OK', time: new Date() },
  { _id: 'L2', type: 'DB', event: '镜像数据库快照挂载成功 (RAM_MODE)', status: 'OK', time: new Date() },
  { _id: 'L3', type: 'NET', event: '跨域行情网关建立连接 [GALAXY_NODE_SH]', status: 'OK', time: new Date() }
];
