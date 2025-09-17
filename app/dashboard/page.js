'use client';

import { useContext } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import { DataContext } from '@/app/context/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/Card';
import { Users, Book, Building, School, Loader2 } from 'lucide-react';

/**
 * DashboardPage
 * Provides a dynamic, department-specific overview of institutional data.
 * It reads the active department from the DataContext and updates automatically.
 */
export default function DashboardPage() {
    const { user } = useContext(AuthContext);
    // Get the new, department-specific data from the context
    const { activeDepartmentData, globalData } = useContext(DataContext);

    // A professional UI should handle the loading state gracefully
    if (!activeDepartmentData || !globalData) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    // The stats are now built from the new, scoped data sources
    const stats = [
        { name: 'Total Faculty', value: activeDepartmentData.faculty.length, icon: Users },
        { name: 'Total Subjects', value: activeDepartmentData.subjects.length, icon: Book },
        { name: 'Student Batches', value: activeDepartmentData.batches.length, icon: School },
        // Classrooms are a shared resource, so we get them from globalData
        { name: 'Total Rooms', value: globalData.classrooms.length, icon: Building },
    ];

    return (
        <div className="space-y-6">
            {/* Page header */}
            <header>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Welcome, {user?.name ?? 'Guest'}!
                </h1>
                <p className="mt-2 text-text-secondary dark:text-gray-400">
                    Here is a summary for the <span className="font-semibold text-primary">{activeDepartmentData.name}</span> department.
                </p>
            </header>

            {/* Stats grid */}
            <section
                aria-labelledby="stats-heading"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <h2 id="stats-heading" className="sr-only">
                    Department Statistics
                </h2>
                {stats.map((stat) => (
                    <Card key={stat.name}>
                       <CardContent className="flex items-center p-4">
                            {/* The icon's background and color are now theme-aware */}
                            <div className="p-3 rounded-full bg-primary-light dark:bg-primary-text mr-4">
                                <stat.icon className="w-6 h-6 text-primary-text dark:text-primary-light" aria-hidden="true" />
                            </div>
                            <div>
                                {/* The text colors now have dark: variants for readability */}
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            {/* Next steps / guidance */}
            <Card>
                <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>Get started by managing your data or creating a schedule.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        <li>
                            Navigate to <strong>Data Management</strong> to add or edit data for the selected department.
                        </li>
                        <li>
                            Visit the <strong>Constraints</strong> page to set global scheduling rules.
                        </li>
                        <li>
                            Use the <strong>Generator</strong> to create and review timetable options for the <span className="font-semibold">{activeDepartmentData.name}</span> department.
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}