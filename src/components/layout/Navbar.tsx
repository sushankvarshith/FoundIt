import React from 'react';
import { FoundItLogo } from '../common/FoundItLogo';
import { Search, Camera, Home, MapPin, ShieldCheck, ChevronDown, ShieldAlert } from 'lucide-react';
import { UserProfile } from '../../types';
import { GlitterStar } from '../common/GlitterOverlay';

interface NavbarProps {
  currentView: 'feed' | 'discovery' | 'upload' | 'profile' | 'details' | 'uploads' | 'chat' | 'login' | 'admin';
  onNavigate: (view: 'feed' | 'discovery' | 'upload' | 'profile' | 'uploads' | 'chat' | 'login' | 'admin') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenImageSearch: () => void;
  onOpenSafety: () => void;
  currentUser: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenImageSearch,
  onOpenSafety,
  currentUser,
}) => {
  const isHomeActive = currentView === 'feed' || currentView === 'details';
  const isLocationActive = currentView === 'discovery';
  const isProfileActive = currentView === 'profile';
  const isAdminActive = currentView === 'admin';

  return (
    <header
      id="main-navigation-header"
      className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#060c1c]/85 border-b border-cyan-500/25 transition-all duration-300 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.6)]"
    >
      {/* Top Specular Rim */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

      {/* Top Bar Row */}
      <div className="w-full px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2.5 sm:gap-6">
        {/* Left: Brand Emblem & FoundIt Name */}
        <div className="shrink-0 flex items-center justify-start text-left">
          <FoundItLogo onClick={() => onNavigate('feed')} />
        </div>

        {/* Center: Search & AI Scanner Bar with Liquid Glass Sheen (Desktop Only) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-2 sm:mx-4 min-w-0">
          <div className="relative flex items-center w-full h-11 rounded-full bg-[#0a1532]/80 px-4 border border-cyan-400/35 focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-500/30 transition-all duration-300 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_4px_20px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Gloss lens top highlight on search input */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-full" />

            <Search className="w-4 h-4 text-cyan-300/80 shrink-0 mr-2.5 relative z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search lost phones, keys, wallets in Nellore, Andhra Pradesh..."
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 outline-none truncate relative z-10"
            />

            {/* AI Photo Match Button with Liquid Shimmer & Glitter Star */}
            <button
              type="button"
              onClick={onOpenImageSearch}
              className="relative overflow-hidden ml-2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-400/30 via-cyan-400/30 to-purple-500/40 hover:from-teal-400/40 hover:to-purple-500/50 text-cyan-100 border border-cyan-300/50 text-xs font-black transition-all cursor-pointer group shrink-0 shadow-[0_0_14px_rgba(6,182,212,0.35)] animate-shimmer-sweep"
              title="AI Visual Match Search"
            >
              {/* Top rim specular line */}
              <span className="absolute inset-x-0 top-0 h-[1px] bg-white/70 pointer-events-none" />
              <Camera className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-cyan-200 relative z-10" />
              <span className="hidden sm:inline relative z-10 tracking-tight">Photo Match</span>
              <GlitterStar size={11} className="text-cyan-200 hidden sm:inline relative z-10" variant="fast" />
            </button>
          </div>
        </div>

        {/* Right Actions: Desktop Home, Location, Safety, and Profile */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
          {/* 1. Home Button */}
          <button
            onClick={() => onNavigate('feed')}
            className={`relative overflow-hidden h-10 px-4 rounded-full text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer select-none ${
              isHomeActive
                ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.45)] border border-white/50'
                : 'bg-[#0a1532]/75 hover:bg-[#0f214d]/85 text-slate-200 border border-cyan-500/30 hover:border-cyan-400/60 shadow-md'
            }`}
            title="Home / Main Feed"
          >
            {/* Specular gloss top reflection */}
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-full" />
            <Home className={`w-4 h-4 relative z-10 ${isHomeActive ? 'text-slate-950' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline relative z-10">Home</span>
            {isHomeActive && (
              <GlitterStar size={10} className="text-slate-950 relative z-10 hidden md:inline" variant="fast" />
            )}
          </button>

          {/* 2. Location Button */}
          <button
            onClick={() => onNavigate('discovery')}
            className={`relative overflow-hidden h-10 px-4 rounded-full text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer select-none ${
              isLocationActive
                ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.45)] border border-white/50'
                : 'bg-[#0a1532]/75 hover:bg-[#0f214d]/85 text-slate-200 border border-cyan-500/30 hover:border-cyan-400/60 shadow-md'
            }`}
            title="Location Discovery & Map"
          >
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none rounded-t-full" />
            <MapPin className={`w-4 h-4 relative z-10 ${isLocationActive ? 'text-slate-950' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline relative z-10">Location</span>
          </button>

          {/* 3. Safety Button */}
          <button
            onClick={onOpenSafety}
            className="relative overflow-hidden h-10 px-4 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 bg-[#0a1532]/75 hover:bg-[#0f214d]/85 text-slate-200 border border-cyan-500/30 hover:border-cyan-400/60 transition-all cursor-pointer shadow-md select-none"
            title="Community Safety & Return Guidelines"
          >
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-full" />
            <ShieldCheck className="w-4 h-4 text-cyan-400 relative z-10" />
            <span className="hidden sm:inline relative z-10">Safety</span>
          </button>

          {/* 4. Profile Icon / Button */}
          <button
            onClick={() => onNavigate('profile')}
            className={`relative overflow-hidden h-10 px-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer select-none ${
              isProfileActive
                ? 'bg-[#0a1532] text-cyan-300 border border-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.4)]'
                : 'bg-[#0a1532]/75 hover:bg-[#0f214d]/85 text-slate-200 border border-cyan-500/30 hover:border-cyan-400/60 shadow-md'
            }`}
            title="My Profile & Settings"
          >
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-full" />
            <div className="relative shrink-0 flex items-center justify-center z-10">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-cyan-300/60 shadow-sm"
              />
              {currentUser.isCommunityHelper && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[7px] font-black border border-slate-950">
                  ✓
                </span>
              )}
            </div>
            <span className="hidden md:inline relative z-10 font-extrabold">{currentUser.name.split(' ')[0]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400/70 hidden sm:inline relative z-10" />
          </button>

          {/* Admin Console Pill (Only for admin) */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`relative overflow-hidden h-10 px-3.5 rounded-full text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                isAdminActive
                  ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-white'
                  : 'bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/40 hover:border-red-400 shadow-md'
              }`}
              title="Open System Admin Console"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-300" />
              <span>Admin Console</span>
            </button>
          )}
        </div>

        {/* Mobile Right Actions (< md): AI Match pill + Safety icon + Profile avatar */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenImageSearch}
            className="relative overflow-hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-gradient-to-r from-teal-400/30 via-cyan-400/30 to-purple-500/40 text-cyan-100 border border-cyan-300/50 text-[11px] font-black shadow-[0_0_12px_rgba(6,182,212,0.35)] cursor-pointer active:scale-95 transition-transform"
            title="AI Visual Photo Match"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-200" />
            <span className="tracking-tight">AI Match</span>
            <GlitterStar size={9} className="text-cyan-200" variant="fast" />
          </button>

          <button
            onClick={onOpenSafety}
            className="w-9 h-9 rounded-full bg-[#0a1532]/85 text-cyan-300 border border-cyan-500/35 hover:border-cyan-300 flex items-center justify-center shadow-md cursor-pointer active:scale-95 transition-transform"
            title="Safety Guidelines"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`relative shrink-0 p-0.5 rounded-full border transition-all cursor-pointer active:scale-95 ${
              isProfileActive
                ? 'border-cyan-300 ring-2 ring-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'border-cyan-500/40'
            }`}
            title="Profile"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Mobile Search Row (< md): Dedicated sleek liquid glass search bar */}
      <div className="px-3.5 pb-2.5 md:hidden">
        <div className="relative flex items-center w-full h-10 rounded-full bg-[#0a1532]/85 px-3.5 border border-cyan-400/35 focus-within:border-cyan-300 focus-within:ring-2 focus-within:ring-cyan-500/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none rounded-t-full" />
          <Search className="w-3.5 h-3.5 text-cyan-300/80 shrink-0 mr-2 relative z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search phones, keys, wallets in Nellore, AP..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none truncate relative z-10"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="text-xs text-slate-400 hover:text-white px-1.5 relative z-10"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
