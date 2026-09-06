import { MOCK_COMMENTS } from '../data/mockData';
import { Comment, UserSummary } from '../types';
import { apiClient } from './apiClient';

const STORAGE_KEY = 'foundit_comments';

export const commentService = {
  getComments(itemId: string): Comment[] {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${itemId}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return MOCK_COMMENTS.filter((c) => c.itemId === itemId);
  },

  addComment(itemId: string, user: UserSummary, text: string): Comment {
    const comments = this.getComments(itemId);
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      itemId,
      user,
      text,
      createdAt: 'Just now',
      likes: 0,
      isLiked: false,
    };
    const updated = [newComment, ...comments];
    try {
      localStorage.setItem(`${STORAGE_KEY}_${itemId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Sync with Java backend
    apiClient.post('/comments', {
      itemId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text,
    }).catch(() => {});

    return newComment;
  },

  toggleLike(itemId: string, commentId: string): Comment[] {
    const comments = this.getComments(itemId);
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        const isLiked = !c.isLiked;
        return {
          ...c,
          isLiked,
          likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
        };
      }
      return c;
    });
    try {
      localStorage.setItem(`${STORAGE_KEY}_${itemId}`, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Sync with Java backend
    apiClient.post(`/comments/${commentId}/like`, {}).catch(() => {});

    return updated;
  },
};
