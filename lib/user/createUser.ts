
import { db } from '../mongodb/client';
import { UserAccount } from '../../types/user';

export async function createNewAccount(username: string, role: UserAccount['role'], initialBalance: number) {
  if (!username) throw new Error('Username is required');
  if (initialBalance < 0) throw new Error('Initial balance cannot be negative');
  
  const user = db.createUser(username, role, initialBalance);
  return { success: true, user };
}
