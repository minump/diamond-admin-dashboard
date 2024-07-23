import { NextRequest, NextResponse } from 'next/server';

const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5328';

function signIn() {
  return NextResponse.redirect(`${FLASK_URL}/login`);
}

function signOut() {
  return NextResponse.redirect(`${FLASK_URL}//logout`);
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
