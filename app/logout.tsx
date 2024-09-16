'use client';

import { signOut } from '@/lib/authUtils';

export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await signOut();
      }}
      className="border-2 rounded-xl p-2 hover:bg-blue-800 hover:text-white cursor-pointer"
    >
      Logout
    </button>
  );
}
