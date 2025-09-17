'use client';

import { twMerge } from 'tailwind-merge';

// ====================
// Label Component
// ====================
export function Label({ className, required = false, children, ...props }) {
  return (
    <label
      className={twMerge(
        "block text-sm font-medium text-foreground mb-1",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}
