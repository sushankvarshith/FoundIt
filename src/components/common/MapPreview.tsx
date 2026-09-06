import React from 'react';
import { MapPin, ShieldCheck, Navigation } from 'lucide-react';
import { LocationInfo } from '../../types';

interface MapPreviewProps {
  location: LocationInfo;
  className?: string;
  showDetails?: boolean;
  heightClass?: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({
  location,
  className = '',
  showDetails = true,
  heightClass = 'h-40',
}) => {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 ${className}`}
    >
      {/* Visual Stylized Vector Grid & Map Roads Simulation */}
      <div className={`relative w-full ${heightClass} overflow-hidden`}>
        <svg
          className="w-full h-full object-cover opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 400 200"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="grid-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
            <linearGradient id="map-glow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0b1329" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#map-glow)" />
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          {/* Simulated arterial roads */}
          <path
            d="M-20 60 Q 120 40 220 90 T 420 140"
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="10"
          />
          <path
            d="M-20 60 Q 120 40 220 90 T 420 140"
            fill="none"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="3"
            strokeDasharray="4,6"
          />
          <path
            d="M80 -20 Q 140 100 160 220"
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="8"
          />
          <path
            d="M260 -20 Q 240 110 320 220"
            fill="none"
            stroke="rgba(148, 163, 184, 0.15)"
            strokeWidth="6"
          />
          
          {/* Approximate search radius zone */}
          <circle
            cx="200"
            cy="100"
            r="44"
            fill="rgba(16, 185, 129, 0.1)"
            stroke="rgba(16, 185, 129, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </svg>

        {/* Radar wave pulse from center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 animate-ping" />
          <div className="absolute w-8 h-8 rounded-full bg-emerald-500/25 backdrop-blur-xs flex items-center justify-center border border-emerald-400/50 shadow-lg shadow-emerald-500/40">
            <MapPin className="w-4 h-4 text-emerald-300 drop-shadow" />
          </div>
        </div>

        {/* Distance tag top-right */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-slate-200 flex items-center gap-1 shadow-md">
          <Navigation className="w-3 h-3 text-emerald-400" />
          <span>{location.distanceKm} km away</span>
        </div>

        {/* Privacy assurance pill bottom-left */}
        {location.approximate && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 flex items-center gap-1.5 shadow">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Approximate location for user privacy</span>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="p-3.5 bg-slate-900/70 border-t border-white/10 flex items-center justify-between text-left">
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{location.name}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 pl-4">
              {location.neighborhood}, {location.city}
            </div>
          </div>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
            Static Map
          </span>
        </div>
      )}
    </div>
  );
};
