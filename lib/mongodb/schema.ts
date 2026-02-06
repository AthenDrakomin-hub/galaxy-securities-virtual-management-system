
/**
 * 银河证券虚拟管理系统 - 数据库结构定义 (MongoDB Schema)
 * 
 * 集合清单:
 * 1. virtual_users: 系统主体与权限
 * 2. virtual_stocks: 实时行情镜像
 * 3. virtual_trades: 交易指令全量日志
 * 4. virtual_holdings: 资产持仓聚合表
 * 5. system_logs: 核心审计日志
 */

export interface UserSchema {
  _id: string;             // UID
  username: string;        // 账户名
  role: 'ADMIN' | 'OPERATOR' | 'CLIENT'; // 权限级别
  balance: number;         // 现金余额
  totalAssets: number;     // 总资产 (实时对账结果)
  totalProfit: number;     // 累计盈亏
  status: 'ACTIVE' | 'DISABLED';
  createTime: Date;
  updateTime: Date;
}

export interface StockSchema {
  _id: string;             // 证券代码 (e.g., "600519")
  symbol: string;          // 代码
  name: string;            // 简称
  market: 'CN' | 'HK';     // 市场标识
  price: number;           // 最新镜像价
  change: number;          // 涨跌额
  changePercent: number;   // 涨跌幅
  volume: number;          // 成交量 (虚拟)
  lastSync: Date;          // 最后镜像对账时间
}

export interface TradeSchema {
  _id: string;             // 指令 ID (e.g., "T_20231124_001")
  userId: string;          // 主体 UID
  symbol: string;          // 证券代码
  name: string;            // 证券简称
  type: 'BUY' | 'SELL' | 'IPO' | 'BLOCK' | 'LIMIT_UP'; // 业务类型
  price: number;           // 成交均价
  quantity: number;        // 成交数量
  amount: number;          // 成交总额 (含规费)
  fee: number;             // 模拟规费
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  timestamp: Date;         // 撮合完成时间
}

export interface HoldingSchema {
  _id: string;             // userId + symbol 复合键
  userId: string;          // 主体 UID
  symbol: string;
  name: string;
  market: 'CN' | 'HK';
  quantity: number;        // 持股数量
  avgPrice: number;        // 成本均价
  lastUpdate: Date;
}

export interface LogSchema {
  _id: string;
  type: 'SYS' | 'AUTH' | 'TRADE' | 'DB' | 'NET' | 'WARN';
  event: string;           // 事件描述
  operatorId?: string;     // 操作员 ID
  status: 'OK' | 'WARN' | 'ERROR';
  time: Date;
}
