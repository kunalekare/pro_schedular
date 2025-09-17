'use client';
import { useContext, useState } from 'react';
import { AuthContext } from '@/app/context/AuthContext'; // Using path aliases is best practice
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { Select } from '@/app/components/ui/Select';
import { LogIn, Loader2, CalendarCheck2 } from 'lucide-react';

// A simple component for the social login buttons for cleaner code
function SocialButton({ icon, children }) {
  return (
    <Button variant="outline" className="w-full justify-center">
      {icon}
      {children}
    </Button>
  );
}

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [role, setRole] = useState('Scheduler');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true); // --- 1. Set loading state to true on submit

    // Simulate a network request
    setTimeout(() => {
      const user = { name: `${role} User`, role };
      login(user);
      router.push('/dashboard');
      // No need to set isLoading back to false as we are navigating away
    }, 1500); // 1.5 second delay
  };

  return (
    // The main container now uses a grid layout on larger screens (lg:)
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* ====== 1. The Branding Panel (Left Side) ====== */}
      <div className="hidden bg-gray-800 lg:flex flex-col items-center justify-center text-center p-12 text-white">
        <CalendarCheck2 className="w-20 h-20 text-primary" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight">SchedulerPro</h1>
        <p className="mt-4 text-lg text-gray-300">
          The intelligent solution for automated academic scheduling. Optimize resources, eliminate clashes, and build the perfect timetable in minutes.
        </p>
      </div>

      {/* ====== 2. The Form Panel (Right Side) ====== */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold text-text-primary">Welcome Back</h1>
            <p className="mt-2 text-text-secondary">Sign in to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" defaultValue="demo@scheduler.pro" required />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
              <Input id="password" type="password" defaultValue="password" required />
            </div>

            <div>
              <Label htmlFor="role">Login as</Label>
              <Select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                <option>Admin</option>
                <option>Scheduler</option>
                <option>Faculty</option>
              </Select>
            </div>

            <Button type="submit" className="w-full justify-center" disabled={isLoading}>
              {/* --- 2. Conditional rendering for the loading state --- */}
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <LogIn className="w-5 h-5 mr-2" />
              )}
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* ====== 3. Social Login Options ====== */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-text-secondary">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
              <SocialButton icon={<svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.1 512 0 398.9 0 256S110.1 0 244 0c73 0 134.3 29.3 179.3 74.5l-63.3 62.4C333.3 113.8 295.1 94.5 244 94.5c-93.7 0-170.3 76.6-170.3 170.5S150.3 425.5 244 425.5c102.3 0 145.9-77.8 149.9-118.8H244v-94.8h244c1.3 12.3 2.1 26.3 2.1 40.8z"></path></svg>}>
                  Google
              </SocialButton>
              <SocialButton icon={<svg className="mr-2 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3.3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 23.6 31.4 23.6 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>}>
                  GitHub
              </SocialButton>
          </div>

          <p className="mt-8 text-center text-sm text-text-secondary">
              Don&apos;t have an account?{" "}
              <a href="#" className="font-semibold leading-6 text-primary hover:underline">
                  Sign Up
              </a>
          </p>
        </div>
      </div>
    </div>
  );
}