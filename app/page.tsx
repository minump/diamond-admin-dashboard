'use client';
import { getUsers } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { getOAuth2UrlAndLogin } from "@/lib/taskHandlers";


const AuthenticateButton = () => {
  const handleAuthenticate = async () => {
    const { url, state } = await getOAuth2UrlAndLogin();
    console.log(url);
    // Additional logic for handling authentication
  };

  return <Button onClick={handleAuthenticate}>Authenticate</Button>;
};


export default async function DashboardPage({
  searchParams
}: {
  searchParams: { q: string; offset: string };
}) {

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Users</h1>
      </div>
      <AuthenticateButton />
      <div className="w-full mb-4">
        {/* <Search value={searchParams.q} /> */}
        <h1>Dashboard</h1>
      </div>
      {/* <UsersTable users={users} offset={newOffset} /> */}
      <h2> I want to show user's recent jobs information</h2>
    </main>
  );
}
