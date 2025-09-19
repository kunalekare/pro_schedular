// File: app/components/dashboard/ScheduleHeatmap.js

'use client';

/**
 * @file A professional, reusable React component to display weekly schedule density as a heatmap.
 * @author Your Name/Team Name
 * @version 1.0.0
 * @see {@link https://tailwindcss.com/} for styling.
 * @see {@link https://react.dev/} for React documentation.
 */

// --- CONFIGURATION ---
/**
 * Defines the time slots (columns) for the heatmap.
 * Easily configurable by adding or removing strings.
 * @type {string[]}
 */
const TIME_SLOTS = ['09-10', '10-11', '11-12', '12-13', '14-15', '15-16', '16-17'];

/**
 * Defines the days of the week (rows) for the heatmap.
 * @type {string[]}
 */
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


// --- HELPER FUNCTIONS ---
/**
 * Calculates and returns a Tailwind CSS background color class based on the cell's value.
 * The color intensity is scaled relative to the maximum value in the dataset.
 * @param {number} value - The number of classes in the time slot.
 * @param {number} maxValue - The maximum number of classes in any slot for the week.
 * @returns {string} The appropriate Tailwind CSS class for the background color.
 */
const getCellColor = (value, maxValue) => {
  if (value === 0) {
    return 'bg-gray-100 dark:bg-gray-800/50';
  }
  // Scale intensity from 0 to 4 based on the value relative to the max
  const intensity = Math.min(Math.floor((value / maxValue) * 5), 4);
  const colorScale = [
    'bg-indigo-200 dark:bg-indigo-900',
    'bg-indigo-300 dark:bg-indigo-800',
    'bg-indigo-400 dark:bg-indigo-700',
    'bg-indigo-500 dark:bg-indigo-600',
    'bg-indigo-600 dark:bg-indigo-500',
  ];
  return colorScale[intensity];
};


// --- MAIN COMPONENT ---
/**
 * Renders a weekly schedule density heatmap.
 * This component is designed to be robust and visually informative.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.data - The schedule density data. Each object should have a 'day' key (e.g., 'Mon')
 * and keys for each time slot with the number of classes.
 * @example
 * const heatmapData = [
 * { day: 'Mon', '09-10': 5, '10-11': 8, ... },
 * { day: 'Tue', '09-10': 6, '10-11': 9, ... },
 * ];
 * <ScheduleHeatmap data={heatmapData} />
 */
export default function ScheduleHeatmap({ data }) {
  // 1. Robustness: Handle cases where data is not provided.
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-lg bg-gray-50 dark:bg-gray-800/30">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Schedule density data is not available.
        </p>
      </div>
    );
  }

  // 2. Dynamic Scaling: Find the highest value to make the color scale relative and accurate.
  // We use Math.max(1, ...) to prevent division by zero if all values are 0.
  const maxClasses = Math.max(
    1,
    ...data.flatMap(dayData => TIME_SLOTS.map(slot => dayData[slot] || 0))
  );

  // Pre-process data into a Map for efficient lookups.
  const dataMap = new Map(data.map(item => [item.day, item]));

  return (
    <div className="p-1 font-sans">
      <div className="grid grid-cols-[50px,repeat(7,1fr)] gap-1">
        {/* Header Row: Empty cell + Time Slots */}
        <div />
        {TIME_SLOTS.map((slot) => (
          <div key={slot} className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 pb-1">
            {slot}
          </div>
        ))}

        {/* Data Rows: Day Label + Heatmap Cells */}
        {DAYS_OF_WEEK.map((day) => {
          const dayData = dataMap.get(day) || {};
          return (
            <React.Fragment key={day}>
              <div className="text-right text-sm font-semibold text-gray-600 dark:text-gray-300 pr-2 pt-2">
                {day}
              </div>
              {TIME_SLOTS.map((slot) => {
                const value = dayData[slot] || 0;
                return (
                  <div
                    key={`${day}-${slot}`}
                    title={`${value} classes on ${day} from ${slot}`}
                    className={`flex items-center justify-center h-10 rounded-md transition-colors duration-200 ${getCellColor(
                      value,
                      maxClasses
                    )}`}
                  >
                    <span className="text-sm font-bold text-gray-900/80 dark:text-gray-100/90">
                      {value > 0 ? value : ''}
                    </span>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// Added React import for older project setups, though Next.js often handles it automatically.
import React from 'react';