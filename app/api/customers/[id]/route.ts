
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/mongodb/client';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = db.users.find(u => u.id === params.id);
  if (!user) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const index = db.users.findIndex(u => u.id === params.id);
  
  if (index === -1) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  // Update logic (partial)
  db.users[index] = { ...db.users[index], ...body };
  db.addLog('DB', `更新客户信息: ${db.users[index].username}`, 'OK');

  return NextResponse.json(db.users[index]);
}
