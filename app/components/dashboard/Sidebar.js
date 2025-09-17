'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  Home,
  Database,
  Settings,
  SlidersHorizontal,
  LayoutGrid,
  Menu,
  X,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home, roles: ['Admin', 'Scheduler', 'Faculty'] },
    { href: '/dashboard/management', label: 'Data Management', icon: Database, roles: ['Admin', 'Scheduler'] },
    { href: '/dashboard/constraints', label: 'Constraints', icon: SlidersHorizontal, roles: ['Admin', 'Scheduler'] },
    { href: '/dashboard/generator', label: 'Generator', icon: LayoutGrid, roles: ['Admin', 'Scheduler', 'Faculty'] },
    { href: '/dashboard/settings', label: 'Settings & Export', icon: Settings, roles: ['Admin'] },
  ];

  if (!user) {
    return (
      <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col p-6">
        <div className="text-lg font-semibold">Loading...</div>
      </aside>
    );
  }

  return (
    <aside
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-800 text-white flex flex-col transition-all duration-300 flex-shrink-0`}
    >
      {/* Brand + toggle */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        <span className="text-xl font-bold tracking-wide">
          {isOpen ? 'SchedulerPro' : 'SP'}
        </span>
        <button
          className="lg:hidden p-1 rounded-md hover:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems
          .filter((item) => item.roles.includes(user.role))
          .map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
      </nav>

      {/* Footer: User info */}
      <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
        <div className="font-semibold text-white">{user.name}</div>
        <div>{user.role}</div>
      </div>
    </aside>
  );
}
