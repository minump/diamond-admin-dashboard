import { NextRequest, NextResponse } from 'next/server';

function signIn() {
  return NextResponse.redirect('http://localhost:5328/login');
}

function signOut() {
  return NextResponse.redirect('http://localhost:5328/logout');
}

function auth(request: NextRequest) {
  const sessionCookie = request.cookies.get('primary_identity');
  console.log('session in frontend: ', sessionCookie);

  if (sessionCookie && request.nextUrl.pathname.startsWith('/logout')) {
    return signOut();
  }

  if (sessionCookie && request.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(request.nextUrl.origin);
  }

  if (!sessionCookie || request.nextUrl.pathname.startsWith('/login')) {
    console.log('Signing in...');
    return signIn();
  }

  return NextResponse.next();
}

export { auth, signIn, signOut };
