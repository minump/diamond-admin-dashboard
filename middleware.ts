import { NextRequest, NextResponse } from 'next/server';
// import { signIn } from './lib/auth';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session_cookie');

  // Check if the session cookie is not present and the path is not related to auth
  if (!sessionCookie && !request.nextUrl.pathname.startsWith('/api')) {
    // signIn();
    NextResponse.redirect('http://localhost:5328/login');
  }

  return NextResponse.next();
}

// Configuration to apply middleware to all routes except specified
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};