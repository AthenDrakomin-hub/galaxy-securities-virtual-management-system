
export interface ApiKey {
  id: string;
  clientName: string;
  apiKey: string;
  apiSecret: string;
  permissions: string[];
  status: 'ACTIVE' | 'REVOKED';
  createTime: Date;
}

export interface ApiTestResult {
  status: string;
  code: number;
  timestamp: number;
  data: any;
}
