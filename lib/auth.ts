import { NextRequest } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

export async function auth(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId));

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}