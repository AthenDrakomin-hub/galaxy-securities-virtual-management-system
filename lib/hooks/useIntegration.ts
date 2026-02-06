
'use client';

import { useState, useEffect } from 'react';
import { ApiKey } from '../../types/integration';
import { fetchApiKeys, createNewApiKey, toggleApiKeyStatus } from '../api/integration';

export function useIntegration() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshKeys = async () => {
    setLoading(true);
    try {
      const keys = await fetchApiKeys();
      setApiKeys(keys);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshKeys();
  }, []);

  const createKey = async (name: string, perms: string[]) => {
    const newKey = await createNewApiKey(name, perms);
    setApiKeys(prev => [newKey, ...prev]);
    return newKey;
  };

  const toggleStatus = async (id: string) => {
    try {
      const updatedKey = await toggleApiKeyStatus(id);
      setApiKeys(prev => prev.map(k => k.id === id ? updatedKey : k));
      return updatedKey;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return { apiKeys, loading, refreshKeys, createKey, toggleStatus };
}
