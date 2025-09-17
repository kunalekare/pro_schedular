'use client';
import { useState } from 'react';
import { Select } from '../ui/Select';

export default function TimetableGrid({ timetable, data }) {
    if (!timetable) return null;

    const [filter, setFilter] = useState({ type: 'all', value: 'all' });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const periods = ['09-10', '10-11', '11-12', '13-14', '14-15'];

    const handleFilterChange = (e) => {
        const [type, value] = e.target.value.split(':');
        setFilter({ type, value });
    };

    const getSlotClass = (slotData, isFilteredOut) => {
        let slotClass =
            "p-2 border text-left align-top min-h-[100px] text-xs transition-all duration-300 ";

        if (slotData?.isClash) {
            slotClass += "bg-red-100 border-2 border-red-500";
        } else if (slotData?.isFixed) {
            slotClass += "bg-yellow-100 border-l-4 border-yellow-500";
        } else if (slotData) {
            slotClass += "bg-indigo-50";
        } else {
            slotClass += "bg-green-50 border-dashed border-green-300";
        }

        if (isFilteredOut) slotClass += " opacity-30";

        return slotClass;
    };

    const isFilteredOutSlot = (slotData) => {
        if (!slotData || filter.type === 'all') return false;

        if (filter.type === 'teacher' && slotData.teacher !== filter.value) return true;
        if (filter.type === 'batch' && slotData.batch !== filter.value) return true;

        return false;
    };

    return (
        <div>
            {/* Filter Dropdown */}
            <div className="mb-4 flex items-center gap-4">
                <label className="font-medium text-gray-700">Filter View:</label>
                <Select onChange={handleFilterChange}>
                    <option value="all:all">Show All</option>

                    <optgroup label="Faculty">
                        {data?.faculty?.map((f) => (
                            <option key={f.id} value={`teacher:${f.name}`}>
                                {f.name}
                            </option>
                        ))}
                    </optgroup>

                    <optgroup label="Batches">
                        {data?.batches?.map((b) => (
                            <option key={b.id} value={`batch:${b.id}`}>
                                {b.id}
                            </option>
                        ))}
                    </optgroup>
                </Select>
            </div>

            {/* Timetable Grid */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 border bg-gray-100 w-24">Period</th>
                            {days.map((day) => (
                                <th key={day} className="p-2 border bg-gray-100 text-center">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {periods.map((period) => (
                            <tr key={period}>
                                <td className="p-2 border bg-gray-100 font-bold text-center">
                                    {period}
                                </td>
                                {days.map((day) => {
                                    const slotKey = `${day}-${period}`;
                                    const slotData = timetable.schedule[slotKey];
                                    const isFilteredOut = isFilteredOutSlot(slotData);
                                    const slotClass = getSlotClass(slotData, isFilteredOut);

                                    return (
                                        <td key={slotKey} className={slotClass}>
                                            {slotData ? (
                                                <>
                                                    <strong className="font-bold text-indigo-800 block">
                                                        {slotData.subject}
                                                    </strong>
                                                    <div className="text-gray-700">{slotData.teacher}</div>
                                                    <div className="text-gray-500 text-xs">
                                                        Room: {slotData.room}
                                                    </div>
                                                    <div className="text-gray-500 text-xs">
                                                        Batch: {slotData.batch}
                                                    </div>
                                                    {slotData.isClash && (
                                                        <div className="font-bold text-red-600 mt-1">
                                                            ⚠️ Clash Detected
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-green-600 text-center block pt-6">
                                                    Free Slot
                                                </span>
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
