

import { NextResponse } from 'next/server';

export async function GET(req: Request) {

  const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/google`;

  redirectUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
  redirectUrl.searchParams.set('redirect_uri', redirectUri);
  redirectUrl.searchParams.set('response_type', 'code');
  redirectUrl.searchParams.set(
    'scope',
    'openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
  );
  redirectUrl.searchParams.set('access_type', 'offline');
  redirectUrl.searchParams.set('prompt', 'consent'); // Forces refresh token

  return NextResponse.redirect(redirectUrl);
}