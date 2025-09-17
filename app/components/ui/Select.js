'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

// ====================
// Select Component
// ====================
export const Select = forwardRef(
  ({ className, children, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={twMerge(
            "block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm shadow-sm",
            "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
            className
          )}
          {...props}
        >
          {children}
        </select>

        {error && (
          <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
