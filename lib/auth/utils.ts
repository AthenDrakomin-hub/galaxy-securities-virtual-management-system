
import { UserAccount } from '../../types/user';

export function checkPermissions(user: UserAccount, requiredRole: string): boolean {
  const roles = ['CLIENT', 'OPERATOR', 'ADMIN'];
  const userRank = roles.indexOf(user.role);
  const requiredRank = roles.indexOf(requiredRole);
  return userRank >= requiredRank;
}

export function validateSessionToken(token: string): boolean {
  // In a real app, verify JWT here
  return token === 'MOCK_ADMIN_TOKEN';
}
