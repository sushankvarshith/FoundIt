import React from 'react';
import { ItemPost } from '../../types';
import { LostBadge, FoundBadge, StatusBadge, RewardBadge } from '../common/Badges';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Clock } from 'lucide-react';
import { useToast } from '../common/Toast';
import { GlitterStar } from '../common/GlitterOverlay';

interface ItemCardProps {
  post: ItemPost;
  onOpenDetails: (post: ItemPost) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onOpenShare: (post: ItemPost) => void;
  onOpenClaim: (post: ItemPost) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  post,
  onOpenDetails,
  onToggleLike,
  onToggleSave,
  onOpenShare,
  onOpenClaim,
}) => {
  const { showToast } = useToast();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(post.id);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(post.id);
    showToast(post.userInteractions.saved ? 'Removed from saved' : 'Saved to your bookmarked items');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenShare(post);
  };

  const handleClaim = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenClaim(post);
  };

  return (
    <div
      id={`post-card-${post.id}`}
      onClick={() => onOpenDetails(post)}
      className="relative rounded-3xl border border-cyan-400/30 bg-gradient-to-b from-[#0b183a]/85 via-[#08122a]/80 to-[#060e20]/85 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.65),inset_0_1.5px_2px_rgba(255,255,255,0.35)] hover:border-cyan-300/70 hover:shadow-[0_22px_50px_rgba(6,182,212,0.35)] transition-all duration-300 overflow-hidden group flex flex-col h-full text-left cursor-pointer"
    >
      {/* 1. Specular top rim gleam */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none z-10" />

      {/* 2. Upper convex gloss lens */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent pointer-events-none rounded-t-3xl z-0" />

      {/* Header: User Avatar, Name, Time, and Lost/Found Pill */}
      <div className="p-4 sm:p-5 pb-3 flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={post.uploader.avatar}
              alt={post.uploader.name}
              className="w-10 h-10 rounded-full object-cover border border-cyan-300/50 shadow-sm"
            />
            {post.uploader.isVerifiedHelper && (
              <span
                title="Verified Community Helper"
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[8px] font-black border border-slate-950 shadow-sm"
              >
                ✓
              </span>
            )}
          </div>

          <div className="min-w-0">
            <span className="font-black text-sm text-white truncate block group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
              <span>{post.uploader.name}</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate mt-0.5">
              <span>{post.dateOccurred}</span>
              <span>&bull;</span>
              <span className="truncate">{post.location.neighborhood}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {post.type === 'lost' ? <LostBadge size="sm" /> : <FoundBadge size="sm" />}
        </div>
      </div>

      {/* Sub-header Badges: Active Search status & Reward Pill */}
      <div className="px-4 sm:px-5 pb-3 flex items-center justify-between gap-2 flex-wrap relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={post.status} size="sm" />
        </div>

        {post.reward?.hasReward && (
          <div>
            <RewardBadge amount={post.reward.amount} currency={post.reward.currency} size="sm" />
          </div>
        )}
      </div>

      {/* Image Container with Rounded Inset */}
      <div className="relative mx-4 sm:mx-5 rounded-2xl overflow-hidden border border-cyan-500/25 aspect-[4/3] bg-slate-950 shadow-inner z-10">
        <img
          src={post.images[0]}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Ambient Gradient overlay on bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

        {/* Gloss highlight on top edge of image */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Image index indicator pill */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white/90 shadow">
          {post.images.length > 1 ? `1/${post.images.length}` : '1/1'}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3 relative z-10">
        <div>
          {/* Title */}
          <h4 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug line-clamp-1 group-hover:text-cyan-200 transition-colors">
            {post.title}
          </h4>

          {/* Category & Model Subtitle */}
          <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold mt-1 truncate">
            <span>{post.category}</span>
            {post.brand && <span>&bull; {post.brand}</span>}
            {post.model && <span>&bull; {post.model}</span>}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        </div>

        {/* Location & Time Info */}
        <div className="pt-2.5 border-t border-cyan-500/20 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate text-slate-200 font-semibold">{post.location.distanceKm} km away</span>
            <span className="text-slate-500">•</span>
            <span className="truncate text-slate-400">{post.location.neighborhood}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 text-slate-400 text-[11px]">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{post.dateOccurred}</span>
          </div>
        </div>

        {/* Interactive Bottom Bar */}
        <div className="pt-3 border-t border-cyan-500/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={handleLike}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                post.userInteractions.liked
                  ? 'text-rose-300 bg-rose-500/25 border border-rose-400/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Like"
            >
              <Heart
                className={`w-4 h-4 ${post.userInteractions.liked ? 'fill-current' : ''}`}
              />
              <span>{post.stats.likes}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(post);
              }}
              className="p-2 rounded-xl flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              title="Comments"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.stats.commentsCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-pointer"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleSave}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer ${
                post.userInteractions.saved
                  ? 'text-cyan-300 bg-cyan-500/25 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
              title="Save"
            >
              <Bookmark
                className={`w-4 h-4 ${post.userInteractions.saved ? 'fill-current' : ''}`}
              />
            </button>
          </div>

          {/* Primary Action CTA Button */}
          <div>
            {post.type === 'found' ? (
              <button
                onClick={handleClaim}
                className="relative overflow-hidden px-4 py-2 rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 text-slate-950 font-black text-xs shadow-[0_4px_18px_rgba(6,182,212,0.4)] hover:shadow-[0_8px_25px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap border border-white/50 animate-shimmer-sweep flex items-center gap-1.5"
              >
                <span className="absolute inset-x-0 top-0 h-1/2 bg-white/30 pointer-events-none rounded-t-full" />
                <span className="relative z-10">Claim This Item</span>
                <GlitterStar size={10} className="text-slate-950 relative z-10" variant="fast" />
              </button>
            ) : (
              <button
                onClick={handleClaim}
                className="relative overflow-hidden px-4 py-2 rounded-full bg-[#0a1532]/85 hover:bg-[#0e214d] text-cyan-200 border border-cyan-400/40 hover:border-cyan-300 font-black text-xs shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                <span className="absolute inset-x-0 top-0 h-1/2 bg-white/15 pointer-events-none rounded-t-full" />
                <span className="relative z-10">I Found This</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
