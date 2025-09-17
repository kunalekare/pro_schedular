/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: 'class', 
  // This is the corrected 'content' section.
  // It specifically tells Tailwind to only look for files
  // inside your 'app' directory, which matches your project structure.
 content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}', // add if you make a components dir later
],
  
  // The rest of the file remains the same
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#4f46e5', hover: '#4338ca', light: '#e0e7ff', text: '#3730a3' },
        secondary: { DEFAULT: '#6b7280', hover: '#4b5563' },
        success: { DEFAULT: '#16a34a', light: '#dcfce7', text: '#15803d' },
        danger: { DEFAULT: '#ef4444', light: '#fee2e2', text: '#b91c1c' },
        warning: { DEFAULT: '#f59e0b', light: '#fef3c7', text: '#b45309' },
        card: '#ffffff',
        background: '#f9fafb',
        border: '#e5e7eb',
        text: { primary: '#111827', secondary: '#4b5563' }
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};