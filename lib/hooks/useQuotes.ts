
import { useState, useEffect } from 'react';
import { db } from '../lib/mongodb/client';
import { Stock } from '../../types/market';

export const useQuotes = (interval: number = 5000) => {
  const [stocks, setStocks] = useState<Stock[]>([...db.stocks]);

  useEffect(() => {
    const timer = setInterval(() => {
      db.updateMarket();
      setStocks([...db.stocks]);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return stocks;
};
