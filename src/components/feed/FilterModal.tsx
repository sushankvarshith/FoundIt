import React, { useState, useEffect } from 'react';
import { FeedFilterOptions, PostStatus } from '../../types';
import { CATEGORIES, NEIGHBORHOODS } from '../../data/mockData';
import { GlassModal } from '../common/GlassModal';
import { GlassButton } from '../common/GlassButton';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FeedFilterOptions;
  onApply: (newFilters: FeedFilterOptions) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
}) => {
  const [localFilters, setLocalFilters] = useState<FeedFilterOptions>({ ...filters });

  useEffect(() => {
    if (isOpen) {
      setLocalFilters({ ...filters });
    }
  }, [filters, isOpen]);

  const handleReset = () => {
    const reset: FeedFilterOptions = {
      type: 'all',
      category: 'All',
      neighborhood: 'All',
      maxDistanceKm: 50,
      status: 'all',
      hasRewardOnly: false,
      sortBy: 'recent',
    };
    setLocalFilters(reset);
  };

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
          <span>Filters & Discovery</span>
        </div>
      }
      subtitle="Refine lost and found reports in your community"
      maxWidth="md"
    >
      <div className="flex flex-col gap-6 text-left">
        {/* Post Type Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Report Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['all', 'lost', 'found'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setLocalFilters({ ...localFilters, type: t })}
                className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all duration-200 cursor-pointer ${
                  localFilters.type === t
                    ? t === 'lost'
                      ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 shadow-md'
                      : t === 'found'
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 shadow-md'
                      : 'bg-white/20 text-white border border-white/30 shadow-md'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {t === 'all' ? 'All Items' : t === 'lost' ? 'Lost Items' : 'Found Items'}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {CATEGORIES.map((cat) => {
              const isSelected = (localFilters.category || 'All') === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setLocalFilters({ ...localFilters, category: cat })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Neighborhood Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Nellore Area / Andhra Pradesh Region
          </label>
          <select
            value={localFilters.neighborhood || 'All'}
            onChange={(e) => setLocalFilters({ ...localFilters, neighborhood: e.target.value })}
            className="w-full py-2.5 px-3.5 rounded-xl text-sm text-white bg-slate-900 border border-white/15 outline-none cursor-pointer"
          >
            <option value="All">All Neighborhoods</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Distance Range Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Search Radius
            </label>
            <span className="text-xs font-bold text-emerald-400">
              Within {localFilters.maxDistanceKm || 25} km
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={localFilters.maxDistanceKm || 25}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, maxDistanceKm: parseInt(e.target.value, 10) })
            }
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>1 km</span>
            <span>10 km</span>
            <span>25 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Item Status
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['all', 'active', 'submitted', 'found', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setLocalFilters({ ...localFilters, status: st as PostStatus | 'all' })}
                className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  (localFilters.status || 'all') === st
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Bounty / Reward Switch */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
          <div>
            <span className="text-sm font-semibold text-white block">Reward / Bounty Only</span>
            <span className="text-xs text-slate-400">Show only posts with a monetary reward</span>
          </div>
          <input
            type="checkbox"
            checked={localFilters.hasRewardOnly || false}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, hasRewardOnly: e.target.checked })
            }
            className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            Sort Order
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'recent', label: 'Most Recent' },
              { id: 'closest', label: 'Closest Distance' },
              { id: 'liked', label: 'Most Liked' },
              { id: 'commented', label: 'Most Discussion' },
            ].map((sort) => (
              <button
                key={sort.id}
                onClick={() => setLocalFilters({ ...localFilters, sortBy: sort.id as any })}
                className={`py-2 px-3 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                  localFilters.sortBy === sort.id
                    ? 'bg-white/20 text-white border border-white/30 font-semibold'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
          <GlassButton
            type="button"
            variant="ghost"
            size="md"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={handleReset}
          >
            Reset Filters
          </GlassButton>
          <GlassButton type="button" variant="primary" size="md" onClick={handleApply}>
            Apply Filters
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
};
