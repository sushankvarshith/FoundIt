import React from 'react';
import { GlitterStar } from './GlitterOverlay';

interface FoundItLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const FoundItLogo: React.FC<FoundItLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div
      id="brand-foundit-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}
    >
      {/* Liquid Glass Cyan Teardrop Location Pin Emblem with Specular Highlight & Micro-Glitter */}
      <div className="relative shrink-0">
        <div
          className={`relative ${iconSizes[size]} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-cyan-200/60 overflow-hidden`}
          style={{
            background: 'linear-gradient(145deg, #22d3ee 0%, #06b6d4 40%, #0284c7 100%)',
          }}
        >
          {/* Specular gloss top reflection lens */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 via-white/20 to-transparent pointer-events-none" />

          {/* Top bright rim */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-white pointer-events-none" />

          {/* Location Pin Icon */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative z-10"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>

          {/* Liquid inner glow */}
          <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 mix-blend-overlay pointer-events-none" />
        </div>

        {/* Orbiting glittering micro-star on emblem corner */}
        <div className="absolute -top-1 -right-1 z-20 pointer-events-none">
          <GlitterStar size={10} className="text-cyan-200" variant="fast" />
        </div>
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center leading-tight gap-1">
          <span className={`font-black tracking-tight text-white ${textSizes[size]} font-display drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]`}>
            Found<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400">It</span>
          </span>
          <GlitterStar size={10} className="text-cyan-300 ml-0.5" variant="delay" />
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5 tracking-tight hidden sm:flex items-center gap-1">
            <span>Lost Something? Found Something?</span>
          </span>
        )}
      </div>
    </div>
  );
};
