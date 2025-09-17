'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

// ====================
// Input Component
// ====================
export const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={twMerge(
        "flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
