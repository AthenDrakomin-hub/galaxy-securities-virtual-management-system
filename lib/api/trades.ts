
export async function applyIPO(data: { userId: string, stockCode: string, quantity: number }) {
  const res = await fetch('/api/trades/ipo/apply', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function submitBlockTrade(data: { userId: string, symbol: string, amount: number, discount: number }) {
  const res = await fetch('/api/trades/block/trade', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function submitLimitUp(data: { userId: string, symbol: string, reserveAmount: number }) {
  const res = await fetch('/api/trades/limit-up/trade', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return res.json();
}
