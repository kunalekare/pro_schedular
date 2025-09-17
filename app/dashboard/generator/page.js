'use client';

import { useState, useContext } from 'react';
import { DataContext } from '@/app/context/DataContext';
import { AuthContext } from '@/app/context/AuthContext';
import { generateTimetables } from '@/app/lib/timetable-solver';
import { Button } from '@/app/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/app/components/ui/Card';
import TimetableGrid from '@/app/components/dashboard/TimetableGrid';
import Workflow from '@/app/components/dashboard/Workflow';
import SuggestionsPanel from '@/app/components/dashboard/SuggestionsPanel';
import { Zap, Loader2 } from 'lucide-react';

/**
 * Timetable Generator Page
 * This is the main interactive page for creating and reviewing timetable options.
 * It's fully department-aware and provides a professional user experience with
 * clear states for loading, empty results, and generated timetables.
 */
export default function GeneratorPage() {
    // Get the correct, department-aware data from the context
    const { activeDepartmentData, globalData } = useContext(DataContext);
    const { user } = useContext(AuthContext);

    const [timetableOptions, setTimetableOptions] = useState([]);
    const [activeOptionIndex, setActiveOptionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Handles the timetable generation process.
     * It calls the solver with the data for the currently active department.
     */
    const handleGenerate = () => {
        setIsLoading(true);

        // Simulate a solver run with a delay for better UX
        setTimeout(() => {
            // Pass the correct department-specific and global data to the solver
            const options = generateTimetables(activeDepartmentData, globalData);
            setTimetableOptions(options);
            setActiveOptionIndex(0);
            setIsLoading(false);
        }, 1500); // 1.5 seconds
    };

    const currentTimetable = timetableOptions[activeOptionIndex];

    // Role-Based Access Control: Only Admins or Schedulers can generate
    const canGenerate = user?.role === 'Admin' || user?.role === 'Scheduler';

    // Gracefully handle the case where context data might still be loading
    if (!activeDepartmentData) {
        return (
             <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Timetable Generator</h1>
                {canGenerate && (
                    <Button onClick={handleGenerate} disabled={isLoading} size="lg">
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <Zap className="w-5 h-5 mr-2" /> // Corrected icon class
                        )}
                        {isLoading ? 'Generating...' : 'Generate New Timetable'}
                    </Button>
                )}
            </div>

            {/* Empty State: Shown before any timetables are generated */}
            {timetableOptions.length === 0 && (
                <Card>
                    <CardContent className="text-center text-text-secondary dark:text-gray-400 py-12">
                        <p>
                            Click the &quot;Generate New Timetable&quot; button to create schedule options for the
                            <span className="font-bold text-primary"> {activeDepartmentData.name}</span> department.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Results: Show timetable options and details */}
            {timetableOptions.length > 0 && currentTimetable && (
                <>
                    {/* Timetable Options with Tab Navigation */}
                    <Card>
                        <CardHeader>
                            <nav className="-mb-px flex space-x-8" aria-label="Timetable Options">
                                {timetableOptions.map((opt, index) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setActiveOptionIndex(index)}
                                        className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeOptionIndex === index
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        Option {String.fromCharCode(65 + index)}
                                        {opt.clashes > 0 && <span className="ml-2 text-xs font-semibold text-white bg-danger rounded-full px-2 py-0.5">{opt.clashes} Clash</span>}
                                        {opt.unscheduled.length > 0 && <span className="ml-2 text-xs font-semibold text-white bg-warning rounded-full px-2 py-0.5">{opt.unscheduled.length} Unscheduled</span>}
                                    </button>
                                ))}
                            </nav>
                        </CardHeader>
                        <CardContent>
                            {/* Pass both data sources down to the grid for the filters */}
                            <TimetableGrid 
                                timetable={currentTimetable} 
                                departmentData={activeDepartmentData}
                                globalData={globalData} 
                            />
                        </CardContent>
                    </Card>

                    {/* Workflow & Suggestions Panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Workflow timetable={currentTimetable} />
                        </div>
                        <div>
                            <SuggestionsPanel timetable={currentTimetable} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}