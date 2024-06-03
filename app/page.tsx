import { getUsers } from '@/lib/db';
import { AuthenticateButton } from '@/components/ui/authenticateButton';
import { Button } from '@/components/ui/button';

import { getOAuth2UrlAndLogin } from "@/lib/taskHandlers"

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {

  const handleClick = async () => {
    const { url, state } = await getOAuth2UrlAndLogin();
    window.location.href = url;
  };

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Users</h1>
      </div>
      <AuthenticateButton onClick={handleClick}>Authenticate</AuthenticateButton>
      <div className="w-full mb-4">
        {/* <Search value={searchParams.q} /> */}
        <h1>Dashboard</h1>
      </div>
      {/* <UsersTable users={users} offset={newOffset} /> */}
      <h2> I want to show user's recent jobs information</h2>
    </main>
  );
}
