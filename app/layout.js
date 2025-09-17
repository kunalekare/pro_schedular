import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/app/context/AuthContext';
import { DataProvider } from '@/app/context/DataContext';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SchedulerPro',
  description: 'Professional Automated Timetable Generator',
};

// This root layout wraps every page in the application.
export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning is a best practice for apps with theme toggles
    <html lang="en" suppressHydrationWarning>
       <body className={`${inter.className} bg-background text-text-primary dark:bg-gray-900 dark:text-gray-200`}>
        {/* All providers are wrapped here at the highest level */}
        <ThemeProvider>
          <AuthProvider>
            <DataProvider>
              {children}
              {/* This component enables professional pop-up notifications */}
              <Toaster position="bottom-right" />
            </DataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}