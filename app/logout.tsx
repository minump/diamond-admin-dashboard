'use client'

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/authUtils';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
      router.refresh();  // Refresh the current route
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="border-2 rounded-xl p-2 hover:bg-blue-800 hover:text-white cursor-pointer"
    >
      {isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
}