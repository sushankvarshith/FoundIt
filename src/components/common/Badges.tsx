import React from 'react';
import { PostStatus } from '../../types';
import { Gift, CheckCircle, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { GlitterStar } from './GlitterOverlay';

interface BadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LostBadge: React.FC<BadgeProps & { label?: string }> = ({
  size = 'md',
  label = 'LOST ITEM',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1 text-[10px] gap-1.5',
    md: 'px-3.5 py-1.5 text-xs gap-2',
    lg: 'px-4.5 py-2 text-sm gap-2.5',
  };

  return (
    <span
      className={`relative overflow-hidden inline-flex items-center font-black tracking-wider uppercase rounded-full border border-rose-400/50 bg-gradient-to-r from-rose-500/30 to-pink-600/25 text-rose-200 backdrop-blur-xl shadow-[0_2px_12px_rgba(244,63,94,0.3)] select-none ${sizeStyles[size]} ${className}`}
    >
      {/* Specular top rim */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
      {/* Gloss lens */}
      <span className="absolute inset-x-0 top-0 h-1/2 bg-white/10 pointer-events-none rounded-t-full" />
      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping relative z-10" />
      <span className="relative z-10">{label}</span>
    </span>
  );
};

export const FoundBadge: React.FC<BadgeProps & { label?: string }> = ({
  size = 'md',
  label = 'FOUND ITEM',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1 text-[10px] gap-1.5',
    md: 'px-3.5 py-1.5 text-xs gap-2',
    lg: 'px-4.5 py-2 text-sm gap-2.5',
  };

  return (
    <span
      className={`relative overflow-hidden inline-flex items-center font-black tracking-wider uppercase rounded-full border border-teal-300/50 bg-gradient-to-r from-teal-400/30 to-cyan-500/25 text-teal-200 backdrop-blur-xl shadow-[0_2px_12px_rgba(20,184,166,0.3)] select-none ${sizeStyles[size]} ${className}`}
    >
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
      <span className="absolute inset-x-0 top-0 h-1/2 bg-white/10 pointer-events-none rounded-t-full" />
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 relative z-10" />
      <span className="relative z-10">{label}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: PostStatus; size?: 'sm' | 'md'; className?: string }> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1 text-[10px] gap-1.5',
    md: 'px-3.5 py-1.5 text-xs gap-2',
  };

  switch (status) {
    case 'active':
      return (
        <span
          className={`relative overflow-hidden inline-flex items-center font-extrabold tracking-wide uppercase rounded-full border border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-yellow-500/15 text-amber-200 backdrop-blur-xl shadow-[0_2px_10px_rgba(245,158,11,0.25)] ${sizeStyles[size]} ${className}`}
        >
          <span className="absolute inset-x-0 top-0 h-[1px] bg-white/40 pointer-events-none" />
          <Clock className="w-3 h-3 text-amber-300 relative z-10" />
          <span className="relative z-10">Active Search</span>
        </span>
      );
    case 'submitted':
      return (
        <span
          className={`relative overflow-hidden inline-flex items-center font-extrabold tracking-wide uppercase rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/15 text-cyan-200 backdrop-blur-xl shadow-[0_2px_10px_rgba(6,182,212,0.25)] ${sizeStyles[size]} ${className}`}
        >
          <span className="absolute inset-x-0 top-0 h-[1px] bg-white/40 pointer-events-none" />
          <AlertTriangle className="w-3 h-3 text-cyan-300 relative z-10" />
          <span className="relative z-10">Claim Underway</span>
        </span>
      );
    case 'found':
      return (
        <span
          className={`relative overflow-hidden inline-flex items-center font-extrabold tracking-wide uppercase rounded-full border border-emerald-400/45 bg-gradient-to-r from-emerald-500/25 to-teal-500/20 text-emerald-200 backdrop-blur-xl shadow-[0_2px_10px_rgba(16,185,129,0.25)] ${sizeStyles[size]} ${className}`}
        >
          <span className="absolute inset-x-0 top-0 h-[1px] bg-white/50 pointer-events-none" />
          <CheckCircle className="w-3 h-3 text-emerald-300 relative z-10" />
          <span className="relative z-10">Recovered</span>
        </span>
      );
    case 'resolved':
      return (
        <span
          className={`relative overflow-hidden inline-flex items-center font-extrabold tracking-wide uppercase rounded-full border border-slate-500/40 bg-slate-600/20 text-slate-300 backdrop-blur-xl ${sizeStyles[size]} ${className}`}
        >
          <span className="absolute inset-x-0 top-0 h-[1px] bg-white/30 pointer-events-none" />
          <CheckCircle className="w-3 h-3 text-slate-400 relative z-10" />
          <span className="relative z-10">Case Closed</span>
        </span>
      );
    default:
      return null;
  }
};

export const RewardBadge: React.FC<{ amount?: number; currency?: string; size?: 'sm' | 'md' }> = ({
  amount = 0,
  currency = '₹',
  size = 'md',
}) => {
  if (!amount) return null;

  const sizeStyles = {
    sm: 'px-3 py-1 text-[11px] gap-1.5',
    md: 'px-3.5 py-1.5 text-xs gap-2',
  };

  return (
    <span
      className={`relative overflow-hidden inline-flex items-center font-black tracking-tight rounded-full border border-amber-300/60 bg-gradient-to-r from-amber-400/30 via-yellow-400/25 to-amber-500/30 text-amber-100 backdrop-blur-xl shadow-[0_4px_16px_rgba(245,158,11,0.35)] animate-shimmer-sweep select-none ${sizeStyles[size]}`}
    >
      <span className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
      <span className="absolute inset-x-0 top-0 h-1/2 bg-white/15 pointer-events-none rounded-t-full" />
      <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0 relative z-10" />
      <span className="relative z-10 font-black">
        Reward {currency}
        {amount.toLocaleString()}
      </span>
      <GlitterStar size={10} className="text-amber-200 relative z-10 shrink-0" variant="fast" />
    </span>
  );
};

export const MatchBadge: React.FC<{ score: number; size?: 'sm' | 'md' }> = ({
  score,
  size = 'md',
}) => {
  const isHigh = score >= 80;
  const isMed = score >= 60 && score < 80;

  const colorStyle = isHigh
    ? 'border-emerald-300/60 bg-gradient-to-r from-emerald-500/30 to-teal-500/25 text-emerald-100 shadow-[0_2px_12px_rgba(16,185,129,0.35)]'
    : isMed
    ? 'border-cyan-300/60 bg-gradient-to-r from-cyan-500/30 to-blue-500/25 text-cyan-100 shadow-[0_2px_12px_rgba(6,182,212,0.35)]'
    : 'border-slate-500/40 bg-slate-500/20 text-slate-300';

  const sizeStyles = {
    sm: 'px-3 py-1 text-[10px] gap-1.5',
    md: 'px-3.5 py-1.5 text-xs gap-2',
  };

  return (
    <span
      className={`relative overflow-hidden inline-flex items-center font-black rounded-full border backdrop-blur-xl ${colorStyle} ${sizeStyles[size]}`}
    >
      <span className="absolute inset-x-0 top-0 h-[1px] bg-white/50 pointer-events-none" />
      <Sparkles className="w-3.5 h-3.5 shrink-0 text-current relative z-10" />
      <span className="relative z-10">{score}% Match</span>
      {isHigh && <GlitterStar size={10} className="text-emerald-200 relative z-10 shrink-0" variant="fast" />}
    </span>
  );
};
