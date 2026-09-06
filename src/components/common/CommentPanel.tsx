import React, { useState } from 'react';
import { Comment, UserSummary } from '../../types';
import { commentService } from '../../services/commentService';
import { authService } from '../../services/authService';
import { GlassButton } from './GlassButton';
import { Heart, Send, CornerDownRight, MessageCircle } from 'lucide-react';
import { useToast } from './Toast';

interface CommentPanelProps {
  itemId: string;
  className?: string;
}

export const CommentPanel: React.FC<CommentPanelProps> = ({ itemId, className = '' }) => {
  const { showToast } = useToast();
  const [comments, setComments] = useState<Comment[]>(() => commentService.getComments(itemId));
  const [newCommentText, setNewCommentText] = useState('');
  const [replyToId, setReplyToId] = useState<string | null>(null);

  const currentUser = authService.getCurrentUser();

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const userSummary: UserSummary = {
      id: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      isVerifiedHelper: currentUser.isCommunityHelper,
    };

    const added = commentService.addComment(itemId, userSummary, newCommentText.trim());
    setComments([added, ...comments]);
    setNewCommentText('');
    setReplyToId(null);
    showToast('Comment posted');
  };

  const handleLikeComment = (commentId: string) => {
    const updated = commentService.toggleLike(itemId, commentId);
    setComments(updated);
  };

  return (
    <div className={`flex flex-col gap-4 text-left ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>Community Discussion ({comments.length})</span>
        </h4>
        <span className="text-xs text-slate-400">Keep communication polite & safe</span>
      </div>

      {/* Input Box */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0 mt-1"
        />
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a helpful tip, sighting location, or question..."
            className="flex-1 py-2 px-3.5 rounded-xl text-xs text-white bg-slate-900/80 border border-white/15 outline-none focus:border-emerald-400 transition-colors"
          />
          <GlassButton
            type="submit"
            size="sm"
            variant="primary"
            disabled={!newCommentText.trim()}
          >
            <Send className="w-3.5 h-3.5" />
          </GlassButton>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex flex-col gap-3.5 max-h-80 overflow-y-auto pr-1">
        {comments.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No comments yet. Be the first neighbor to offer a tip or lead!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex flex-col gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white">
                        {comment.user.name}
                      </span>
                      {comment.user.isVerifiedHelper && (
                        <span className="text-[10px] text-emerald-400 font-bold">✓</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center gap-1 text-[11px] p-1 rounded-lg transition-colors cursor-pointer ${
                    comment.isLiked
                      ? 'text-rose-400 bg-rose-500/10'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} />
                  <span>{comment.likes}</span>
                </button>
              </div>

              <p className="text-xs text-slate-200 pl-9 leading-relaxed">{comment.text}</p>

              {/* Threaded Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-9 mt-1 flex flex-col gap-2 border-l border-white/10 ml-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex items-start gap-2 pl-3">
                      <CornerDownRight className="w-3 h-3 text-slate-500 shrink-0 mt-1" />
                      <div className="flex-1 text-xs">
                        <span className="font-semibold text-white mr-1.5">{reply.user.name}:</span>
                        <span className="text-slate-300">{reply.text}</span>
                        <span className="text-[10px] text-slate-500 ml-2">{reply.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
