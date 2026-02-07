import { NextResponse } from 'next/server';
import { db } from '../../../../../lib/mongodb/client';

interface RouteParams {
  params: {
    userId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { userId } = params;
  const user = db.users.find(u => u.id === userId);
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  return NextResponse.json(user);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { userId } = params;
  const body = await request.json();
  
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Update user with provided fields
  db.users[userIndex] = { ...db.users[userIndex], ...body };
  
  return NextResponse.json(db.users[userIndex]);
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { userId } = params;
  
  const userIndex = db.users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // In a real system, we might soft delete or archive the user
  // For this mock system, we'll just remove from the array
  const deletedUser = db.users[userIndex];
  db.users.splice(userIndex, 1);
  
  return NextResponse.json({ message: 'User deleted', user: deletedUser });
}