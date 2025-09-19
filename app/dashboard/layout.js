/**
 * @file app/dashboard/layout.js
 * @description Provides a protected, animated layout for all authenticated dashboard pages.
 * This version contains the definitive fix for the unnecessary scrolling issue.
 * @version 2.2.0
 */

'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { AuthContext } from '@/app/context/AuthContext';
import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden min-h-0">
        
        <Header />

        {/* ✅ THE DEFINITIVE FIX:
            The <main> element is now ONLY responsible for scrolling and theming.
            A new inner <div> handles all the padding. This is a more robust
            pattern that prevents browser height calculation bugs.
        */}
        <motion.main
          id="main-content"
          className="flex-1 overflow-y-auto bg-background text-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 md:p-8">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}

