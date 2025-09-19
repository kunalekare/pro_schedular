'use client';

import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

// ====================
// Card Container
// ====================
export const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(
      "bg-card shadow-sm rounded-lg border border-border dark:bg-gray-800 dark:border-gray-700",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// ====================
// Card Header
// ====================
export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("p-6 flex flex-col space-y-1.5", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// ====================
// Card Title
// ====================
export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={twMerge(
      "text-2xl font-semibold leading-none tracking-tight text-text-primary dark:text-gray-100",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// ====================
// Card Description
// ====================
export const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={twMerge(
      "text-sm text-text-secondary dark:text-gray-400",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// ====================
// Card Content
// ====================
export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={twMerge("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// ====================
// Card Footer
// ====================
export const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
