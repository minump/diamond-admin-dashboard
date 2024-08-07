'use server';
import { cookies } from 'next/headers';

const HOST = process.env.HOST || 'http://diamond.localhost';
const NEXT_URL = process.env.NEXT_URL || 'http://diamond.localhost:3000';
const FLASK_URL = process.env.FLASK_URL || 'http://diamond.localhost:5328';

export async function is_authenticated() {
  const tokens = cookies().get('tokens');
  let sessionData = null;
  const headers: Record<string, string> = {};
  if (tokens) {
    // headers['Authorization'] = `Bearer ${tokens.value}`;
    headers['Content-Type'] = 'application/json';
    headers['Cookie'] = `tokens=${JSON.stringify(tokens)}`;
  }
  const resp = fetch(`${FLASK_URL}/api/is_authenticated`, {
    credentials: 'include', // Ensure cookies are sent with the request if needed
    headers: headers
  });
  const response = await resp;
  if (!response.ok) {
    if (response.status === 401) {
      sessionData = { is_authenticated: false };
    } else {
      throw new Error(
        `Failed to fetch session data: ${response.status} ${response.statusText}`
      );
    }
  } else {
    sessionData = await response.json();
  }
  return sessionData.is_authenticated;
}
