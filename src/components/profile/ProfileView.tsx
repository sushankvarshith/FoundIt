import React, { useState } from 'react';
import { ItemPost, PostStatus, UserProfile } from '../../types';
import { authService } from '../../services/authService';
import { itemService } from '../../services/itemService';
import { claimService } from '../../services/claimService';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { ItemCard } from '../feed/ItemCard';
import { StatusBadge, LostBadge, FoundBadge } from '../common/Badges';
import { EditProfileModal } from './EditProfileModal';
import { GlitterStar } from '../common/GlitterOverlay';
import { useToast } from '../common/Toast';
import {
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Bookmark,
  FileText,
  Inbox,
  Sparkles,
  MapPin,
  Calendar,
  Check,
  Edit3,
  LogIn,
  LogOut,
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserProfile;
  onProfileUpdated?: (updatedUser: UserProfile) => void;
  onOpenLogin?: () => void;
  onSignOut?: () => void;
  onOpenDetails: (post: ItemPost) => void;
  onOpenClaim: (post: ItemPost) => void;
  onOpenShare: (post: ItemPost) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onProfileUpdated,
  onOpenLogin,
  onSignOut,
  onOpenDetails,
  onOpenClaim,
  onOpenShare,
  onToggleLike,
  onToggleSave,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'claims' | 'badges'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const user = currentUser || authService.getCurrentUser();
  const allPosts = itemService.getAllPosts();

  // Filter posts belonging to this user
  const myPosts = allPosts.filter(
    (p) =>
      p.uploader.id === user.id ||
      p.uploader.username === user.username ||
      (user.id === 'usr_sushank' && p.uploader.id === 'usr_1')
  );
  const savedPosts = allPosts.filter((p) => p.userInteractions.saved);
  const userClaims = claimService.getUserClaims(user.id);

  // Dynamic Trusted Helper Logic based on reputation score & successful returns/reports
  const isTrustedHelper =
    (user.reputationScore || 0) >= 90 &&
    ((user.stats.successfulReturns || 0) >= 2 ||
      (user.stats.lostReports || 0) + (user.stats.foundReports || 0) >= 3);

  const handleUpdateStatus = (postId: string, newStatus: PostStatus) => {
    itemService.updatePostStatus(postId, newStatus);
    showToast(`Post marked as ${newStatus}`);
  };

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-4 text-left">
      {/* Profile Header Hero Card */}
      <GlassCard level="highlight" className="p-5 sm:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-3.5 sm:gap-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover border-2 border-cyan-400/50 shadow-xl"
              />
              {isTrustedHelper && (
                <span
                  title="Verified Community Helper (Reputation >= 90 & Active Returns)"
                  className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold border-2 border-slate-900 shadow"
                >
                  ✓
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-3xl font-extrabold text-white font-display">
                  {user.name}
                </h2>
                {isTrustedHelper ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-bold flex items-center gap-1">
                    <span>⭐ Trusted Community Helper</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/10 text-[10px] font-medium">
                    Community Member
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">@{user.username}</p>
              <p className="text-xs text-slate-300 mt-1.5 max-w-md">{user.bio}</p>

              <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-400 mt-2.5 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  {user.location}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  Member since {user.joinedDate}
                </span>
              </div>

              {/* Action Buttons: Edit Profile & Sign Out */}
              <div className="flex items-center gap-2.5 mt-3.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs tracking-wide shadow-[0_4px_16px_rgba(6,182,212,0.45)] border border-white/70 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 relative overflow-hidden group"
                >
                  <span className="absolute inset-x-0 top-0 h-1/2 bg-white/40 pointer-events-none rounded-t-xl" />
                  <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Edit Profile</span>
                  <GlitterStar size={10} className="text-slate-950" variant="fast" />
                </button>

                {/* Sign Out Button - Placed Prominently Only on Profile Page */}
                <button
                  type="button"
                  onClick={() => {
                    authService.logout();
                    showToast('Signed out of FoundIt');
                    if (onSignOut) {
                      onSignOut();
                    } else if (onOpenLogin) {
                      onOpenLogin();
                    }
                  }}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 font-bold text-xs border border-rose-500/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Sign out of FoundIt session"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Reputation Score Pill */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-cyan-500/20 flex flex-row sm:flex-col items-center justify-between sm:justify-center min-w-[140px] text-center w-full sm:w-auto">
            <span className="text-xs text-slate-400 sm:order-2 sm:mt-1">Trust Score</span>
            <div className="flex items-center gap-1 text-cyan-300 font-extrabold text-xl sm:text-2xl sm:order-1">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{user.reputationScore}%</span>
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block sm:order-3 sm:mt-0.5">Top Helper in Nellore, AP</span>
          </div>
        </div>

        {/* 4 Quantitative Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-xl font-bold text-white block">{user.reportedCount}</span>
            <span className="text-xs text-slate-400">Items Reported</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-xl font-bold text-emerald-400 block">{user.returnsCount}</span>
            <span className="text-xs text-slate-400">Belongings Returned</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-xl font-bold text-cyan-400 block">{userClaims.length}</span>
            <span className="text-xs text-slate-400">Verification Claims</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <span className="text-xl font-bold text-amber-300 block">{user.badges.length}</span>
            <span className="text-xs text-slate-400">Earned Badges</span>
          </div>
        </div>
      </GlassCard>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-6 overflow-x-auto">
        {[
          { id: 'posts', label: `My Reports (${myPosts.length})`, icon: FileText },
          { id: 'saved', label: `Saved Items (${savedPosts.length})`, icon: Bookmark },
          { id: 'claims', label: `Claims & Verification (${userClaims.length})`, icon: Inbox },
          { id: 'badges', label: `Badges & Trust (${user.badges.length})`, icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: MY POSTS */}
      {activeTab === 'posts' && (
        <div>
          {myPosts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FileText className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-semibold">No reports published yet</p>
              <p className="text-xs mt-1">Use the "Report Item" button above to log a lost or found item.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myPosts.map((post) => (
                <div key={post.id} className="relative flex flex-col">
                  <ItemCard
                    post={post}
                    onOpenDetails={onOpenDetails}
                    onToggleLike={onToggleLike}
                    onToggleSave={onToggleSave}
                    onOpenShare={onOpenShare}
                    onOpenClaim={onOpenClaim}
                  />

                  {/* Owner Status Management Bar */}
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">Status:</span>
                    <div className="flex gap-1">
                      {post.status !== 'found' && (
                        <button
                          onClick={() => handleUpdateStatus(post.id, 'found')}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                        >
                          Mark Found
                        </button>
                      )}
                      {post.status !== 'resolved' && (
                        <button
                          onClick={() => handleUpdateStatus(post.id, 'resolved')}
                          className="px-2 py-1 rounded text-[10px] font-bold bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: SAVED ITEMS */}
      {activeTab === 'saved' && (
        <div>
          {savedPosts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bookmark className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-semibold">No saved items</p>
              <p className="text-xs mt-1">Bookmark posts from the feed to monitor status changes.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPosts.map((post) => (
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
      )}

      {/* TAB CONTENT 3: CLAIMS & VERIFICATION */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {userClaims.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Inbox className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-semibold">No active claims submitted</p>
              <p className="text-xs mt-1">When you verify ownership on a found item, status tracks here.</p>
            </div>
          ) : (
            userClaims.map((claim) => (
              <GlassCard key={claim.id} level="primary" className="p-5 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-xs text-slate-400">Claim ID: {claim.id}</span>
                    <h4 className="text-base font-bold text-white mt-0.5">{claim.itemTitle}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        claim.status === 'accepted'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : claim.status === 'under_review'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : claim.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {claim.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Submitted verification answers summary */}
                <div className="space-y-2">
                  {claim.answers.map((ans, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                      <span className="font-semibold text-slate-400 block">{ans.question}</span>
                      <span className="text-slate-200 mt-1 block">{ans.answer}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                  <span>Submitted: {new Date(claim.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Private & Encrypted Flow</span>
                  </span>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT 4: BADGES & IMPACT */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {user.badges.map((b) => (
            <GlassCard key={b.id} level="primary" className="p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl shrink-0 shadow-lg">
                {b.icon}
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">{b.title}</h5>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{b.description}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-2">
                  <Check className="w-3 h-3" />
                  <span>Unlocked</span>
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentUser={user}
        onProfileUpdated={(updated) => {
          if (onProfileUpdated) {
            onProfileUpdated(updated);
          }
        }}
      />
    </div>
  );
};
