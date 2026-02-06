
import { useState, useEffect } from 'react';
import { db } from '../lib/mongodb/client';
import { UserAccount } from '../../types/user';

export const useAuth = () => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking session/token
    const admin = db.users[0];
    if (admin) {
      setUser(admin);
    }
    setLoading(false);
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  return { user, loading, isAdmin };
};
