import React, { useState } from 'react';
import { ItemPost, PostStatus } from '../../types';
import { authService } from '../../services/authService';
import { itemService } from '../../services/itemService';
import { ItemCard } from '../feed/ItemCard';
import { GlassButton } from '../common/GlassButton';
import {
  UploadCloud,
  PlusCircle,
  Trash2,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface MyUploadsViewProps {
  posts?: ItemPost[];
  onRefreshData?: () => void;
  onOpenDetails: (post: ItemPost) => void;
  onOpenClaim: (post: ItemPost) => void;
  onOpenShare: (post: ItemPost) => void;
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onNavigateUpload: () => void;
}

export const MyUploadsView: React.FC<MyUploadsViewProps> = ({
  posts,
  onRefreshData,
  onOpenDetails,
  onOpenClaim,
  onOpenShare,
  onToggleLike,
  onToggleSave,
  onNavigateUpload,
}) => {
  const { showToast } = useToast();
  const currentUser = authService.getCurrentUser();
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found' | 'resolved'>('all');
  const [refreshTick, setRefreshTick] = useState(0);

  const allPosts = posts || itemService.getAllPosts();
  const myPosts = allPosts.filter(
    (p) =>
      p.uploader?.id === currentUser.id ||
      p.uploader?.username === currentUser.username ||
      (currentUser.id === 'usr_sushank' && (p.uploader?.id === 'usr_sushank' || p.uploader?.id === 'usr_1'))
  );

  const totalLost = myPosts.filter((p) => p.type === 'lost').length;
  const totalFound = myPosts.filter((p) => p.type === 'found' || p.status === 'found').length;
  const totalResolved = myPosts.filter((p) => p.status === 'resolved').length;

  const filteredPosts = myPosts.filter((p) => {
    if (filterType === 'lost') return p.type === 'lost';
    if (filterType === 'found') return p.type === 'found' || p.status === 'found';
    if (filterType === 'resolved') return p.status === 'resolved';
    return true;
  });

  const handleUpdateStatus = (postId: string, newStatus: PostStatus) => {
    itemService.updatePostStatus(postId, newStatus);
    setRefreshTick((prev) => prev + 1);
    if (onRefreshData) onRefreshData();
    showToast(`Report status updated to ${newStatus}`);
  };

  const handleDeletePost = (postId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete your report "${title}"?`)) {
      itemService.deletePost(postId);
      setRefreshTick((prev) => prev + 1);
      if (onRefreshData) onRefreshData();
      showToast(`Report "${title}" deleted successfully.`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Report Manager</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
            My Uploads ({myPosts.length})
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track, update status, and manage all lost and found reports you published in Nellore
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="md"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={onNavigateUpload}
          className="self-start sm:self-auto shadow-lg shadow-emerald-500/20"
        >
          New Report
        </GlassButton>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
          <span className="text-2xl font-extrabold text-white block">{myPosts.length}</span>
          <span className="text-xs text-slate-400 mt-0.5 block">Total Reports</span>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-2xl font-extrabold text-rose-300 block">{totalLost}</span>
          <span className="text-xs text-slate-400 mt-0.5 block">Lost Items</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-2xl font-extrabold text-emerald-300 block">{totalFound}</span>
          <span className="text-xs text-slate-400 mt-0.5 block">Found / Recovered</span>
        </div>
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-2xl font-extrabold text-cyan-300 block">{totalResolved}</span>
          <span className="text-xs text-slate-400 mt-0.5 block">Cases Closed</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6 overflow-x-auto">
        {[
          { id: 'all', label: `All Uploads (${myPosts.length})` },
          { id: 'lost', label: `Lost (${totalLost})` },
          { id: 'found', label: `Found / Recovered (${totalFound})` },
          { id: 'resolved', label: `Resolved (${totalResolved})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Uploads List */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
            <UploadCloud className="w-8 h-8 text-slate-500" />
          </div>
          <h4 className="text-base font-bold text-white">No reports matching this filter</h4>
          <p className="text-xs text-slate-400 max-w-sm">
            Publish a new report to help locate a lost personal possession or return an item you discovered.
          </p>
          <GlassButton
            variant="primary"
            size="sm"
            onClick={onNavigateUpload}
            className="mt-2"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Create Report Now
          </GlassButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="flex flex-col gap-2">
              <ItemCard
                post={post}
                onOpenDetails={onOpenDetails}
                onToggleLike={onToggleLike}
                onToggleSave={onToggleSave}
                onOpenShare={onOpenShare}
                onOpenClaim={onOpenClaim}
              />

              {/* Status Action Controls */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 font-semibold">Status:</span>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  {post.status !== 'found' && (
                    <button
                      onClick={() => handleUpdateStatus(post.id, 'found')}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors cursor-pointer flex items-center gap-1"
                      title="Mark item as Found / Recovered"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark Found</span>
                    </button>
                  )}
                  {post.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(post.id, 'resolved')}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
                      title="Mark report as resolved"
                    >
                      Close Case
                    </button>
                  )}
                  {post.status === 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(post.id, 'active')}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors cursor-pointer flex items-center gap-1"
                      title="Reopen this report"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reopen</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeletePost(post.id, post.title)}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition-colors cursor-pointer ml-1"
                    title="Delete this upload permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
