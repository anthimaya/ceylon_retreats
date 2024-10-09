import { NextResponse } from 'next/server';
import { db } from '@/db';
import { retreats } from '@/db/schema';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const allRetreats = await db.select().from(retreats);
    return NextResponse.json(allRetreats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while fetching retreats.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await auth(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, location, duration, description, website } = await req.json();

    const [retreat] = await db.insert(retreats).values({
      name,
      location,
      duration,
      description,
      website,
      userId: user.id,
    }).returning();

    return NextResponse.json(retreat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while creating the retreat.' }, { status: 500 });
  }
}