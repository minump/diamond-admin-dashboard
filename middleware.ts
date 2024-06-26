import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';

export function middleware(request: NextRequest) {
  return auth(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
