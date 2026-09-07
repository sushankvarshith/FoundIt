import React, { useState, useEffect } from 'react';
import { ItemPost, UserProfile } from './types';
import { itemService } from './services/itemService';
import { authService } from './services/authService';
import { notificationService } from './services/notificationService';
import { chatService } from './services/chatService';
import { Navbar } from './components/layout/Navbar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { MobileNav } from './components/layout/MobileNav';
import { HomeFeedView } from './components/feed/HomeFeedView';
import { LocationDiscoveryView } from './components/location/LocationDiscoveryView';
import { UploadWizard } from './components/upload/UploadWizard';
import { ProfileView } from './components/profile/ProfileView';
import { MyUploadsView } from './components/profile/MyUploadsView';
import { ChatView } from './components/chat/ChatView';
import { ItemDetailsView } from './components/item/ItemDetailsView';
import { LoginPage } from './components/auth/LoginPage';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { ImageSearchModal } from './components/search/ImageSearchModal';
import { NotificationPanel } from './components/notifications/NotificationPanel';
import { SafetyGuidelinesModal } from './components/common/SafetyGuidelinesModal';
import { ClaimModal } from './components/claim/ClaimModal';
import { ShareModal } from './components/common/ShareModal';
import { ToastProvider } from './components/common/Toast';
import { AmbientGlitterField } from './components/common/GlitterOverlay';
import { ShieldCheck } from 'lucide-react';

export type AppView =
  | 'feed'
  | 'discovery'
  | 'upload'
  | 'profile'
  | 'details'
  | 'uploads'
  | 'chat'
  | 'login'
  | 'admin';

export default function App() {
  // ─── Authentication state ────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    authService.isAuthenticated()
  );

  // Navigation & View state – always start on login if not authenticated
  const [currentView, setCurrentView] = useState<AppView>(() => {
    return authService.isAuthenticated() ? 'feed' : 'login';
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Item detail view state
  const [selectedPost, setSelectedPost] = useState<ItemPost | null>(null);

  // Modal dialog states
  const [isImageSearchOpen, setIsImageSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [claimPost, setClaimPost] = useState<ItemPost | null>(null);
  const [sharePost, setSharePost] = useState<ItemPost | null>(null);

  // Chat direct thread opening state
  const [chatInitialConvId, setChatInitialConvId] = useState<string>('');

  // App data state
  const [posts, setPosts] = useState<ItemPost[]>(() => itemService.getAllPosts());
  const [unreadChatCount, setUnreadChatCount] = useState<number>(() =>
    chatService.getTotalUnreadCount()
  );

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => authService.getCurrentUser());
  const myUploadsCount = posts.filter(
    (p) =>
      p.uploader.id === currentUser.id ||
      p.uploader.username === currentUser.username ||
      (currentUser.id === 'usr_sushank' && p.uploader.id === 'usr_1')
  ).length;

  // Synchronize with Java REST backend on mount and when authentication changes
  useEffect(() => {
    itemService.syncWithBackend().then((fresh) => {
      if (fresh && fresh.length > 0) {
        setPosts(fresh);
      }
    });
    authService.syncUsersWithBackend().catch(() => {});
  }, [isAuthenticated]);

  // ─── Guard: Force login view when session is not valid ──────────
  useEffect(() => {
    if (!isAuthenticated && currentView !== 'login') {
      setCurrentView('login');
    }
  }, [isAuthenticated, currentView]);

  // Synchronize items & chat state
  const refreshAppData = () => {
    setPosts([...itemService.getAllPosts()]);
    setUnreadChatCount(chatService.getTotalUnreadCount());
  };

  const handleToggleLike = (id: string) => {
    itemService.toggleLike(id);
    refreshAppData();
  };

  const handleToggleSave = (id: string) => {
    itemService.toggleSave(id);
    refreshAppData();
  };

  const handleOpenDetails = (post: ItemPost) => {
    if (!isAuthenticated) { setCurrentView('login'); return; }
    setSelectedPost(post);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenItemById = (itemId: string) => {
    const found = itemService.getPostById(itemId);
    if (found) {
      handleOpenDetails(found);
    }
  };

  const handleBackToFeed = () => {
    setCurrentView('feed');
    setSelectedPost(null);
  };

  // ─── Auth-enforced navigation ──────────────────────────────────
  const handleNavigate = (view: AppView) => {
    // Login view is always accessible
    if (view === 'login') {
      setCurrentView('login');
      setSelectedPost(null);
      return;
    }
    // Block all other views when not authenticated
    if (!isAuthenticated) {
      setCurrentView('login');
      return;
    }
    // Admin view requires admin role
    if (view === 'admin' && currentUser.role !== 'admin') {
      setCurrentView('feed');
      return;
    }
    setCurrentView(view);
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Sign-out handler ──────────────────────────────────────────
  const handleSignOut = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentView('login');
    setSelectedPost(null);
    setSearchQuery('');
    setChatInitialConvId('');
    setIsImageSearchOpen(false);
    setIsNotificationsOpen(false);
    setIsSafetyOpen(false);
    setClaimPost(null);
    setSharePost(null);
  };

  // ═══════════════════════════════════════════════════════════════
  //  RENDER: If NOT authenticated → show ONLY the LoginPage
  // ═══════════════════════════════════════════════════════════════
  if (!isAuthenticated) {
    return (
      <ToastProvider>
        <div className="min-h-screen bg-[#060c1c] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased relative overflow-x-hidden">
          {/* Ambient liquid glass bokeh glows */}
          <div className="fixed -top-32 left-1/4 w-[600px] h-[500px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
          <div className="fixed top-1/4 -left-32 w-[500px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
          <div className="fixed bottom-10 -right-20 w-[550px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
          <div className="fixed -bottom-40 left-1/3 w-[500px] h-[500px] bg-teal-500/12 rounded-full blur-[150px] pointer-events-none" />
          <AmbientGlitterField />

          {/* ONLY LoginPage — no navbar, no sidebar, no footer, no mobile nav */}
          <LoginPage
            onSuccess={(user) => {
              setCurrentUser(user);
              setIsAuthenticated(true);
              refreshAppData();
              if (user.role === 'admin') {
                setCurrentView('admin');
              } else {
                setCurrentView('feed');
              }
            }}
            onCancel={() => {
              // Cannot cancel when not authenticated — stay on login
            }}
          />
        </div>
      </ToastProvider>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  //  RENDER: Authenticated — full app shell
  // ═══════════════════════════════════════════════════════════════
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#060c1c] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased relative overflow-x-hidden">
        {/* Ambient liquid glass bokeh glows matching reference image */}
        <div className="fixed -top-32 left-1/4 w-[600px] h-[500px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="fixed top-1/4 -left-32 w-[500px] h-[600px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="fixed bottom-10 -right-20 w-[550px] h-[600px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="fixed -bottom-40 left-1/3 w-[500px] h-[500px] bg-teal-500/12 rounded-full blur-[150px] pointer-events-none" />

        {/* Shimmering Ambient Twinkling Glitter Stars */}
        <AmbientGlitterField />

        {/* Global Navigation Header with search bar, Home, Location, and Safety buttons */}
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenImageSearch={() => setIsImageSearchOpen(true)}
          onOpenSafety={() => setIsSafetyOpen(true)}
          currentUser={currentUser}
        />

        {/* Two-Column App Layout with Left Navbar & Main Viewport */}
        <div className="flex-1 flex w-full">
          {/* Left Navigation Sidebar (Main Feed, My Uploads, Chats) */}
          <LeftSidebar
            currentView={currentView}
            onNavigate={handleNavigate}
            unreadChatCount={unreadChatCount}
            myUploadsCount={myUploadsCount}
            currentUser={currentUser}
          />

          {/* Main View Area */}
          <main className="flex-1 min-w-0 pb-28 md:pb-12">
            {currentView === 'feed' && (
              <HomeFeedView
                posts={posts}
                onOpenDetails={handleOpenDetails}
                onOpenClaim={(post) => setClaimPost(post)}
                onOpenShare={(post) => setSharePost(post)}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
                onNavigateUpload={() => handleNavigate('upload')}
                searchQuery={searchQuery}
              />
            )}

            {currentView === 'uploads' && (
              <MyUploadsView
                posts={posts}
                onRefreshData={refreshAppData}
                onOpenDetails={handleOpenDetails}
                onOpenClaim={(post) => setClaimPost(post)}
                onOpenShare={(post) => setSharePost(post)}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
                onNavigateUpload={() => handleNavigate('upload')}
              />
            )}

            {currentView === 'chat' && (
              <ChatView
                onOpenItem={handleOpenItemById}
                onOpenSafety={() => setIsSafetyOpen(true)}
                initialConversationId={chatInitialConvId}
              />
            )}

            {currentView === 'discovery' && (
              <LocationDiscoveryView
                onOpenDetails={handleOpenDetails}
                onOpenClaim={(post) => setClaimPost(post)}
                onOpenShare={(post) => setSharePost(post)}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
              />
            )}

            {currentView === 'upload' && (
              <UploadWizard
                onComplete={(newPost) => {
                  refreshAppData();
                  handleOpenDetails(newPost);
                }}
                onCancel={() => handleNavigate('feed')}
              />
            )}

            {currentView === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                onProfileUpdated={(updated) => {
                  setCurrentUser(updated);
                  refreshAppData();
                }}
                onOpenLogin={() => handleNavigate('login')}
                onSignOut={handleSignOut}
                onOpenDetails={handleOpenDetails}
                onOpenClaim={(post) => setClaimPost(post)}
                onOpenShare={(post) => setSharePost(post)}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
              />
            )}

            {currentView === 'admin' && currentUser.role === 'admin' && (
              <AdminDashboardView
                onBackToFeed={() => handleNavigate('feed')}
                onOpenDetails={handleOpenDetails}
                posts={posts}
                onRefreshData={refreshAppData}
              />
            )}

            {currentView === 'details' && selectedPost && (
              <ItemDetailsView
                post={selectedPost}
                onBack={handleBackToFeed}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
                onOpenShare={(post) => setSharePost(post)}
                onOpenClaim={(post) => setClaimPost(post)}
              />
            )}
          </main>
        </div>

        {/* Global Footer */}
        <footer className="border-t border-white/10 bg-slate-950/60 backdrop-blur-md py-8 px-4 text-slate-400 text-xs text-left">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-extrabold text-white text-base tracking-tight">
                Found<span className="text-emerald-400">It</span>
              </span>
              <span className="text-slate-600">&bull;</span>
              <p className="text-slate-400 text-xs">
                Community Lost & Found Network for Nellore, Andhra Pradesh
              </p>
            </div>

            <div className="flex items-center gap-5 text-slate-400 flex-wrap justify-center">
              <button
                onClick={() => handleNavigate('feed')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Main Feed
              </button>
              <button
                onClick={() => handleNavigate('uploads')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                My Uploads
              </button>
              <button
                onClick={() => handleNavigate('chat')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Chats
              </button>
              <button
                onClick={() => handleNavigate('discovery')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Location
              </button>
              <button
                onClick={() => setIsSafetyOpen(true)}
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safety Protocol</span>
              </button>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileNav
          currentView={currentView}
          onNavigate={handleNavigate}
          unreadChatCount={unreadChatCount}
          myUploadsCount={myUploadsCount}
        />

        {/* Global Modals & Dialogs */}
        <ImageSearchModal
          isOpen={isImageSearchOpen}
          onClose={() => setIsImageSearchOpen(false)}
          onSelectResult={(post) => {
            handleOpenDetails(post);
          }}
        />

        <NotificationPanel
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onOpenItem={(post) => handleOpenDetails(post)}
        />

        <SafetyGuidelinesModal
          isOpen={isSafetyOpen}
          onClose={() => setIsSafetyOpen(false)}
        />

        <ClaimModal
          isOpen={Boolean(claimPost)}
          onClose={() => setClaimPost(null)}
          post={claimPost}
          onClaimSubmitted={() => {
            refreshAppData();
          }}
          onOpenChat={(convId) => {
            setClaimPost(null);
            setChatInitialConvId(convId);
            handleNavigate('chat');
          }}
        />

        <ShareModal
          isOpen={Boolean(sharePost)}
          onClose={() => setSharePost(null)}
          post={sharePost}
        />
      </div>
    </ToastProvider>
  );
}
