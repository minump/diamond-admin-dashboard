import Link from 'next/link';
import { fetchSessionData } from '@/lib/utils';

export default function SignInPage() {
  const sessionData = fetchSessionData();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'row'
      }}
    >
      {sessionData.primaryIdentity.length > 0 ? (
        <div className={'p-4 text-green-500'}>
          You are logged in
        </div>
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
  );
}
