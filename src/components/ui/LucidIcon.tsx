import React from 'react';

export function LucidIcon({ size = 48, className = '' }: { size?: number, className?: string }) {
    return (
        <div
            className={`rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 shadow-lg shadow-indigo-500/30 relative overflow-hidden ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Inner glow/pulse effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />

            {/* Optional: Central light source for 'clarity' */}
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white/10 blur-md rounded-full" />
        </div>
    );
}
