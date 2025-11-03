// app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismaClient';
import { hashPassword } from '@/lib/auth.utils';
import { AuthProvider, UserStatus } from '@/lib/generated/prisma/enums';
export async function POST(req: Request) {
  try {
    const { email, fullName, password } = await req.json();

    if (!email || !fullName || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 } // 409 Conflict
      );
    }

    // 2. Hash password
    const password_hash = await hashPassword(password);

    // 3. Create User and Account in a transaction
    await prisma.$transaction(async (tx: any) => {
      const newUser = await tx.user.create({
        data: {
          email,
          full_name: fullName,
          status: UserStatus.PENDING_VERIFICATION, // Or 'ACTIVE' if you don't do email verification
        },
      });

      await tx.account.create({
        data: {
          userId: newUser.id,
          provider: AuthProvider.EMAIL_PASSWORD,
          providerId: email, // Using email as the lookup ID for this provider
          provider_user_id: email, // Using email as the "unique ID" for this provider
          password_hash: password_hash,
        },
      });
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('SIGNUP_ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}