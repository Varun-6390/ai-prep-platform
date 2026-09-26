import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`w-9 h-9 rounded-full flex items-center justify-center bg-surface-container-low border border-outline-variant hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${className}`}
            aria-label="Toggle Theme"
        >
            <span
                className="material-symbols-outlined text-on-surface text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
            >
                {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
        </button>
    );
};

export default ThemeToggle;
