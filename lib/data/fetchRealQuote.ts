
import { Stock } from '../../types/market';

/**
 * In a real scenario, this would call a real-time financial API (e.g., EastMoney, Sina Finance).
 * For this virtual system, it generates realistic fluctuations.
 */
export async function fetchRealQuote(symbol: string, market: 'CN' | 'HK'): Promise<Partial<Stock>> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Random fluctuation logic
  const volatility = (Math.random() - 0.5) * 0.4; // 0.4% max change
  
  return {
    symbol,
    market,
    changePercent: volatility * 10, // Scaled for display
    volume: Math.floor(Math.random() * 1000000)
  };
}
