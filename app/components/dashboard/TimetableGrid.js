'use client';

import { useState } from 'react';
import { Select } from '@/app/components/ui/Select';

/**
 * TimetableGrid Component
 * Renders the main visual grid for a given timetable option. It's fully interactive,
 * theme-aware (light/dark), and department-aware.
 * @param {object} timetable - The specific timetable option to display.
 * @param {object} departmentData - Data for the active department (faculty, batches).
 * @param {object} globalData - Global data (classrooms).
 */
export default function TimetableGrid({ timetable, departmentData, globalData }) {
    // Hooks must always be called at the top level of the component.
    const [filter, setFilter] = useState({ type: 'all', value: 'all' });
    
    // A "guard clause" to handle the initial state before a timetable is generated.
    if (!timetable || !departmentData || !globalData) {
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Select an option to view the timetable.</div>;
    }
    
    const handleFilterChange = (e) => {
        const [type, value] = e.target.value.split(':');
        setFilter({ type, value });
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = ['09-10', '10-11', '11-12', '13-14', '14-15', '15-16'];

    return (
        <div className="space-y-4">
            {/* Filter Controls */}
            <div className="flex items-center gap-4">
                <label className="font-medium text-sm text-text-secondary dark:text-gray-400">Filter View:</label>
                <Select onChange={handleFilterChange} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="all:all">Show All</option>
                    <optgroup label="Faculty">
                        {departmentData.faculty.map(f => <option key={f.id} value={`teacher:${f.name}`}>{f.name}</option>)}
                    </optgroup>
                     <optgroup label="Batches">
                        {departmentData.batches.map(b => <option key={b.id} value={`batch:${b.id}`}>{b.id}</option>)}
                    </optgroup>
                </Select>
            </div>
            
            {/* Timetable Grid */}
            <div className="overflow-x-auto border border-border dark:border-gray-700 rounded-lg">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 w-24"></th>
                            {days.map(day => <th key={day} className="p-2 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm font-medium">{day}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map(period => (
                            <tr key={period}>
                                <td className="p-2 border-r dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-bold text-sm text-center">{period}</td>
                                {days.map(day => {
                                    const slotKey = `${day}-${period}`;
                                    const slotData = timetable.schedule[slotKey];
                                    
                                    let isFilteredOut = false;
                                    if (filter.type !== 'all' && slotData) {
                                        if (filter.type === 'teacher' && slotData.teacher !== filter.value) isFilteredOut = true;
                                        if (filter.type === 'batch' && slotData.batch !== filter.value) isFilteredOut = true;
                                    }
                                    
                                    let slotClass = "p-2 border-b border-r dark:border-gray-700 align-top min-h-[100px] text-xs transition-opacity duration-300 ";
                                    if (isFilteredOut) slotClass += " opacity-20";

                                    return (
                                        <td key={slotKey} className={slotClass}>
                                            {slotData ? (
                                                <div className={`p-2 rounded shadow-sm ${
                                                    slotData.isClash 
                                                        ? 'bg-danger-light border-l-4 border-danger text-danger-text' 
                                                        : 'bg-primary-light dark:bg-gray-800 border-l-4 border-primary'
                                                }`}>
                                                    <strong className="font-bold text-primary-text dark:text-indigo-300 text-sm">{slotData.subject}</strong>
                                                    <div className="text-text-secondary dark:text-gray-300">{slotData.teacher}</div>
                                                    <div className="text-gray-400 dark:text-gray-500 text-xs">Room: {slotData.room}</div>
                                                    <div className="text-gray-400 dark:text-gray-500 text-xs">Batch: {slotData.batch}</div>
                                                    {slotData.isClash && <div className="font-bold text-danger mt-1">CLASH!</div>}
                                                </div>
                                            ) : (
                                                <div className="h-full w-full"></div> // Empty slot
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}