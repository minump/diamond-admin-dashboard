import { is_authenticated } from '@/lib/authUtils';
import Link from 'next/link';

export default async function SignInPage() {
  const isAuthenticated = await is_authenticated();
  console.debug('isAuthenticated on SignIn Page:', isAuthenticated);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column'
      }}
    >
      {isAuthenticated ? (
        <div className={'p-4 text-green-500'}>You are logged in</div>
      ) : (
        <>
          <div
            className={
              'border-2 rounded-xl p-2 hover:bg-blue-800 hover:text-white cursor-pointer'
            }
          >
            <Link href={'login'}> Sign In</Link>
          </div>
          <div className={'p-4 text-red-500'}>
            Please sign in before using the app
          </div>
        </>
      )}
    </div>
  );
}
