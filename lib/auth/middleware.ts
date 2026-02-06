
import { db } from '../mongodb/client';

/**
 * Simulated authentication middleware for the virtual management system.
 * Checks if the current session (simulated via db.users[0]) has the required role.
 */
export async function authenticate(requiredRole?: 'ADMIN' | 'OPERATOR' | 'CLIENT') {
  // In a real application, this would verify a JWT or session cookie.
  const currentUser = db.users[0]; 

  if (!currentUser) {
    return { authenticated: false, reason: 'SESSION_EXPIRED' };
  }

  if (requiredRole) {
    const roles = ['CLIENT', 'OPERATOR', 'ADMIN'];
    const userRank = roles.indexOf(currentUser.role);
    const requiredRank = roles.indexOf(requiredRole);

    if (userRank < requiredRank) {
      return { authenticated: false, reason: 'INSUFFICIENT_PERMISSIONS' };
    }
  }

  return { authenticated: true, user: currentUser };
}
