import './globals.css';

import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';
import {
  Logo,
  SettingsIcon,
  EditIcon,
  UsersIcon,
  FolderIcon,
  TaskIcon,
} from '@/components/icons';
import { NavItem } from './nav-item';
import { is_authenticated, signOut } from '@/lib/authUtils';
import { Toaster } from '@/components/ui/toaster';
import { DashboardIcon, GlobeIcon } from '@radix-ui/react-icons';

import { LogoutButton } from '@/components/logout-button';
import { LoginButton } from '@/components/login-button';


export const metadata = {
  title: 'Diamond Admin Dashboard',
  description:
    'Diamond admin dashboard configured with Flask server backend, SQLite database, Next.js, Tailwind CSS, TypeScript, and Prettier.'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // const FLASK_URL = process.env.FLASK_URL;
  const isAuthenticated = await is_authenticated();

  return (
    <html lang="en" className="h-full bg-gray-50">
      <body>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-[60px] items-center border-b px-5">
                <Link
                  className="flex items-center gap-2 font-semibold"
                  href="/"
                >
                  <Logo />
                  <span className="">DIAMOND</span>
                </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                {isAuthenticated ? (
                  <nav className="grid items-start px-4 text-sm font-medium">
                    <NavItem href="/">
                      <DashboardIcon className="h-6 w-6" />
                      Dashboard
                    </NavItem>
                    <NavItem href="/image-builder">
                      <GlobeIcon className="h-6 w-6" />
                      Image Builder
                    </NavItem>
                    <NavItem href="/image-manager">
                      <FolderIcon className="h-6 w-6" />
                      Image Manager
                    </NavItem>
                    <NavItem href="/job-composer">
                      <EditIcon className="h-6 w-6" />
                      Job Composer
                    </NavItem>
                    <NavItem href="/task-manager">
                      <TaskIcon className="h-6 w-6" />
                      Task Manager
                    </NavItem>
                    <NavItem href="/users">
                      <UsersIcon className="h-6 w-6" />
                      Users
                    </NavItem>
                    <NavItem href="/settings">
                      <SettingsIcon className="h-6 w-6" />
                      Settings
                    </NavItem>
                  </nav>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 justify-between lg:justify-end">
              <Link
                className="flex items-center gap-2 font-semibold lg:hidden"
                href="/"
              >
                <Logo />
                <span className="">DIAMOND</span>
              </Link>

              {isAuthenticated ? <LogoutButton /> : <LoginButton />}

            </header>
            {children}
          </div>
          <Toaster />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
