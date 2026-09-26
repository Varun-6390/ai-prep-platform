import React from 'react';

const Logo = ({ className = "w-8 h-8", withText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#6366F1', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="96" fill="url(#logo-grad)" />
        <g transform="translate(256,256)">
          <path d="M0 -120 L30 0 L0 120 L-30 0 Z" fill="white" fillOpacity="0.95"/>
          <path d="M120 0 L0 30 L-120 0 L0 -30 Z" fill="white" fillOpacity="0.95"/>
          <path d="M80 -80 L95 -55 L80 -30 L65 -55 Z" fill="white" fillOpacity="0.7"/>
          <path d="M-80 80 L-65 55 L-80 30 L-95 55 Z" fill="white" fillOpacity="0.7"/>
          <circle cx="60" cy="-100" r="8" fill="white" fillOpacity="0.5"/>
          <circle cx="-60" cy="100" r="8" fill="white" fillOpacity="0.5"/>
          <circle cx="100" cy="60" r="6" fill="white" fillOpacity="0.4"/>
        </g>
      </svg>
      {withText && (
        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 whitespace-nowrap">
          AI-prep
        </span>
      )}
    </div>
  );
};

export default Logo;
