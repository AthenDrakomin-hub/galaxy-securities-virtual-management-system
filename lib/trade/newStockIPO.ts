
import { db } from '../mongodb/client';

export async function applyForIPO(userId: string, stockCode: string, quantity: number) {
  const user = db.users.find(u => u.id === userId);
  if (!user) throw new Error('User not found');

  // Simple logic: IPO price is fixed in constants or mock data
  // For this mock, we'll assume success if they have enough balance
  const price = 10.00; // Default IPO price for mock
  const amount = price * quantity;

  if (user.balance < amount) {
    throw new Error('Insufficient balance for IPO application');
  }

  db.addLog('TRADE', `用户 ${user.username} 提交新股申购: ${stockCode}, 数量: ${quantity}`, 'OK');
  
  return {
    success: true,
    applicationId: 'IPO_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    status: 'PENDING'
  };
}
