
import { db } from '../mongodb/client';
import { ApiKey } from '../../types/integration';

export function generateApiKey(clientName: string, permissions: string[]): ApiKey {
  const newKey: ApiKey = {
    id: 'k_' + Math.random().toString(36).substr(2, 9),
    clientName,
    apiKey: 'gy_ak_' + Math.random().toString(16).substr(2, 8),
    apiSecret: 'gy_sec_' + Math.random().toString(16).repeat(4).substr(2, 32),
    permissions,
    status: 'ACTIVE',
    createTime: new Date()
  };

  // For this mock, we would push to a keys array in db
  db.addLog('SYS', `生成新 API 密钥: ${clientName}`, 'OK');
  return newKey;
}

export function revokeApiKey(keyId: string) {
  db.addLog('SYS', `注销 API 密钥 ID: ${keyId}`, 'WARN');
  return { success: true };
}
