import React, { useState } from 'react';
import { ItemPost } from '../../types';
import { LostBadge, FoundBadge, StatusBadge, RewardBadge } from '../common/Badges';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { MapPreview } from '../common/MapPreview';
import { CommentPanel } from '../common/CommentPanel';
import { useToast } from '../common/Toast';
import {
  Heart,
  Bookmark,
  Share2,
  ArrowLeft,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Gift,
  HelpCircle,
  Tag,
} from 'lucide-react';

interface ItemDetailsViewProps {
  post: ItemPost;
  onBack: () => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onOpenShare: (post: ItemPost) => void;
  onOpenClaim: (post: ItemPost) => void;
}

export const ItemDetailsView: React.FC<ItemDetailsViewProps> = ({
  post,
  onBack,
  onToggleLike,
  onToggleSave,
  onOpenShare,
  onOpenClaim,
}) => {
  const { showToast } = useToast();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div id={`item-details-view-${post.id}`} className="max-w-5xl mx-auto py-6 px-4 text-left">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-1.5 px-3 rounded-xl hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleLike(post.id)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              post.userInteractions.liked
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
            title="Like Post"
          >
            <Heart
              className={`w-4 h-4 ${post.userInteractions.liked ? 'fill-current' : ''}`}
            />
          </button>

          <button
            onClick={() => {
              onToggleSave(post.id);
              showToast(post.userInteractions.saved ? 'Removed from saved' : 'Saved to your bookmarked items');
            }}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              post.userInteractions.saved
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
            title="Save Post"
          >
            <Bookmark
              className={`w-4 h-4 ${post.userInteractions.saved ? 'fill-current' : ''}`}
            />
          </button>

          <button
            onClick={() => onOpenShare(post)}
            className="p-2.5 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
            title="Share with community"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery & Map Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Gallery Image */}
          <GlassCard level="highlight" className="p-2 overflow-hidden">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={post.images[selectedImageIndex] || post.images[0]}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                {post.type === 'lost' ? <LostBadge size="md" /> : <FoundBadge size="md" />}
                <StatusBadge status={post.status} size="md" />
              </div>

              {post.reward?.hasReward && (
                <div className="absolute top-4 right-4">
                  <RewardBadge
                    amount={post.reward.amount}
                    currency={post.reward.currency}
                    size="md"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail carousel if multiple images */}
            {post.images.length > 1 && (
              <div className="flex gap-2.5 p-2 overflow-x-auto">
                {post.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImageIndex === idx ? 'border-emerald-400 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Location Vector Preview */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Location & Vicinity Map
            </span>
            <MapPreview location={post.location} heightClass="h-52" />
          </div>

          {/* Community Comments Component */}
          <GlassCard level="primary" className="p-6">
            <CommentPanel itemId={post.id} />
          </GlassCard>
        </div>

        {/* Right Column: Key Details & Claim CTA (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Main Info Card */}
          <GlassCard level="primary" className="p-6 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {post.category}
                </span>
                {post.brand && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white/10 text-slate-300">
                    {post.brand} {post.model ? `• ${post.model}` : ''}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display leading-tight">
                {post.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Occurred: {post.dateOccurred}</span>
                <span>&bull;</span>
                <span>{post.location.neighborhood}</span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Description & Circumstances
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">{post.description}</p>
            </div>

            {/* Distinguishing Marks */}
            {post.identifyingFeatures && (
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Identifying Characteristics</span>
                </h4>
                <p className="text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/10">
                  {post.identifyingFeatures}
                </p>
              </div>
            )}

            {/* Reward Spotlight if exists */}
            {post.reward?.hasReward && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/5 border border-amber-400/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Gift className="w-4 h-4" />
                    <span>Official Reward Offered</span>
                  </span>
                  <span className="text-xl font-extrabold text-white">
                    {post.reward.currency}
                    {post.reward.amount?.toLocaleString()}
                  </span>
                </div>
                {post.reward.note && (
                  <p className="text-xs text-amber-200/90 mt-2">{post.reward.note}</p>
                )}
              </div>
            )}

            {/* Primary Action Button */}
            <div className="pt-2">
              {post.type === 'found' ? (
                <GlassButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  leftIcon={<ShieldCheck className="w-5 h-5" />}
                  onClick={() => onOpenClaim(post)}
                >
                  I Think This Is Mine (Submit Claim)
                </GlassButton>
              ) : (
                <GlassButton
                  variant="urgent"
                  size="lg"
                  className="w-full"
                  leftIcon={<CheckCircle2 className="w-5 h-5" />}
                  onClick={() => onOpenClaim(post)}
                >
                  I Found This Item (Notify Owner)
                </GlassButton>
              )}
              <p className="text-[11px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Protected by FoundIt Secure Verification Workflow</span>
              </p>
            </div>
          </GlassCard>

          {/* Reporter Profile Card */}
          <GlassCard level="secondary" className="p-5 flex flex-col gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Reported By
            </span>
            <div className="flex items-center gap-3">
              <img
                src={post.uploader.avatar}
                alt={post.uploader.name}
                className="w-12 h-12 rounded-2xl object-cover border border-white/20 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h5 className="font-bold text-white truncate text-sm">
                    {post.uploader.name}
                  </h5>
                  {post.uploader.isVerifiedHelper && (
                    <span
                      title="Verified Community Helper"
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    >
                      ⭐ Helper
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">@{post.uploader.username}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span>{post.uploader.returnsCount || 0} Successful Returns</span>
                  <span>&bull;</span>
                  <span className="text-emerald-400">
                    ★ {post.uploader.rating?.toFixed(1) || '5.0'}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Trust & Safe Return Tips Card */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe Return Guarantee</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Always arrange meetups in well-lit public places such as metro station security counters,
              mall help desks, or local police stations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
