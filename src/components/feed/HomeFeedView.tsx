import React, { useState, useMemo } from 'react';
import { ItemPost, FeedFilterOptions } from '../../types';
import { CATEGORIES, NEIGHBORHOODS } from '../../data/mockData';
import { ItemCard } from './ItemCard';
import { FilterModal } from './FilterModal';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { GlitterStar } from '../common/GlitterOverlay';
import {
  SlidersHorizontal,
  MapPin,
  Sparkles,
  Gift,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Search,
  Cpu,
  Smartphone,
  Laptop,
  Wallet,
  Key,
  ShoppingBag,
  FileText,
  Gem,
  Glasses,
  Heart,
  Package,
} from 'lucide-react';

interface HomeFeedViewProps {
  posts: ItemPost[];
  onOpenDetails: (post: ItemPost) => void;
  onOpenClaim: (post: ItemPost) => void;
  onOpenShare: (post: ItemPost) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onNavigateUpload: () => void;
  searchQuery: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Sparkles className="w-3.5 h-3.5" />,
  Electronics: <Cpu className="w-3.5 h-3.5" />,
  'Mobile Phones': <Smartphone className="w-3.5 h-3.5" />,
  Laptops: <Laptop className="w-3.5 h-3.5" />,
  Wallets: <Wallet className="w-3.5 h-3.5" />,
  Keys: <Key className="w-3.5 h-3.5" />,
  Bags: <ShoppingBag className="w-3.5 h-3.5" />,
  Documents: <FileText className="w-3.5 h-3.5" />,
  Jewelry: <Gem className="w-3.5 h-3.5" />,
  Accessories: <Glasses className="w-3.5 h-3.5" />,
  Pets: <Heart className="w-3.5 h-3.5" />,
  Other: <Package className="w-3.5 h-3.5" />,
};

export const HomeFeedView: React.FC<HomeFeedViewProps> = ({
  posts,
  onOpenDetails,
  onOpenClaim,
  onOpenShare,
  onToggleLike,
  onToggleSave,
  onNavigateUpload,
  searchQuery,
}) => {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [feedType, setFeedType] = useState<'all' | 'lost' | 'found' | 'reward'>('all');

  const [filters, setFilters] = useState<FeedFilterOptions>({
    type: 'all',
    category: 'All',
    neighborhood: 'All',
    maxDistanceKm: 50,
    status: 'all',
    hasRewardOnly: false,
    sortBy: 'recent',
  });

  // Filtered & Sorted Posts
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = post.title.toLowerCase().includes(q);
          const matchDesc = post.description.toLowerCase().includes(q);
          const matchCat = post.category.toLowerCase().includes(q);
          const matchLoc = post.location.neighborhood.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat && !matchLoc) return false;
        }

        // Feed type quick switch
        if (feedType === 'lost' && post.type !== 'lost') return false;
        if (feedType === 'found' && post.type !== 'found') return false;
        if (feedType === 'reward' && !post.reward?.hasReward) return false;

        // Category filter (chip or modal)
        const effectiveCategory = selectedCategory !== 'All' ? selectedCategory : (filters.category || 'All');
        if (effectiveCategory !== 'All' && post.category.toLowerCase() !== effectiveCategory.toLowerCase()) {
          return false;
        }

        // Modal filters
        if (filters.type !== 'all' && post.type !== filters.type) return false;
        if (filters.neighborhood !== 'All' && post.location.neighborhood.toLowerCase() !== filters.neighborhood.toLowerCase()) {
          return false;
        }
        if (filters.maxDistanceKm && filters.maxDistanceKm < 50 && post.location.distanceKm > filters.maxDistanceKm) {
          return false;
        }
        if (filters.status !== 'all' && post.status !== filters.status) return false;
        if (filters.hasRewardOnly && !post.reward?.hasReward) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'closest') return a.location.distanceKm - b.location.distanceKm;
        if (filters.sortBy === 'liked') return b.stats.likes - a.stats.likes;
        if (filters.sortBy === 'commented') return b.stats.commentsCount - a.stats.commentsCount;
        return 0; // default recent
      });
  }, [posts, searchQuery, feedType, selectedCategory, filters]);

  const activeFilterCount =
    (filters.type !== 'all' ? 1 : 0) +
    (filters.neighborhood !== 'All' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    (filters.hasRewardOnly ? 1 : 0) +
    (filters.maxDistanceKm && filters.maxDistanceKm < 50 ? 1 : 0) +
    (filters.category && filters.category !== 'All' ? 1 : 0);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setFeedType('all');
    setFilters({
      type: 'all',
      category: 'All',
      neighborhood: 'All',
      maxDistanceKm: 50,
      status: 'all',
      hasRewardOnly: false,
      sortBy: 'recent',
    });
  };

  return (
    <div id="home-feed-container" className="max-w-7xl mx-auto py-6 px-4 text-left">
      {/* Community Banner / Live Network Pulse with Skyline Watermark (Section 7) */}
      <div className="relative rounded-3xl border border-cyan-400/35 bg-gradient-to-r from-slate-950/95 via-[#091534]/90 to-[#0e1f4a]/80 backdrop-blur-3xl p-5 sm:p-6 mb-6 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1.5px_2px_rgba(255,255,255,0.4)] overflow-hidden">
        {/* Top Specular Bright Line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent pointer-events-none" />

        {/* Convex Gloss Reflection Lens */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] via-white/[0.02] to-transparent pointer-events-none rounded-t-3xl" />

        {/* Subtle ambient cyan glow on left */}
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Nellore landmarks & Penna river silhouette watermark illustration on the right */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-30 pointer-events-none hidden md:flex items-end justify-end pr-8 select-none">
          <svg viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-24 text-cyan-400">
            {/* Clock tower & iconic arch silhouette */}
            <rect x="145" y="15" width="30" height="105" fill="currentColor" opacity="0.35" rx="3" />
            <rect x="135" y="30" width="50" height="8" fill="currentColor" opacity="0.45" />
            <polygon points="145,15 160,2 175,15" fill="currentColor" opacity="0.5" />
            <circle cx="160" cy="45" r="7" fill="currentColor" opacity="0.6" />
            {/* Penna bridge arches & civic structures */}
            <path d="M 20 100 Q 60 70 100 100 T 180 100 T 260 100 T 320 100" stroke="currentColor" strokeWidth="4" opacity="0.35" fill="none" />
            <rect x="220" y="40" width="26" height="80" fill="currentColor" opacity="0.25" rx="3" />
            <rect x="260" y="55" width="30" height="65" fill="currentColor" opacity="0.2" rx="3" />
            <rect x="80" y="45" width="32" height="75" fill="currentColor" opacity="0.2" rx="3" />
            <rect x="40" y="60" width="28" height="60" fill="currentColor" opacity="0.15" rx="3" />
          </svg>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative overflow-hidden w-12 h-12 rounded-2xl bg-cyan-500/25 text-cyan-200 flex items-center justify-center shrink-0 border border-cyan-300/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-white/30 rounded-t-2xl pointer-events-none" />
              <ShieldCheck className="w-6 h-6 relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-base sm:text-lg font-black text-white tracking-tight">
                  Nellore & Andhra Pradesh Community Recovery Network
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <GlitterStar size={12} className="text-cyan-300" variant="fast" />
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Over <span className="text-cyan-300 font-black">1,280 items</span> returned safely across Gachibowli, Hitech City, and Banjara Hills.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-end lg:self-auto">
            <div className="hidden xl:flex items-center gap-1.5 text-cyan-200/90 font-handwriting italic text-sm pr-2 select-none">
              <span>Stronger Together ♡</span>
              <GlitterStar size={11} className="text-cyan-300" variant="slow" />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 hidden sm:inline font-semibold">
                Lost something today?
              </span>
              <button
                onClick={onNavigateUpload}
                className="relative overflow-hidden px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-[0_8px_25px_rgba(6,182,212,0.5)] hover:shadow-[0_12px_32px_rgba(6,182,212,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border border-white/50 animate-shimmer-sweep"
              >
                <span className="absolute inset-x-0 top-0 h-[1.5px] bg-white/70 pointer-events-none" />
                <span className="relative z-10">Report Immediately</span>
                <GlitterStar size={12} className="text-slate-950 relative z-10" variant="fast" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Feed Controls Header (Section 8) - Responsive for Mobile, Tablet & Desktop */}
      <div className="flex flex-col gap-3.5 mb-6">
        {/* Top Control Bar: Segment Capsule + Filter Button */}
        <div className="flex items-center justify-between gap-2.5 w-full">
          {/* Scrollable Segment Capsule */}
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-none py-1">
            <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-[#08132c]/90 border border-cyan-400/35 backdrop-blur-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.5)]">
              {/* Upper specular reflection */}
              <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-full" />

              {/* All Items */}
              <button
                type="button"
                onClick={() => setFeedType('all')}
                className={`shrink-0 relative overflow-hidden px-3.5 sm:px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  feedType === 'all'
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white shadow-[0_4px_18px_rgba(99,102,241,0.5)] border border-white/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {feedType === 'all' && (
                  <span className="absolute inset-x-0 top-0 h-1/2 bg-white/20 pointer-events-none rounded-t-full" />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>All Items ({posts.length})</span>
                  {feedType === 'all' && <GlitterStar size={10} className="text-purple-200" variant="fast" />}
                </span>
              </button>

              {/* Lost Items with Pink Dot */}
              <button
                type="button"
                onClick={() => setFeedType('lost')}
                className={`shrink-0 relative overflow-hidden flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  feedType === 'lost'
                    ? 'bg-rose-500/30 text-rose-200 border border-rose-400/60 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                <span className="relative z-10">Lost Items</span>
              </button>

              {/* Found Items with Cyan Dot */}
              <button
                type="button"
                onClick={() => setFeedType('found')}
                className={`shrink-0 relative overflow-hidden flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  feedType === 'found'
                    ? 'bg-teal-500/30 text-teal-200 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <span className="relative z-10">Found Items</span>
              </button>

              {/* Bounty / Rewards with Golden Gift */}
              <button
                type="button"
                onClick={() => setFeedType('reward')}
                className={`shrink-0 relative overflow-hidden flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                  feedType === 'reward'
                    ? 'bg-amber-500/30 text-amber-200 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Gift className="w-3.5 h-3.5 text-amber-300 relative z-10" />
                <span className="relative z-10">Bounty / Rewards</span>
              </button>
            </div>
          </div>

          {/* Filter Modal Trigger Pill (Always accessible, never isolated) */}
          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => setFilterModalOpen(true)}
              className="relative overflow-hidden h-10 px-3.5 sm:px-4 rounded-full text-xs font-black bg-[#08132c]/90 hover:bg-[#0e204a] text-slate-200 hover:text-white border border-cyan-400/35 hover:border-cyan-300 transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
              title="Open filters modal"
            >
              <span className="absolute inset-x-0 top-0 h-1/2 bg-white/10 pointer-events-none rounded-t-full" />
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-300 relative z-10" />
              <span className="relative z-10 hidden xs:inline sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black flex items-center justify-center ml-0.5 shadow-[0_0_8px_rgba(34,211,238,0.7)] relative z-10">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Category Chips with Liquid Glass Specular Styling & Responsive No-Squish Scroll */}
        <div className="relative w-full">
          <div className="w-full overflow-x-auto scrollbar-none scroll-smooth pb-1 flex items-center gap-2 py-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              const icon = CATEGORY_ICONS[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 relative overflow-hidden px-3.5 sm:px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all duration-300 cursor-pointer select-none flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-400 to-teal-300 text-slate-950 font-black shadow-[0_0_18px_rgba(34,211,238,0.5)] border border-white/60 scale-[1.02]'
                      : 'bg-[#08132c]/85 text-slate-300 font-bold border border-cyan-500/25 hover:border-cyan-300/60 hover:text-white shadow-sm hover:bg-[#0c1c40]'
                  }`}
                >
                  <span className="absolute inset-x-0 top-0 h-1/2 bg-white/20 pointer-events-none rounded-t-full" />
                  {icon && (
                    <span
                      className={`relative z-10 ${
                        isSelected ? 'text-slate-950' : 'text-cyan-400'
                      }`}
                    >
                      {icon}
                    </span>
                  )}
                  <span className="relative z-10">{cat}</span>
                  {isSelected && (
                    <GlitterStar size={9} className="text-slate-950 relative z-10" variant="fast" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Filter Indicators Bar if any active */}
      {(activeFilterCount > 0 || selectedCategory !== 'All' || searchQuery) && (
        <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400">Filtering by:</span>
            {searchQuery && (
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-medium">
                "{searchQuery}"
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-medium">
                {selectedCategory}
              </span>
            )}
            {filters.neighborhood !== 'All' && (
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-medium">
                Near {filters.neighborhood}
              </span>
            )}
            {filters.maxDistanceKm !== 25 && (
              <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-medium">
                Within {filters.maxDistanceKm}km
              </span>
            )}
          </div>

          <button
            onClick={handleResetFilters}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear filters</span>
          </button>
        </div>
      )}

      {/* Feed Grid (Section 9 & 10) */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <Search className="w-8 h-8 text-slate-500" />
          </div>
          <h4 className="text-lg font-bold text-white">No items found</h4>
          <p className="text-xs text-slate-400 max-w-sm">
            We couldn't find any lost or found reports matching your current filter criteria.
          </p>
          <GlassButton
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="mt-2"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset All Filters
          </GlassButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <ItemCard
              key={post.id}
              post={post}
              onOpenDetails={onOpenDetails}
              onToggleLike={onToggleLike}
              onToggleSave={onToggleSave}
              onOpenShare={onOpenShare}
              onOpenClaim={onOpenClaim}
            />
          ))}
        </div>
      )}

      {/* Filter Bottom Sheet / Modal */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={{ ...filters, category: selectedCategory !== 'All' ? selectedCategory : filters.category }}
        onApply={(newFilters) => {
          setFilters(newFilters);
          if (newFilters.category) {
            setSelectedCategory(newFilters.category);
          }
        }}
      />
    </div>
  );
};
