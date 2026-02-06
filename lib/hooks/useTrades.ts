
import { useState, useEffect } from 'react';
import { db } from '../mongodb/client';
import { Trade } from '../../types/trade';

export const useTrades = (userId?: string) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be a fetch call
    const data = userId 
      ? db.trades.filter(t => t.userId === userId) 
      : db.trades;
    
    setTrades([...data]);
    setLoading(false);

    // Refresh every 10s to see new simulated trades
    const timer = setInterval(() => {
      const updated = userId 
        ? db.trades.filter(t => t.userId === userId) 
        : db.trades;
      setTrades([...updated]);
    }, 10000);

    return () => clearInterval(timer);
  }, [userId]);

  return { trades, loading };
};
