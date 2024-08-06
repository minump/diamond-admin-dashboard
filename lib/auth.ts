import { NextRequest, NextResponse } from 'next/server';
import { is_authenticated } from './authUtils';

const NEXT_URL = process.env.NEXT_URL || 'http://localhost:3000';

function redirectToSignIn() {
  return NextResponse.redirect(NEXT_URL + '/sign-in');
}

const FLASK_URL = process.env.FLASK_URL || 'http://localhost:5328';

function signIn() {
  return NextResponse.redirect(`${FLASK_URL}/login`);
}

function signOut() {
  const response = NextResponse.redirect(`${FLASK_URL}/logout`);
  response.cookies.delete('tokens');
  return response;
}

async function auth(request: NextRequest) {
  // Always log incoming requests for debugging
  console.debug('authenticating... from auth.ts with ');

  // P1: Route to Globus login page if the URL starts with '/login'
  if (
    request.nextUrl.pathname.startsWith('/login') &&
    !request.cookies.get('tokens')
  ) {
    console.debug('Signing in...');
    return signIn();
  }

  // P2: Handle logout if the URL starts with '/logout'
  if (request.nextUrl.pathname.startsWith('/logout')) {
    console.debug('Signing out...');
    return signOut();
  }

  // P3: Check if the user is authenticated
  const isAuthenticated = await is_authenticated();
  console.debug('session in frontend: ', is_authenticated);
  console.debug('request url: ', request.nextUrl.pathname);

  // P4: Redirect to profile if authenticated and URL starts with '/profile'
  if (isAuthenticated && request.nextUrl.pathname.startsWith('/profile')) {
    console.debug('Redirecting to profile...');
    return NextResponse.redirect(request.nextUrl.origin);
  }

  // P5: Redirect to Sign-in if not authenticated and URL is not '/login'
  if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/login')) {
    console.debug('Redirecting to Sign in...');
    return redirectToSignIn();
  }

  // P6: Proceed to the requested route if all conditions are met
  console.log('NextResponse.next()');
  return NextResponse.next();
}

export { auth, signIn, signOut };
