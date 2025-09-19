/**
 * @file Header.js
 * @description A professional, responsive application header.
 * It includes global filters, user actions, and a new user dropdown menu with an icon.
 * @version 2.6.0
 */

'use client';

import React, { useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import { DataContext } from '@/app/context/DataContext';
import { ThemeContext } from '@/app/context/ThemeContext';

// --- UI Component Imports ---
import { Button } from '@/app/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/Select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/DropdownMenu";
import { Skeleton } from '@/app/components/ui/Skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/Tooltip';

// --- Icon Imports ---
import { LogOut, Bell, Sun, Moon, User } from 'lucide-react'; // ✅ Added User icon

/**
 * Renders a skeleton version of the header for loading states.
 */
const HeaderSkeleton = () => (
  <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-48" />
    </div>
    <div className="flex items-center gap-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
  </header>
);

/**
 * The main application header component.
 */
export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { departmentList, activeDepartmentId, setActiveDepartment } = useContext(DataContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  if (!departmentList || !user || !theme) {
    return <HeaderSkeleton />;
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
      <TooltipProvider delayDuration={100}>
        {/* ====== Global Filters Section ====== */}
        <div className="flex items-center gap-4">
          <Select onValueChange={setActiveDepartment} value={activeDepartmentId}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-64" aria-label="Select Department">
                  <span className="font-semibold mr-1">Dept:</span> <SelectValue placeholder="Select Department" />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>Select a department to view its data</TooltipContent>
            </Tooltip>
            <SelectContent>
              {departmentList.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ====== User Actions & Profile Section ====== */}
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">View notifications</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          
          {/* ✅ NEW: Professional User Dropdown Menu */}
          <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <User className="h-6 w-6" />
                                <span className="sr-only">Toggle user menu</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>User Profile</TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </TooltipProvider>
    </header>
  );
}