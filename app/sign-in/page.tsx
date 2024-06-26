import Link from 'next/link';

export default function SignInPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        height: '100%',
        flexDirection: 'column'
      }}
    >
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
    </div>
  );
}
