'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUsers } from '@/lib/db';
import { fetchSessionData } from '@/lib/utils';


export default function DashboardPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const sessionData = fetchSessionData();
    if (sessionData.primaryIdentity) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      <div
        style={{
          display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'row'
        }}
      >
      {isAuthenticated ? (
        <>
          <div className={'p-4 text-green-500'}>
            You are logged in
          </div>
          <div
            className={
              'border-2 rounded-xl p-2 hover:bg-blue-800 hover:text-white cursor-pointer'
            }
          >
            <Link href={'logout'}> Logout</Link>
          </div>
        </>
      ) : (
        <>
          <div className={'p-4 text-red-500'}>
            Please sign in before using the app
          </div>
          <div
            className={
              'border-2 rounded-xl p-2 hover:bg-blue-800 hover:text-white cursor-pointer'
            }
          >
            <Link href={'login'}> Sign In With Globus</Link>
          </div>
        </>
      )}
    
    </div>
    <main className="flex flex-1 flex-col p-4 md:p-6">
      
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Dashboard</h1>
      </div>
      <div className="w-full mb-4">
        {/* <Search value={searchParams.q} /> */}
        <h1>Dashboard</h1>
      </div>
      <div className="w-full mb-4">
        <h2> {isAuthenticated ? 'You have been authenticated!' : 'You are not authenticated'}</h2>
      </div>
      {/* <UsersTable users={users} offset={newOffset} /> */}
      {/* <h2> I want to show user's recent jobs information</h2> */}
    </main>
    </>

  );
}
