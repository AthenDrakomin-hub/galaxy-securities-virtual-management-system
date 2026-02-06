
export async function getSystemLogs() {
  const res = await fetch('/app/api/system/logs');
  return res.json();
}

export async function updateSystemSettings(settings: any) {
  const res = await fetch('/app/api/system/settings', {
    method: 'POST',
    body: JSON.stringify(settings)
  });
  return res.json();
}

export async function fundOperation(userId: string, type: 'RECHARGE' | 'WITHDRAW', amount: number) {
  const endpoint = type === 'RECHARGE' ? 'recharge' : 'withdraw';
  const res = await fetch(`/api/system/users/${userId}/${endpoint}`, {
    method: 'POST',
    body: JSON.stringify({ amount })
  });
  return res.json();
}
