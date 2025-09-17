'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/context/AuthContext';
import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import { Loader2 } from 'lucide-react';

/**
 * DashboardLayout
 * Provides a protected layout for all authenticated pages. It handles:
 * - Redirecting unauthenticated users to the login page.
 * - Displaying a loading state while checking user authentication.
 * - Wrapping all dashboard content with the persistent Sidebar and Header components.
 * - Applying theme-aware background colors for light and dark modes.
 */
export default function DashboardLayout({ children }) {
  // Get the current user and loading status from the authentication context.
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  // This effect runs to protect the route.
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // While checking authentication, show a professional loading spinner.
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-gray-900">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  // Once authenticated, render the full dashboard layout.
  return (
    <div className="flex h-screen bg-background text-text-primary dark:bg-gray-900 dark:text-gray-200">
      
      {/* Sidebar navigation component */}
      <Sidebar />

      {/* Main content area that will contain the pages */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Top navigation/header component */}
        <Header />

        {/* The scrollable area for the actual page content */}
        <main
          id="main-content"
          className="flex-1 overflow-x-hidden overflow-y-auto"
        >
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}