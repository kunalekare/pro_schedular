/**
 * @file ThemeContext.js
 * @description Manages the theme (light/dark) for the entire application.
 * It uses localStorage to persist the theme choice across browser sessions
 * and applies the theme class to the root HTML element.
 * @version 2.0.0
 */

'use client';

import { createContext, useState, useEffect, useCallback } from 'react';

// Create the context with a default value for better autocompletion and safety
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Create the provider component
export const ThemeProvider = ({ children }) => {
  // State to hold the current theme, defaulting to 'light' to avoid issues on server render
  const [theme, setTheme] = useState('light');

  // This effect runs once on the client after the component mounts.
  // It checks localStorage for a previously saved theme.
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem('scheduler-pro-theme');
      // Set the theme only if it's a valid value ('light' or 'dark')
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Could not access localStorage to get theme.", error);
    }
  }, []); // Empty dependency array means this runs only once

  // This effect runs whenever the `theme` state changes.
  // It updates the class on the `<html>` element and saves the new theme to localStorage.
  useEffect(() => {
    const root = window.document.documentElement;

    // A safer way to manage classes: remove both, then add the correct one.
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    try {
      window.localStorage.setItem('scheduler-pro-theme', theme);
    } catch (error) {
      console.error("Could not access localStorage to save theme.", error);
    }
  }, [theme]); // Dependency array ensures this runs every time `theme` changes

  // `useCallback` memoizes the toggle function so it isn't recreated on every render.
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // The value provided to consuming components
  const value = { theme, toggleTheme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

