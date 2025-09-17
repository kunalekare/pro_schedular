'use client';
import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

// Reusable Button Component
export const Button = forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      type = 'button',
      children,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles for ALL buttons in the app
    const baseStyles =
      'inline-flex items-center justify-center rounded-md font-medium transition-colors ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ' +
      'disabled:opacity-50 disabled:pointer-events-none';

    // Variants for different use-cases
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover',
      secondary: 'bg-secondary text-white hover:bg-secondary-hover',
      danger: 'bg-danger text-white hover:bg-danger-hover',
      outline: 'border border-border bg-transparent hover:bg-gray-100 text-text-primary',
      ghost: 'bg-transparent hover:bg-gray-100 text-text-primary',
      link: 'bg-transparent underline-offset-4 hover:underline text-primary',
    };

    // Sizes for consistency across the app
    const sizes = {
      xs: 'h-8 px-2 text-xs',
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6 text-base',
      xl: 'h-12 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={twMerge(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
