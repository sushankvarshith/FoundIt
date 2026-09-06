import React, { useState } from 'react';
import { ItemPost } from '../../types';
import { NEIGHBORHOODS } from '../../data/mockData';
import { searchService } from '../../services/searchService';
import { ItemCard } from '../feed/ItemCard';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { LostBadge, FoundBadge, StatusBadge } from '../common/Badges';
import { MapPin, Navigation, Compass, List, Map as MapIcon, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface LocationDiscoveryViewProps {
  onOpenDetails: (post: ItemPost) => void;
  onOpenClaim: (post: ItemPost) => void;
  onOpenShare: (post: ItemPost) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
}

export const LocationDiscoveryView: React.FC<LocationDiscoveryViewProps> = ({
  onOpenDetails,
  onOpenClaim,
  onOpenShare,
  onToggleLike,
  onToggleSave,
}) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('VRC Centre');
  const [radiusKm, setRadiusKm] = useState(10);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [activePinPost, setActivePinPost] = useState<ItemPost | null>(null);

  const posts = searchService.searchByArea(selectedNeighborhood, radiusKm, filterType);

  // Approximate relative coordinates for Nellore nodes inside simulated SVG map
  const getCoordinates = (post: ItemPost, index: number) => {
    // Generate balanced SVG coordinates around map center (250, 180)
    const angle = (index * 45 * Math.PI) / 180;
    const distance = Math.min(130, 20 + post.location.distanceKm * 14);
    const cx = 250 + Math.cos(angle) * distance;
    const cy = 180 + Math.sin(angle) * distance;
    return { cx, cy };
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 text-left">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Hyper-Local Radar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            Location Discovery
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse lost & found reports within your daily commute or neighborhood
          </p>
        </div>

        {/* List vs Map Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'list'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Area, Radius, Type */}
      <GlassCard level="secondary" className="p-4 sm:p-5 mb-6 flex flex-wrap items-center gap-4">
        {/* Neighborhood Picker */}
        <div className="flex items-center gap-2 min-w-[200px] flex-1">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-slate-900 border border-white/15 outline-none cursor-pointer"
          >
            <option value="All">All Nellore & Andhra Pradesh Regions</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Radius Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-slate-400 mr-1 hidden sm:inline">Radius:</span>
          {[1, 5, 10, 25, 50].map((r) => (
            <button
              key={r}
              onClick={() => setRadiusKm(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                radiusKm === r
                  ? 'bg-white/20 text-white border border-white/30 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {r} km
            </button>
          ))}
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 ml-auto">
          {(['all', 'lost', 'found'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                filterType === t
                  ? t === 'lost'
                    ? 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
                    : t === 'found'
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* MAP VIEW */}
      {activeTab === 'map' ? (
        <div className="relative rounded-3xl overflow-hidden border border-cyan-500/25 bg-slate-950 shadow-2xl h-[420px] sm:h-[550px] flex items-center justify-center">
          {/* Interactive Map Visual Stage */}
          <svg
            viewBox="0 0 500 360"
            className="w-full h-full object-cover select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="map-bg-gradient" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="70%" stopColor="#090d16" />
                <stop offset="100%" stopColor="#050810" />
              </radialGradient>
              <pattern id="area-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              </pattern>
            </defs>

            {/* Base Canvas */}
            <rect width="100%" height="100%" fill="url(#map-bg-gradient)" />
            <rect width="100%" height="100%" fill="url(#area-grid)" />

            {/* Major Arterial Roads & Nellore arterial corridor lines (Trunk Road, Penna River corridor) */}
            <path
              d="M 20 180 Q 150 140 250 180 T 480 190"
              fill="none"
              stroke="rgba(148, 163, 184, 0.25)"
              strokeWidth="12"
            />
            <path
              d="M 250 20 Q 240 160 250 340"
              fill="none"
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="10"
            />
            <path
              d="M 120 30 Q 220 140 380 320"
              fill="none"
              stroke="rgba(148, 163, 184, 0.15)"
              strokeWidth="8"
            />

            {/* Pulsing Radar concentric circles for radius */}
            <circle
              cx="250"
              cy="180"
              r="70"
              fill="rgba(16, 185, 129, 0.04)"
              stroke="rgba(16, 185, 129, 0.3)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <circle
              cx="250"
              cy="180"
              r="130"
              fill="rgba(16, 185, 129, 0.02)"
              stroke="rgba(16, 185, 129, 0.2)"
              strokeWidth="1"
              strokeDasharray="6 6"
            />

            {/* Center Anchor Point */}
            <circle cx="250" cy="180" r="6" fill="#10b981" />
            <circle cx="250" cy="180" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
            <text x="250" y="206" fill="#94a3b8" fontSize="9" textAnchor="middle" fontWeight="bold">
              {selectedNeighborhood}
            </text>

            {/* Post Markers */}
            {posts.map((post, idx) => {
              const { cx, cy } = getCoordinates(post, idx);
              const isLost = post.type === 'lost';
              const isSelected = activePinPost?.id === post.id;

              return (
                <g
                  key={post.id}
                  onClick={() => setActivePinPost(post)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 16 : 12}
                    fill={isLost ? '#f43f5e' : '#10b981'}
                    opacity={isSelected ? 0.95 : 0.8}
                    className="transition-all"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 22 : 16}
                    fill="none"
                    stroke={isLost ? '#fda4af' : '#6ee7b7'}
                    strokeWidth="2"
                    opacity={isSelected ? 0.9 : 0.4}
                  />
                  <text
                    x={cx}
                    y={cy + 3.5}
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {isLost ? 'L' : 'F'}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Top Status Pill */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/15 text-xs text-slate-200 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {posts.length} Reports within {radiusKm} km of {selectedNeighborhood}
            </span>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Lost Item</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Found Item</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Approx. zone</span>
            </div>
          </div>

          {/* Floating Glass Preview Card when marker clicked */}
          {activePinPost && (
            <div className="absolute top-4 right-4 max-w-xs w-full p-3.5 rounded-2xl bg-slate-900/90 border border-white/20 backdrop-blur-2xl shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  {activePinPost.type === 'lost' ? (
                    <LostBadge size="sm" />
                  ) : (
                    <FoundBadge size="sm" />
                  )}
                  <span className="text-[11px] text-slate-400">
                    {activePinPost.location.distanceKm} km away
                  </span>
                </div>
                <button
                  onClick={() => setActivePinPost(null)}
                  className="text-slate-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>

              <div className="flex gap-2.5">
                <img
                  src={activePinPost.images[0]}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-white truncate">
                    {activePinPost.title}
                  </h5>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {activePinPost.location.neighborhood}
                  </p>
                  <button
                    onClick={() => onOpenDetails(activePinPost)}
                    className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Post</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
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
    </div>
  );
};
