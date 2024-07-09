import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.endsWith('/login') ||
    request.nextUrl.pathname.endsWith('/logout')
  ) {
    return auth(request);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
