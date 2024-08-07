import React from 'react';
import { cookies } from 'next/headers';
import { is_authenticated } from '@/lib/authUtils';

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {
  const isAuthenticated = await is_authenticated();
  const tokens = cookies().get('tokens');
  let extractedTokens = null;
  if (tokens) {
    try {
      const unescapedTokens = tokens.value.replace(/\\054/g, ',');
      extractedTokens = JSON.parse(unescapedTokens);
    } catch (error) {
      console.error('Error parsing tokens:', error);
    }
  }
  console.log('Extracted Tokens:', extractedTokens);
  return (
    <>
      <main className="flex flex-1 flex-col p-4 md:p-6">
        <div className="flex items-center mb-8">
          <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
        </div>
        <div className="w-full mb-4">
          {/* <Search value={searchParams.q} /> */}
          {/* <h1>Dashboard</h1> */}
        </div>
        <div className="w-full mb-4">
          <h2>
            {' '}
            {isAuthenticated ? (
              <div>
                <p>Here are your tokens:</p>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {extractedTokens}
                </pre>
              </div>
            ) : (
              'You are not authenticated'
            )}
          </h2>
          {/* <h2> I want to show user's recent jobs information</h2> */}
        </div>
        {/* <UsersTable users={users} offset={newOffset} /> */}
        {/* <h2> I want to show user's recent jobs information</h2> */}
      </main>
    </>
  );
}
