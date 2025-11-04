// app/api/auth/me/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {prisma} from '@/lib/prismaClient';
import { COOKIE_NAME } from '@/lib/auth.utils';

export async function GET(req: Request) {
  try {
    // 1. Get the session token from the cookie
     const cookieStore =await cookies();
    const token = cookieStore.get(COOKIE_NAME);;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 2. Find the session in the database
    const session = await prisma.session.findUnique({
      where: { id: token.value },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            full_name: true,
            status: true,
          },
        },
      },
    });

    // 3. Check if session is valid or expired
    if (!session || session.expires_at < new Date()) {
      return NextResponse.json({ error: 'Session invalid' }, { status: 401 });
    }

    // 4. Return the user data (excluding sensitive info)
    return NextResponse.json(session.user, { status: 200 });

  } catch (error) {
    console.error('ME_ROUTE_ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}