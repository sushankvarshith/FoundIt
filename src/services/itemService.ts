import { INITIAL_POSTS } from '../data/mockData';
import { ItemPost, FeedFilterOptions, PostStatus } from '../types';
import { apiClient } from './apiClient';

const STORAGE_KEY = 'foundit_posts_collection';

export const itemService = {
  /**
   * Fetch all posts from local cache, with automatic background synchronization with Java backend
   */
  getAllPosts(): ItemPost[] {
    const deletedUserIds = this._getDeletedUserIds();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const posts: ItemPost[] = JSON.parse(stored);

        // Filter out any posts whose uploaders have been deleted from the user registry
        const filteredPosts = deletedUserIds.size > 0
          ? posts.filter((p) => {
              if (!p || !p.uploader) return false;
              if (p.uploader.id && deletedUserIds.has(p.uploader.id)) return false;
              if (p.uploader.username && deletedUserIds.has(p.uploader.username)) return false;
              if (p.uploader.name && deletedUserIds.has(p.uploader.name)) return false;
              return true;
            })
          : posts;

        // If we filtered some out, persist the cleaned list
        if (filteredPosts.length < posts.length) {
          this.savePosts(filteredPosts);
        }

        // Ensure that posts in local storage don't miss security questions if INITIAL_POSTS has them
        return filteredPosts.map((p) => {
          if (!p.securityQuestions || p.securityQuestions.length < 3) {
            const initial = INITIAL_POSTS.find((i) => i.id === p.id);
            if (initial?.securityQuestions) {
              return { ...p, securityQuestions: initial.securityQuestions };
            }
          }
          return p;
        });
      }
    } catch {
      // ignore
    }

    // Initialize storage with initial posts (FILTERED by deleted users!)
    const cleanInitial = deletedUserIds.size > 0
      ? INITIAL_POSTS.filter((p) => {
          if (!p || !p.uploader) return false;
          if (p.uploader.id && deletedUserIds.has(p.uploader.id)) return false;
          if (p.uploader.username && deletedUserIds.has(p.uploader.username)) return false;
          if (p.uploader.name && deletedUserIds.has(p.uploader.name)) return false;
          return true;
        })
      : INITIAL_POSTS;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanInitial));
    } catch {
      // ignore
    }
    return cleanInitial;
  },

  /**
   * Helper: Get set of user IDs and usernames that have been deleted from the user registry
   * This ensures posts from deleted users are always purged from the feed permanently.
   */
  _getDeletedUserIds(): Set<string> {
    const deletedIdsKey = 'foundit_deleted_user_ids';
    try {
      const raw = localStorage.getItem(deletedIdsKey);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return new Set(arr);
      }
    } catch {
      // ignore
    }
    return new Set();
  },

  /**
   * Record a user ID as deleted, so their posts are permanently excluded from feeds.
   */
  _markUserAsDeleted(userId: string): void {
    const deletedIdsKey = 'foundit_deleted_user_ids';
    const current = this._getDeletedUserIds();
    current.add(userId);
    try {
      localStorage.setItem(deletedIdsKey, JSON.stringify([...current]));
    } catch {
      // ignore
    }
  },

  /**
   * Synchronize local cache with the Java backend (MySQL / Memory)
   */
  async syncWithBackend(): Promise<ItemPost[]> {
    try {
      const remotePosts = await apiClient.get<ItemPost[]>('/posts');
      if (remotePosts && Array.isArray(remotePosts) && remotePosts.length > 0) {
        const local = this.getAllPosts();
        const deletedUserIds = this._getDeletedUserIds();

        const merged = remotePosts
          .filter((rp) => !deletedUserIds.has(rp.uploader?.id))
          .map((rp) => {
            const matchingLocal = local.find((lp) => lp.id === rp.id);
            const matchingInitial = INITIAL_POSTS.find((ip) => ip.id === rp.id);
            return {
              ...rp,
              securityQuestions:
                rp.securityQuestions && rp.securityQuestions.length >= 3
                  ? rp.securityQuestions
                  : matchingLocal?.securityQuestions || matchingInitial?.securityQuestions || [],
            };
          });
        const remoteIds = new Set(remotePosts.map((r) => r.id));
        const localOnly = local.filter((l) => !remoteIds.has(l.id) && !deletedUserIds.has(l.uploader.id));
        const finalPosts = [...localOnly, ...merged];
        this.savePosts(finalPosts);
        return finalPosts;
      }
    } catch {
      // ignore
    }
    return this.getAllPosts();
  },

  savePosts(posts: ItemPost[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // ignore
    }
  },

  getPosts(filter?: Partial<FeedFilterOptions>): ItemPost[] {
    let posts = this.getAllPosts();

    if (!filter) return posts;

    // Filter by type (lost / found / all)
    if (filter.type && filter.type !== 'all') {
      posts = posts.filter((p) => p.type === filter.type);
    }

    // Filter by category
    if (filter.category && filter.category !== 'All') {
      posts = posts.filter((p) => p.category.toLowerCase() === filter.category?.toLowerCase());
    }

    // Filter by neighborhood
    if (filter.neighborhood && filter.neighborhood !== 'All') {
      posts = posts.filter(
        (p) => p.location.neighborhood.toLowerCase() === filter.neighborhood?.toLowerCase()
      );
    }

    // Filter by max distance
    if (filter.maxDistanceKm) {
      posts = posts.filter((p) => p.location.distanceKm <= (filter.maxDistanceKm || 50));
    }

    // Filter by status
    if (filter.status && filter.status !== 'all') {
      posts = posts.filter((p) => p.status === filter.status);
    }

    // Filter by bounty
    if (filter.hasRewardOnly) {
      posts = posts.filter((p) => p.reward && p.reward.hasReward && (p.reward.amount || 0) > 0);
    }

    // Search query
    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const q = filter.searchQuery.toLowerCase();
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.model?.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q) ||
          p.location.neighborhood.toLowerCase().includes(q) ||
          p.location.city.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (filter.sortBy) {
      case 'closest':
        posts.sort((a, b) => a.location.distanceKm - b.location.distanceKm);
        break;
      case 'liked':
        posts.sort((a, b) => b.stats.likes - a.stats.likes);
        break;
      case 'commented':
        posts.sort((a, b) => b.stats.commentsCount - a.stats.commentsCount);
        break;
      case 'recent':
      default:
        // Keep order or recent date
        break;
    }

    return posts;
  },

  getPostById(id: string): ItemPost | undefined {
    const posts = this.getAllPosts();
    return posts.find((p) => p.id === id);
  },

  createPost(newPostData: Omit<ItemPost, 'id' | 'dateReported' | 'stats' | 'userInteractions'>): ItemPost {
    const posts = this.getAllPosts();
    const newPost: ItemPost = {
      ...newPostData,
      id: `post_${Date.now()}`,
      dateReported: new Date().toISOString(),
      stats: {
        likes: 0,
        commentsCount: 0,
        shares: 0,
      },
      userInteractions: {
        liked: false,
        saved: false,
      },
    };
    const updated = [newPost, ...posts];
    this.savePosts(updated);

    // Sync to Java backend & MySQL in background
    apiClient.post('/posts', {
      id: newPost.id,
      type: newPost.type,
      title: newPost.title,
      category: newPost.category,
      brand: newPost.brand || '',
      model: newPost.model || '',
      color: newPost.color,
      description: newPost.description,
      identifyingFeatures: newPost.identifyingFeatures || '',
      locationName: newPost.location.name,
      city: newPost.location.city,
      neighborhood: newPost.location.neighborhood,
      distanceKm: newPost.location.distanceKm,
      lat: newPost.location.lat,
      lng: newPost.location.lng,
      approximate: newPost.location.approximate,
      dateOccurred: newPost.dateOccurred,
      dateReported: newPost.dateReported,
      status: newPost.status,
      hasReward: Boolean(newPost.reward?.hasReward),
      rewardAmount: newPost.reward?.amount || 0,
      rewardCurrency: newPost.reward?.currency || '₹',
      rewardNote: newPost.reward?.note || '',
      contactPreference: newPost.contactPreference,
      uploaderId: newPost.uploader.id,
      uploaderName: newPost.uploader.name,
      uploaderUsername: newPost.uploader.username,
      uploaderAvatar: newPost.uploader.avatar,
      image: newPost.images && newPost.images.length > 0 ? newPost.images[0] : '',
    }).catch(() => {
      // offline fallback already persisted in local storage
    });

    return newPost;
  },

  updatePostStatus(id: string, newStatus: PostStatus): ItemPost | null {
    const posts = this.getAllPosts();
    const index = posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    posts[index] = {
      ...posts[index],
      status: newStatus,
    };
    this.savePosts(posts);

    // Sync to Java backend
    apiClient.put(`/posts/${id}/status`, { status: newStatus }).catch(() => {});

    return posts[index];
  },

  toggleLike(id: string): { liked: boolean; likesCount: number } {
    const posts = this.getAllPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) return { liked: false, likesCount: 0 };

    const wasLiked = post.userInteractions.liked;
    post.userInteractions.liked = !wasLiked;
    post.stats.likes = wasLiked ? Math.max(0, post.stats.likes - 1) : post.stats.likes + 1;

    this.savePosts(posts);

    // Sync to Java backend
    apiClient.post(`/posts/${id}/like`, {}).catch(() => {});

    return { liked: post.userInteractions.liked, likesCount: post.stats.likes };
  },

  toggleSave(id: string): boolean {
    const posts = this.getAllPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) return false;

    post.userInteractions.saved = !post.userInteractions.saved;
    this.savePosts(posts);

    // Sync to Java backend
    apiClient.post(`/posts/${id}/save`, {}).catch(() => {});

    return post.userInteractions.saved;
  },

  deletePost(id: string): boolean {
    let posts = this.getAllPosts();
    const initialLen = posts.length;
    posts = posts.filter((p) => p.id !== id);
    this.savePosts(posts);

    // Sync to Java backend
    apiClient.delete(`/posts/${id}`).catch(() => {});

    return posts.length < initialLen;
  },

  getUserPosts(userId: string): ItemPost[] {
    const posts = this.getAllPosts();
    return posts.filter((p) => p.uploader?.id === userId || p.uploader?.username === userId);
  },

  /**
   * DELETE ALL POSTS by a specific user.
   * This is called when admin deletes a user — ensures complete cascade.
   * Also marks the user ID as permanently deleted so future getAllPosts() calls
   * will filter out any stale cached data.
   */
  deletePostsByUserId(userId: string): number {
    // Mark user as deleted FIRST (prevents re-appearance on next load)
    this._markUserAsDeleted(userId);

    const posts = this.getAllPosts();
    const remaining = posts.filter((p) => {
      if (!p || !p.uploader) return true;
      if (p.uploader.id === userId) return false;
      if (p.uploader.username === userId) return false;
      if (p.uploader.name === userId) return false;
      return true;
    });
    const countDeleted = posts.length - remaining.length;

    // Force save the cleaned list
    this.savePosts(remaining);

    // Also delete from backend
    apiClient.delete(`/users/${userId}/posts`).catch(() => {});

    return countDeleted;
  },
};
