'use client';

import { useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import { DataContext } from '@/app/context/DataContext';
import { ThemeContext } from '@/app/context/ThemeContext';
import { Button } from '@/app/components/ui/Button';
import { Select } from '@/app/components/ui/Select';
import { LogOut, Bell, Loader2, Sun, Moon } from 'lucide-react';

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const { departmentList, activeDepartmentId, setActiveDepartment } = useContext(DataContext);
    // ✅ Get the simplified 'theme' and 'toggleTheme' function
    const { theme, toggleTheme } = useContext(ThemeContext);

    if (!departmentList || !theme) {
        return (
            <header className="bg-card dark:bg-gray-800 h-16 flex items-center justify-between px-6 border-b border-border">
                <div className="flex items-center gap-4 text-text-secondary dark:text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading data...</span>
                </div>
            </header>
        );
    }

    return (
        <header className="bg-card dark:bg-gray-800 dark:border-gray-700 h-16 flex items-center justify-between px-6 border-b border-border flex-shrink-0">
            {/* ====== Global Filters Section ====== */}
            <div className="flex items-center gap-4">
                <Select 
                    value={activeDepartmentId} 
                    onChange={(e) => setActiveDepartment(e.target.value)}
                    aria-label="Select Department"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    {departmentList.map(dept => (
                        <option key={dept.id} value={dept.id}>
                            Dept: {dept.name}
                        </option>
                    ))}
                </Select>

                <Select aria-label="Select Shift" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option>Shift: Morning</option>
                    <option>Shift: Evening</option>
                </Select>
            </div>
            
            {/* ====== User Profile & Actions Section ====== */}
            <div className="flex items-center gap-4">
                {/* --- ✅ THE SIMPLE THEME TOGGLE BUTTON --- */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? (
                        <Moon className="w-5 h-5" />
                    ) : (
                        <Sun className="w-5 h-5" />
                    )}
                </button>
                {/* ------------------------------------ */}

                <button className="p-2 rounded-full text-text-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Notifications">
                    <Bell className="w-5 h-5"/>
                </button>
                
                <div className="text-right">
                    <div className="font-semibold text-sm text-text-primary dark:text-gray-200">{user?.name}</div>
                    <div className="text-xs text-text-secondary dark:text-gray-400">{user?.role}</div>
                </div>

                <Button 
                    onClick={logout} 
                    variant="outline" 
                    className="!p-2 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700" 
                    aria-label="Logout"
                >
                    <LogOut className="w-5 h-5"/>
                </Button>
            </div>
        </header>
    );
}