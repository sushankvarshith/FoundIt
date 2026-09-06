import React from 'react';
import { Loader2 } from 'lucide-react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'urgent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  shimmer?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  shimmer = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-4 py-1.5 text-xs font-bold gap-1.5 rounded-full',
    md: 'px-5 py-2.5 text-sm font-extrabold gap-2 rounded-full',
    lg: 'px-6 py-3.5 text-base font-extrabold gap-2.5 rounded-full',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 text-slate-950 font-black shadow-[0_8px_25px_-4px_rgba(6,182,212,0.45)] hover:shadow-[0_12px_32px_-2px_rgba(6,182,212,0.65)] border border-cyan-200/50 hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-[#0e1d44]/80 text-white hover:bg-[#14295c] border border-cyan-400/35 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5)] hover:border-cyan-300/60',
    outline:
      'bg-[#091533]/75 hover:bg-[#0e214d] text-slate-200 hover:text-white border border-cyan-500/30 hover:border-cyan-400/70 shadow-md',
    ghost:
      'bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-transparent',
    danger:
      'bg-rose-500/25 text-rose-200 hover:bg-rose-500/35 border border-rose-500/50 shadow-lg shadow-rose-950/40',
    urgent:
      'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white shadow-[0_8px_24px_rgba(244,63,94,0.4)] hover:shadow-[0_12px_30px_rgba(244,63,94,0.6)] border border-white/30',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`relative overflow-hidden inline-flex items-center justify-center transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer group ${sizeStyles[size]} ${variantStyles[variant]} ${shimmer ? 'animate-shimmer-sweep' : ''} ${className}`}
      {...props}
    >
      {/* Specular gloss top rim reflection */}
      <span className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />
      
      {/* Upper liquid gloss dome lens */}
      <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-full" />

      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current relative z-10" />
      ) : (
        leftIcon && <span className="shrink-0 relative z-10">{leftIcon}</span>
      )}
      <span className="whitespace-nowrap relative z-10">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0 relative z-10">{rightIcon}</span>}
    </button>
  );
};
