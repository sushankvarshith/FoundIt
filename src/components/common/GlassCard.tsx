import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  level?: 'bg' | 'secondary' | 'primary' | 'highlight' | 'active';
  interactive?: boolean;
  shimmer?: boolean;
  showGloss?: boolean;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  level = 'primary',
  interactive = false,
  shimmer = false,
  showGloss = true,
  className = '',
  ...props
}) => {
  const levelStyles = {
    bg: 'bg-[#060e22]/60 backdrop-blur-xl border border-cyan-500/20 shadow-lg shadow-black/30',
    secondary: 'bg-[#08132c]/70 backdrop-blur-2xl border border-cyan-500/25 shadow-xl shadow-black/40',
    primary: 'bg-[#091533]/80 backdrop-blur-2xl border border-cyan-400/30 shadow-2xl shadow-black/50',
    highlight: 'bg-gradient-to-br from-[#0d1c44]/90 via-[#0a1636]/85 to-[#071026]/90 backdrop-blur-3xl border border-cyan-400/40 shadow-2xl shadow-cyan-950/40',
    active: 'bg-cyan-500/15 backdrop-blur-2xl border border-cyan-400/50 shadow-xl shadow-cyan-500/20',
  };

  const interactiveStyles = interactive
    ? 'transition-all duration-300 hover:scale-[1.01] hover:border-cyan-300/70 hover:shadow-[0_20px_45px_-8px_rgba(6,182,212,0.35)] cursor-pointer'
    : '';

  return (
    <div
      className={`rounded-3xl relative overflow-hidden ${levelStyles[level]} ${interactiveStyles} ${shimmer ? 'animate-shimmer-sweep' : ''} ${className}`}
      {...props}
    >
      {/* 1. Ultra-bright Top Specular Edge Line */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none z-10" />

      {/* 2. Convex Gloss Reflection Lens */}
      {showGloss && (
        <div className="absolute top-0 inset-x-0 h-2/5 bg-gradient-to-b from-white/[0.12] via-white/[0.03] to-transparent pointer-events-none z-0 rounded-t-3xl" />
      )}

      {/* 3. Subtle bottom rim backlight */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent pointer-events-none z-10" />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
