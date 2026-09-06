import React, { useState } from 'react';
import { ItemPost, UserProfile, Claim } from '../../types';
import { authService } from '../../services/authService';
import { itemService } from '../../services/itemService';
import { claimService } from '../../services/claimService';
import { chatService } from '../../services/chatService';
import { GlassCard } from '../common/GlassCard';
import { useToast } from '../common/Toast';
import { GlitterStar } from '../common/GlitterOverlay';
import {
  ShieldAlert,
  Users,
  Package,
  HelpCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  AlertTriangle,
  FileText,
  BadgeCheck,
} from 'lucide-react';

interface AdminDashboardViewProps {
  onBackToFeed: () => void;
  onOpenDetails: (post: ItemPost) => void;
  posts: ItemPost[];
  onRefreshData: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onBackToFeed,
  onOpenDetails,
  posts,
  onRefreshData,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'users' | 'lost' | 'found' | 'claims'>('lost');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserProfile[]>(() => authService.getAllUsers());
  const [claims, setClaims] = useState<Claim[]>(() => claimService.getClaims());

  // Filtered lists
  const lostPosts = posts.filter((p) => p.type === 'lost');
  const foundPosts = posts.filter((p) => p.type === 'found');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLost = lostPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFound = foundPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClaims = claims.filter(
    (c) =>
      c.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.claimant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Moderation Actions
  const handleDeletePost = (postId: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      itemService.deletePost(postId);
      onRefreshData();
      showToast(`Item "${title}" deleted successfully by Admin.`);
    }
  };

  const handleUpdateItemStatus = (postId: string, newStatus: any) => {
    itemService.updatePostStatus(postId, newStatus);
    onRefreshData();
    showToast(`Status updated to ${newStatus}.`);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (userId === 'usr_admin') {
      showToast('Cannot delete the root System Administrator.', 'error');
      return;
    }
    if (window.confirm(`Are you sure you want to delete user "${userName}" and ALL posts & chats created by this account? This action is permanent.`)) {
      // 1. Delete all posts by this user (also marks userId in permanent blocklist)
      const deletedPostsCount = itemService.deletePostsByUserId(userId);

      // 2. Delete all chat conversations involving this user
      try {
        const allConvs = chatService.getRawConversations();
        const cleaned = allConvs.filter((c) => {
          if (c.otherUser?.id === userId) return false;
          if (c.claimantUser?.id === userId) return false;
          if (c.uploaderUser?.id === userId) return false;
          if (c.participantIds && c.participantIds.includes(userId)) return false;
          return true;
        });
        chatService.saveConversations(cleaned);
      } catch {
        // ignore chat cleanup errors
      }

      // 3. Delete user claims
      try {
        claimService.deleteClaimsByUserId(userId);
        setClaims(claimService.getClaims());
      } catch {
        // ignore
      }

      // 4. Delete user account from registry
      authService.deleteUser(userId);

      // 5. Force complete UI refresh
      setUsers(authService.getAllUsers());
      if (onRefreshData) {
        onRefreshData();
      }
      showToast(`User "${userName}" and ${deletedPostsCount} associated post(s) permanently deleted from all feeds & chats.`);
    }
  };

  const handleUpdateClaim = (claimId: string, status: 'accepted' | 'rejected') => {
    claimService.updateClaimStatus(claimId, status);
    setClaims(claimService.getClaims());
    showToast(`Claim marked as ${status}.`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in text-left">
      {/* Top Banner & Return */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              Administrator Control Center
            </span>
            <GlitterStar size={12} className="text-amber-300" variant="fast" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            System Administration & Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Full platform authority for Nellore Community &bull; Manage Users, Lost/Found Posts, and Claim Logs
          </p>
        </div>

        <button
          onClick={onBackToFeed}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer shadow-md w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-300" />
          <span>Exit to Main Feed</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* 1. Total Users */}
        <GlassCard level="highlight" className="p-4 border-l-4 border-l-blue-400">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Registered Users</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">{users.length}</div>
          <div className="text-[11px] text-blue-300/80 mt-1">Full database accounts</div>
        </GlassCard>

        {/* 2. Lost Items */}
        <GlassCard level="highlight" className="p-4 border-l-4 border-l-rose-400">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Lost Reports</span>
            <Package className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">{lostPosts.length}</div>
          <div className="text-[11px] text-rose-300/80 mt-1">Community reports</div>
        </GlassCard>

        {/* 3. Found Items */}
        <GlassCard level="highlight" className="p-4 border-l-4 border-l-emerald-400">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Found Reports</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">{foundPosts.length}</div>
          <div className="text-[11px] text-emerald-300/80 mt-1">Found items logged</div>
        </GlassCard>

        {/* 4. Claims Submitted */}
        <GlassCard level="highlight" className="p-4 border-l-4 border-l-amber-400">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Verification Claims</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">{claims.length}</div>
          <div className="text-[11px] text-amber-300/80 mt-1">Total claim logs</div>
        </GlassCard>
      </div>

      {/* Navigation Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#091530]/90 border border-cyan-500/30 overflow-x-auto">
          <button
            onClick={() => setActiveTab('lost')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'lost'
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Lost Items ({lostPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('found')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'found'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Found Items ({foundPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'claims'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Claim Logs ({claims.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/30 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-300"
          />
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* 1. LOST ITEMS TABLE */}
      {activeTab === 'lost' && (
        <div className="rounded-3xl border border-white/10 bg-[#081329]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase font-black tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Item Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Reporter</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reward</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLost.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-white block truncate">{post.title}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{post.dateOccurred}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300 text-[11px]">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      📍 {post.location.neighborhood}, {post.location.city}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img src={post.uploader.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate">{post.uploader.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={post.status}
                        onChange={(e) => handleUpdateItemStatus(post.id, e.target.value)}
                        className="bg-slate-900 border border-white/20 rounded-lg px-2 py-1 text-[11px] text-cyan-300 outline-none cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="submitted">Submitted</option>
                        <option value="found">Found</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      {post.reward?.hasReward ? (
                        <span className="text-emerald-400 font-bold">₹{post.reward.amount}</span>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenDetails(post)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. FOUND ITEMS TABLE */}
      {activeTab === 'found' && (
        <div className="rounded-3xl border border-white/10 bg-[#081329]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase font-black tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">Found Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Discovery Location</th>
                  <th className="py-3 px-4">Finder</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredFound.map((post) => (
                  <tr key={post.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-white block truncate">{post.title}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{post.dateOccurred}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-emerald-300 text-[11px]">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      📍 {post.location.neighborhood}, {post.location.city}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <img src={post.uploader.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span className="truncate">{post.uploader.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={post.status}
                        onChange={(e) => handleUpdateItemStatus(post.id, e.target.value)}
                        className="bg-slate-900 border border-white/20 rounded-lg px-2 py-1 text-[11px] text-cyan-300 outline-none cursor-pointer"
                      >
                        <option value="active">Active</option>
                        <option value="submitted">Submitted</option>
                        <option value="found">Returned</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenDetails(post)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer"
                          title="Delete Post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. USERS MANAGEMENT TABLE */}
      {activeTab === 'users' && (
        <div className="rounded-3xl border border-white/10 bg-[#081329]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 border-b border-white/10 text-[11px] uppercase font-black tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Reputation</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-white/10" />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.isCommunityHelper && (
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">@{u.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-cyan-300">{u.email}</td>
                    <td className="py-3 px-4 text-[11px]">{u.phone || '—'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}
                      >
                        {u.role || 'Member'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">{u.reputationScore} / 100</td>
                    <td className="py-3 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          Delete User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. CLAIMS & VERIFICATIONS LOG */}
      {activeTab === 'claims' && (
        <div className="space-y-4">
          {filteredClaims.length === 0 ? (
            <GlassCard className="p-8 text-center text-slate-400">
              <FileText className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p>No verification claims filed yet.</p>
            </GlassCard>
          ) : (
            filteredClaims.map((claim) => (
              <GlassCard key={claim.id} level="highlight" className="p-5 border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                        Claim Verification Log
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          claim.status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : claim.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-1">{claim.itemTitle}</h3>
                    <p className="text-xs text-slate-400">
                      Claimant: <span className="text-slate-200 font-semibold">{claim.claimant.name}</span> (@{claim.claimant.username})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {claim.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateClaim(claim.id, 'accepted')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold cursor-pointer"
                        >
                          Approve Claim
                        </button>
                        <button
                          onClick={() => handleUpdateClaim(claim.id, 'rejected')}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Submitted Security Answers */}
                <div className="mt-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Submitted Security Answers:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {claim.answers.map((ans, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
                        <span className="text-cyan-400 font-bold block text-[11px]">Q{idx + 1}: {ans.question}</span>
                        <span className="text-slate-200 font-medium block mt-1">Ans: {ans.answer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}
    </div>
  );
};
