
import { db } from '../mongodb/client';

export async function rechargeUser(userId: string, amount: number) {
  db.recharge(userId, amount);
  return { success: true };
}

export async function withdrawUser(userId: string, amount: number) {
  db.withdraw(userId, amount);
  return { success: true };
}
