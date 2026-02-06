
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

export type FundOperationType = 'RECHARGE' | 'WITHDRAW';

export interface FundOperationRecord {
  id: string;
  userId: string;
  type: FundOperationType;
  amount: number;
  operatorId: string;
  remark: string;
  timestamp: Date;
}
