// app/api/auth/signin/route.ts

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prismaClient';
import { comparePassword, getSessionExpiry, COOKIE_NAME } from '@/lib/auth.utils';
import { AuthProvider } from '@/lib/generated/prisma/enums';
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 1. Find the EMAIL_PASSWORD account
    const account = await prisma.account.findUnique({
      where: {
        provider_provider_user_id: {
          provider: AuthProvider.EMAIL_PASSWORD,
          provider_user_id: email,
        },
      },
    });

    if (!account || !account.password_hash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Verify hash
    const isPasswordValid = await comparePassword(
      password,
      account.password_hash
    );

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Create Session
    const expires_at = getSessionExpiry();
    const session = await prisma.session.create({
      data: {
        userId: account.userId,
        expires_at: expires_at,
        // You can add ip_address and user_agent from 'req' headers here
      },
    });

    // 4. Set the session cookie
    (await cookies()).set(COOKIE_NAME, session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expires_at,
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ message: 'Sign in successful' }, { status: 200 });
  } catch (error) {
    console.error('SIGNIN_ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}