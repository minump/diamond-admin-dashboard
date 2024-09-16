import { LoginButton } from '@/components/login-button';
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
          <LoginButton />
          <div className={'p-4 text-red-500'}>
            Please sign in before using the app
          </div>
        </>
      )}
    </div>
  );
}
