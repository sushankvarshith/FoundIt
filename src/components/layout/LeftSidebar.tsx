import React from 'react';
import {
  LayoutGrid,
  UploadCloud,
  MessageSquare,
  PlusCircle,
  ChevronRight,
  Sprout,
  ShieldCheck,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { GlitterStar } from '../common/GlitterOverlay';

interface LeftSidebarProps {
  currentView: 'feed' | 'discovery' | 'upload' | 'profile' | 'details' | 'uploads' | 'chat' | 'login' | 'admin';
  onNavigate: (view: 'feed' | 'discovery' | 'upload' | 'profile' | 'uploads' | 'chat' | 'login' | 'admin') => void;
  unreadChatCount: number;
  myUploadsCount: number;
  currentUser: UserProfile;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentView,
  onNavigate,
  unreadChatCount,
  myUploadsCount,
  currentUser,
}) => {
  const isFeedActive = currentView === 'feed' || currentView === 'details';
  const isUploadsActive = currentView === 'uploads';
  const isChatActive = currentView === 'chat';

  return (
    <aside
      id="left-navigation-sidebar"
      className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 sticky top-20 h-[calc(100vh-5rem)] p-4 select-none z-30"
    >
      <div className="flex-1 flex flex-col justify-between rounded-3xl border border-cyan-400/25 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1.5px_2px_rgba(255,255,255,0.35)] backdrop-blur-2xl bg-[#070f26]/80 overflow-hidden relative text-left">
        {/* Specular Top Rim */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent pointer-events-none" />

        {/* Ambient liquid cyan glow inside left nav */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Navigation Links */}
        <div className="space-y-2 z-10">
          <div className="px-2 pt-1 pb-2 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/80">
              WORKSPACE
            </span>
            <GlitterStar size={10} className="text-cyan-400" variant="slow" />
          </div>

          {/* 1. Main Feed */}
          <button
            onClick={() => onNavigate('feed')}
            className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-300 group cursor-pointer text-left relative overflow-hidden ${
              isFeedActive
                ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/15 to-transparent text-white border-l-2 border-cyan-300 shadow-[0_4px_20px_rgba(6,182,212,0.25)]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            {isFeedActive && (
              <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-cyan-300/50 via-white/40 to-transparent pointer-events-none" />
            )}

            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 relative overflow-hidden ${
                  isFeedActive
                    ? 'bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.5)] border border-white/50'
                    : 'bg-white/5 border border-white/10 text-cyan-300 group-hover:text-white group-hover:bg-white/10'
                }`}
              >
                {isFeedActive && (
                  <span className="absolute inset-x-0 top-0 h-1/2 bg-white/40 rounded-t-xl pointer-events-none" />
                )}
                <LayoutGrid className="w-4 h-4 relative z-10" />
              </div>

              <div className="min-w-0">
                <span className="text-xs font-bold block truncate tracking-tight text-white flex items-center gap-1.5">
                  <span>Main Feed</span>
                  {isFeedActive && <GlitterStar size={9} className="text-cyan-300" variant="fast" />}
                </span>
                <span className="text-[10px] text-slate-400 block truncate group-hover:text-slate-300">
                  Lost & found posts
                </span>
              </div>
            </div>
          </button>

          {/* 2. My Uploads */}
          <button
            onClick={() => onNavigate('uploads')}
            className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-300 group cursor-pointer text-left relative overflow-hidden ${
              isUploadsActive
                ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/15 to-transparent text-white border-l-2 border-cyan-300 shadow-[0_4px_20px_rgba(6,182,212,0.25)]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 relative overflow-hidden ${
                  isUploadsActive
                    ? 'bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.5)] border border-white/50'
                    : 'bg-white/5 border border-white/10 text-cyan-300 group-hover:text-white group-hover:bg-white/10'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <span className="text-xs font-bold block truncate tracking-tight text-white">
                  My Uploads
                </span>
                <span className="text-[10px] text-slate-400 block truncate group-hover:text-slate-300">
                  Manage your reports
                </span>
              </div>
            </div>

            {/* Badge pill with shiny rim */}
            {myUploadsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-black text-[11px] flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.5)] border border-white/40 shrink-0">
                {myUploadsCount}
              </span>
            )}
          </button>

          {/* 3. Chats */}
          <button
            onClick={() => onNavigate('chat')}
            className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-300 group cursor-pointer text-left relative overflow-hidden ${
              isChatActive
                ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/15 to-transparent text-white border-l-2 border-cyan-300 shadow-[0_4px_20px_rgba(6,182,212,0.25)]'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                  isChatActive
                    ? 'bg-gradient-to-tr from-emerald-400 via-teal-300 to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(52,211,153,0.5)] border border-white/50'
                    : 'bg-white/5 border border-white/10 text-cyan-300 group-hover:text-white group-hover:bg-white/10'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
              </div>

              <div className="min-w-0">
                <span className="text-xs font-bold block truncate tracking-tight text-white">
                  Chats
                </span>
                <span className="text-[10px] text-slate-400 block truncate group-hover:text-slate-300">
                  Primary & Secondary inbox
                </span>
              </div>
            </div>

            {unreadChatCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/30 border border-rose-400/50 text-rose-200 font-black text-[10px] shrink-0 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                {unreadChatCount} new
              </span>
            )}
          </button>

          {/* 4. Admin Console (Only visible to admin) */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all duration-300 group cursor-pointer text-left relative overflow-hidden ${
                currentView === 'admin'
                  ? 'bg-gradient-to-r from-red-500/30 via-amber-500/20 to-transparent text-white border-l-2 border-red-400 shadow-[0_4px_20px_rgba(239,68,68,0.3)]'
                  : 'text-red-200/90 hover:text-white hover:bg-red-500/10 border border-red-500/20'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    currentView === 'admin'
                      ? 'bg-gradient-to-tr from-red-500 to-amber-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-white/50'
                      : 'bg-red-500/20 text-red-300 group-hover:bg-red-500/30'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>

                <div className="min-w-0">
                  <span className="text-xs font-black block truncate tracking-tight text-red-200">
                    Admin Console
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate">
                    Users & Moderation
                  </span>
                </div>
              </div>
            </button>
          )}

          {/* Report Item Glowing Gradient Button with Shimmer Sweep and Glitter Star */}
          <div className="pt-3">
            <button
              onClick={() => onNavigate('upload')}
              className="relative overflow-hidden w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500 text-slate-950 font-black text-xs shadow-[0_8px_25px_-3px_rgba(6,182,212,0.5)] hover:shadow-[0_12px_32px_rgba(6,182,212,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-white/40 animate-shimmer-sweep"
            >
              {/* Top spec rim */}
              <span className="absolute inset-x-0 top-0 h-[1.5px] bg-white/70 pointer-events-none" />
              <PlusCircle className="w-4 h-4 relative z-10" />
              <span className="relative z-10 tracking-tight">Report Item</span>
              <GlitterStar size={11} className="text-slate-950 relative z-10" variant="fast" />
            </button>
          </div>
        </div>

        {/* Bottom Section: User Profile & Inspiration Quote */}
        <div className="z-10 pt-3 border-t border-cyan-500/20 space-y-3">
          {/* User Profile Card */}
          <button
            onClick={() => onNavigate('profile')}
            className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-white/5 transition-all text-left group cursor-pointer relative"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-cyan-300/50 shadow-sm"
              />
              {currentUser.isCommunityHelper && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[8px] font-black border border-slate-950">
                  ✓
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white truncate block group-hover:text-cyan-300">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-400 truncate block">
                {currentUser.reputationBadge}
              </span>
            </div>

            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
          </button>

          {/* Inspirational Quote */}
          <div className="flex items-center gap-2 px-2 pt-1 text-slate-400 text-[11px] italic">
            <Sprout className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <p className="truncate">"A kinder world finds its way back."</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
