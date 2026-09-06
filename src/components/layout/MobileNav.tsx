import React from 'react';
import { Home, Compass, Plus, UploadCloud, MessageSquare } from 'lucide-react';
import { GlitterStar } from '../common/GlitterOverlay';

interface MobileNavProps {
  currentView: 'feed' | 'discovery' | 'upload' | 'profile' | 'details' | 'uploads' | 'chat' | 'login' | 'admin';
  onNavigate: (view: 'feed' | 'discovery' | 'upload' | 'profile' | 'uploads' | 'chat' | 'login' | 'admin') => void;
  unreadChatCount?: number;
  myUploadsCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onNavigate,
  unreadChatCount = 0,
  myUploadsCount = 0,
}) => {
  const isFeedActive = currentView === 'feed' || currentView === 'details';
  const isLocationActive = currentView === 'discovery';
  const isUploadsActive = currentView === 'uploads';
  const isChatActive = currentView === 'chat';

  return (
    <nav
      id="mobile-bottom-navigation-dock"
      aria-label="Mobile Navigation"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-[#060c1c]/92 backdrop-blur-2xl border-t border-cyan-400/35 shadow-[0_-8px_32px_rgba(0,0,0,0.7)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      {/* Top Specular Rim Gleam */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent pointer-events-none" />

      {/* Convex Gloss Reflection Lens */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />

      <div className="flex items-center justify-around px-2 py-1 h-16 relative z-10">
        {/* 1. Feed / Home */}
        <button
          onClick={() => onNavigate('feed')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-95 cursor-pointer relative ${
            isFeedActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Main Feed"
        >
          <div className="relative">
            <Home className={`w-5 h-5 ${isFeedActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isFeedActive && (
              <span className="absolute -top-1 -right-1">
                <GlitterStar size={8} className="text-cyan-200" variant="fast" />
              </span>
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 ${isFeedActive ? 'font-black' : 'font-medium'}`}>
            Feed
          </span>
        </button>

        {/* 2. Explore / Location Radar */}
        <button
          onClick={() => onNavigate('discovery')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-95 cursor-pointer relative ${
            isLocationActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Location Radar"
        >
          <div className="relative">
            <Compass className={`w-5 h-5 ${isLocationActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {isLocationActive && (
              <span className="absolute -top-1 -right-1">
                <GlitterStar size={8} className="text-cyan-200" variant="fast" />
              </span>
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 ${isLocationActive ? 'font-black' : 'font-medium'}`}>
            Explore
          </span>
        </button>

        {/* 3. Elevated Floating Report (+) Action Button */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <button
            onClick={() => onNavigate('upload')}
            className="relative -mt-6 w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 text-slate-950 flex items-center justify-center shadow-[0_6px_22px_rgba(6,182,212,0.65)] border-2 border-white/70 active:scale-90 transition-transform cursor-pointer overflow-hidden group"
            title="Report Lost or Found Item"
          >
            {/* Top specular reflection */}
            <span className="absolute inset-x-0 top-0 h-1/2 bg-white/40 pointer-events-none rounded-t-2xl" />
            <Plus className="w-6 h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-300 relative z-10" />
            <span className="absolute bottom-1 right-1 pointer-events-none">
              <GlitterStar size={9} className="text-slate-950" variant="fast" />
            </span>
          </button>
          <span className="text-[10px] font-black tracking-tight text-cyan-200 mt-1">
            Report
          </span>
        </div>

        {/* 4. My Uploads */}
        <button
          onClick={() => onNavigate('uploads')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-95 cursor-pointer relative ${
            isUploadsActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="My Uploads"
        >
          <div className="relative">
            <UploadCloud className={`w-5 h-5 ${isUploadsActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {myUploadsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] rounded-full bg-cyan-400 text-slate-950 text-[9px] font-black flex items-center justify-center border border-slate-950 shadow-sm">
                {myUploadsCount}
              </span>
            )}
            {isUploadsActive && (
              <span className="absolute -top-1 -right-1">
                <GlitterStar size={8} className="text-cyan-200" variant="fast" />
              </span>
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 ${isUploadsActive ? 'font-black' : 'font-medium'}`}>
            My Posts
          </span>
        </button>

        {/* 5. Chattings & Messages */}
        <button
          onClick={() => onNavigate('chat')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all active:scale-95 cursor-pointer relative ${
            isChatActive ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Messages & Chattings"
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 ${isChatActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-2 px-1 min-w-[15px] h-[15px] rounded-full bg-emerald-400 text-slate-950 text-[9px] font-black flex items-center justify-center border border-slate-950 shadow-sm animate-pulse">
                {unreadChatCount}
              </span>
            )}
            {isChatActive && (
              <span className="absolute -top-1 -right-1">
                <GlitterStar size={8} className="text-cyan-200" variant="fast" />
              </span>
            )}
          </div>
          <span className={`text-[10px] tracking-tight mt-1 ${isChatActive ? 'font-black' : 'font-medium'}`}>
            Chats
          </span>
        </button>
      </div>
    </nav>
  );
};
