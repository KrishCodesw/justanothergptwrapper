import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {prisma} from '@/lib/prismaClient'
import { COOKIE_NAME } from "@/lib/auth.utils";


export async function POST(req:Request){
    try{
       const cookieStore =await cookies();
    const token = cookieStore.get(COOKIE_NAME);;
        if(token){
            try{
                await prisma.session.delete({
                    where:{id:token.value}
                })
            }catch(error){
                            console.warn('Failed to delete session,might not exist ',error)
            }
        }
        (await cookies()).set(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Set to a past date
      path: '/',
      sameSite: 'lax',
    });
    return NextResponse.json({ message: 'Logged out' }, { status: 200 });

    }catch(error){
console.error('LOGOUT_ERROR', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

