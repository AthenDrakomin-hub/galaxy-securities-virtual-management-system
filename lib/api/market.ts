
import { Stock } from '../../types/market';

export async function getQuotes(): Promise<Stock[]> {
  const res = await fetch('/api/market/quotes');
  return res.json();
}
