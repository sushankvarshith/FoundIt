import React from 'react';

/**
 * Ambient background glitter and twinkling stars layer
 */
export const AmbientGlitterField: React.FC = () => {
  // Pre-calculated aesthetic sparkle coordinates to avoid runtime layout shift
  const sparkles = [
    { top: '8%', left: '15%', size: 14, delay: '0s', duration: '2.5s', color: 'text-cyan-300' },
    { top: '14%', left: '38%', size: 10, delay: '1.2s', duration: '3.2s', color: 'text-blue-300' },
    { top: '6%', left: '72%', size: 16, delay: '0.6s', duration: '2.8s', color: 'text-teal-300' },
    { top: '22%', left: '88%', size: 12, delay: '1.8s', duration: '3.5s', color: 'text-purple-300' },
    { top: '35%', left: '8%', size: 18, delay: '0.4s', duration: '2.4s', color: 'text-cyan-400' },
    { top: '48%', left: '26%', size: 9, delay: '2.1s', duration: '4s', color: 'text-emerald-300' },
    { top: '42%', left: '78%', size: 14, delay: '1.5s', duration: '3s', color: 'text-cyan-300' },
    { top: '60%', left: '12%', size: 11, delay: '0.8s', duration: '2.7s', color: 'text-blue-200' },
    { top: '68%', left: '92%', size: 15, delay: '1.9s', duration: '3.4s', color: 'text-teal-300' },
    { top: '82%', left: '22%', size: 13, delay: '0.3s', duration: '2.9s', color: 'text-cyan-300' },
    { top: '76%', left: '64%', size: 16, delay: '1.4s', duration: '3.6s', color: 'text-purple-300' },
    { top: '92%', left: '82%', size: 12, delay: '2.3s', duration: '3.1s', color: 'text-cyan-200' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {sparkles.map((s, idx) => (
        <div
          key={idx}
          className={`absolute ${s.color} drop-shadow-[0_0_8px_currentColor] transition-all`}
          style={{
            top: s.top,
            left: s.left,
            animation: `glitter-pulse ${s.duration} ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        >
          {/* 4-point star SVG */}
          <svg
            width={s.size}
            height={s.size}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="opacity-80"
          >
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

/**
 * Inline micro-glitter twinkle star for buttons, badges, and headers
 */
export const GlitterStar: React.FC<{
  size?: number;
  className?: string;
  variant?: 'fast' | 'slow' | 'delay';
}> = ({ size = 12, className = 'text-cyan-300', variant = 'fast' }) => {
  const animClass =
    variant === 'fast'
      ? 'glitter-sparkle-fast'
      : variant === 'slow'
      ? 'glitter-sparkle-slow'
      : 'glitter-sparkle-delay';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block shrink-0 ${animClass} ${className} drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]`}
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
};
