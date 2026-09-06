import { UserSummary } from '../types';

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemType: 'lost' | 'found';
  itemLocation: string;
  claimantUser?: UserSummary & { isOnline?: boolean; lastSeen?: string };
  uploaderUser?: UserSummary & { isOnline?: boolean; lastSeen?: string };
  participantIds?: string[];
  claimantDetails?: {
    name: string;
    contact: string;
    location: string;
    note: string;
  };
  otherUser: UserSummary & { isOnline?: boolean; lastSeen?: string };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  category: 'primary' | 'secondary' | 'social';
  isVerifiedClaim?: boolean;
  securityAnswers?: { question: string; answer: string; isCorrect?: boolean }[];
  messages: ChatMessage[];
}

const STORAGE_KEY = 'foundit_chat_conversations';

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv_1',
    itemId: 'post_1',
    itemTitle: 'Apple iPhone 15 Pro (Natural Titanium)',
    itemImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80',
    itemType: 'lost',
    itemLocation: 'VRC Centre, Nellore',
    otherUser: {
      id: 'usr_rohit',
      name: 'Rohit Verma',
      username: 'rohit_v',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      isVerifiedHelper: true,
      isOnline: true,
    },
    lastMessage: 'I found a phone matching this near VRC Centre bakery! Can you confirm your lockscreen wallpaper?',
    lastMessageTime: '10 mins ago',
    unreadCount: 1,
    category: 'primary',
    isVerifiedClaim: true,
    securityAnswers: [
      { question: 'What specific case and sticker is on the phone?', answer: 'Matte black Spigen case with tiny green sticker', isCorrect: true },
      { question: 'What is visible on the lock screen wallpaper?', answer: 'Landscape photograph', isCorrect: true },
      { question: 'Where specifically was it misplaced?', answer: 'Near VRC Centre Clock Tower fruit juice stall', isCorrect: true },
    ],
    messages: [
      {
        id: 'm1',
        senderId: 'usr_rohit',
        text: 'Hi Arjun! I saw your post regarding the Natural Titanium iPhone 15 Pro in Nellore.',
        timestamp: '11:15 AM',
        isMe: false,
        read: true,
      },
      {
        id: 'm2',
        senderId: 'usr_me',
        text: 'Hello Rohit! Yes, I lost it near VRC Centre Clock Tower yesterday evening. Did you spot it?',
        timestamp: '11:18 AM',
        isMe: true,
        read: true,
      },
      {
        id: 'm3',
        senderId: 'usr_rohit',
        text: 'I found a phone matching this near VRC Centre bakery! Can you confirm your lockscreen wallpaper?',
        timestamp: '11:22 AM',
        isMe: false,
        read: false,
      },
    ],
  },
  {
    id: 'conv_2',
    itemId: 'post_2',
    itemTitle: 'Titan Brown Leather Bifold Wallet',
    itemImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&auto=format&fit=crop&q=80',
    itemType: 'found',
    itemLocation: 'Trunk Road, Nellore',
    otherUser: {
      id: 'usr_priya',
      name: 'Priya Sharma',
      username: 'priya_tech',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      isVerifiedHelper: true,
      isOnline: false,
      lastSeen: '1 hour ago',
    },
    lastMessage: 'Yes, my APSRTC card has number ending 4491! Can we meet near Trunk Road AC Centre?',
    lastMessageTime: '2 hours ago',
    unreadCount: 0,
    category: 'primary',
    isVerifiedClaim: true,
    securityAnswers: [
      { question: 'What initials are on the ID card inside?', answer: 'K.V.', isCorrect: true },
      { question: 'What transit or bus pass is in the card slot?', answer: 'Andhra Pradesh RTC bus pass', isCorrect: true },
      { question: 'What unique emblem is stamped on the leather?', answer: 'Owl stamp emblem', isCorrect: true },
    ],
    messages: [
      {
        id: 'm4',
        senderId: 'usr_priya',
        text: 'Hello! I submitted a verification claim on the Titan wallet you found near Trunk Road.',
        timestamp: '9:30 AM',
        isMe: false,
        read: true,
      },
      {
        id: 'm5',
        senderId: 'usr_me',
        text: 'Hi Priya! Could you tell me what cards or IDs are inside?',
        timestamp: '9:45 AM',
        isMe: true,
        read: true,
      },
      {
        id: 'm6',
        senderId: 'usr_priya',
        text: 'Yes, my APSRTC card has number ending 4491! Can we meet near Trunk Road AC Centre?',
        timestamp: '10:02 AM',
        isMe: false,
        read: true,
      },
    ],
  },
  {
    id: 'conv_3',
    itemId: 'post_4',
    itemTitle: 'Hyundai Smart Key Fob with Braided Ring',
    itemImage: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&auto=format&fit=crop&q=80',
    itemType: 'found',
    itemLocation: 'Magunta Layout, Nellore',
    otherUser: {
      id: 'usr_vikram',
      name: 'Vikram Reddy',
      username: 'vikram_r',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      isVerifiedHelper: false,
      isOnline: true,
    },
    lastMessage: 'Awesome, I am at MGB Felicity Mall right now. Will meet at customer desk.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    category: 'secondary',
    isVerifiedClaim: false,
    messages: [
      {
        id: 'm7',
        senderId: 'usr_me',
        text: 'Hello Vikram, I safely deposited the car keys with MGB Felicity Mall customer desk.',
        timestamp: 'Yesterday 4:10 PM',
        isMe: true,
        read: true,
      },
      {
        id: 'm8',
        senderId: 'usr_vikram',
        text: 'Awesome, I am at MGB Felicity Mall right now. Will meet at customer desk.',
        timestamp: 'Yesterday 4:15 PM',
        isMe: false,
        read: true,
      },
    ],
  },
  {
    id: 'conv_social_1',
    itemId: 'social_varshith',
    itemTitle: 'Chat with Sushank Varshith',
    itemImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    itemType: 'found',
    itemLocation: 'Magunta Layout, Nellore',
    otherUser: {
      id: 'usr_sushank',
      name: 'Sushank Varshith',
      username: 'varshith',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      isVerifiedHelper: true,
      isOnline: true,
    },
    lastMessage: 'Hey! Welcome to Nellore community chats. Feel free to reach out anytime.',
    lastMessageTime: '15 mins ago',
    unreadCount: 0,
    category: 'social',
    messages: [
      {
        id: 'ms1',
        senderId: 'usr_sushank',
        text: 'Hey! Welcome to Nellore community chats. Feel free to reach out anytime if you need help finding anything around here.',
        timestamp: '10:00 AM',
        isMe: false,
        read: true,
      },
      {
        id: 'ms2',
        senderId: 'usr_me',
        text: 'Hi Varshith! Thanks for connecting. Happy to be part of FoundIt!',
        timestamp: '10:05 AM',
        isMe: true,
        read: true,
      },
    ],
  },
];

export const chatService = {
  saveConversations(list: ChatConversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
  },

  getRawConversations(): ChatConversation[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ChatConversation[] = JSON.parse(stored);
        if (!Array.isArray(parsed)) return INITIAL_CONVERSATIONS;

        // Validate each conversation has required fields
        const valid = parsed.filter(
          (c) => c && c.id && c.otherUser && c.messages && Array.isArray(c.messages)
        );

        if (valid.length === 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
          return INITIAL_CONVERSATIONS;
        }

        const hasLegacy = valid.some(
          (c) =>
            !c.category ||
            c.itemLocation?.includes('Hyderabad') ||
            c.lastMessage?.includes('Hyderabad') ||
            c.lastMessage?.includes('Raidurg')
        );
        if (hasLegacy) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CONVERSATIONS));
          return INITIAL_CONVERSATIONS;
        }
        return valid;
      }
    } catch {
      // ignore
    }
    return INITIAL_CONVERSATIONS;
  },

  /**
   * Get conversations for a specific user.
   * Handles bidirectional perspective — the same conversation looks different
   * depending on whether you're the uploader or the claimant.
   */
  getConversations(currentUserId?: string): ChatConversation[] {
    const all = this.getRawConversations();
    if (!currentUserId) {
      return all;
    }

    return all
      .filter((c) => {
        // If participantIds is defined, current user must be one of them (or admin)
        if (c.participantIds && c.participantIds.length > 0) {
          if (currentUserId === 'usr_admin') return true;
          return c.participantIds.includes(currentUserId);
        }
        // Default conversations (pre-claim) are visible to all authenticated users
        return true;
      })
      .map((c) => {
        // Determine who the "other" user is from the current user's perspective
        let other = c.otherUser;
        if (c.uploaderUser && c.claimantUser) {
          if (currentUserId === c.uploaderUser.id) {
            // Current user is the uploader → show claimant as other user
            other = { ...c.claimantUser, isOnline: c.claimantUser.isOnline ?? true };
          } else if (currentUserId === c.claimantUser.id) {
            // Current user is the claimant → show uploader as other user
            other = { ...c.uploaderUser, isOnline: c.uploaderUser.isOnline ?? true };
          }
        }

        // Map message `isMe` flags based on current user ID
        const mappedMessages = (c.messages || []).map((m) => ({
          ...m,
          isMe: m.senderId === currentUserId ||
                (m.senderId === 'usr_me' && (!c.participantIds || c.participantIds.length === 0)),
        }));

        return {
          ...c,
          otherUser: other,
          messages: mappedMessages,
        };
      });
  },

  getConversationById(id: string, currentUserId?: string): ChatConversation | undefined {
    return this.getConversations(currentUserId).find((c) => c.id === id);
  },

  /**
   * Create a new conversation or update an existing one.
   * Called during the claim process to establish bidirectional chat.
   */
  createOrGetConversation(params: {
    itemId: string;
    itemTitle: string;
    itemImage: string;
    itemType: 'lost' | 'found';
    itemLocation: string;
    otherUser?: UserSummary;
    claimantUser?: UserSummary;
    uploaderUser?: UserSummary;
    claimantDetails?: {
      name: string;
      contact: string;
      location: string;
      note: string;
    };
    category: 'primary' | 'secondary' | 'social';
    isVerifiedClaim?: boolean;
    securityAnswers?: { question: string; answer: string; isCorrect?: boolean }[];
    initialMessage?: string;
  }): ChatConversation {
    const list = this.getRawConversations();
    const claimantId = params.claimantUser?.id;
    const uploaderId = params.uploaderUser?.id || params.otherUser?.id;

    // Check for existing conversation between same claimant + uploader for same item
    const existingIdx = list.findIndex((c) => {
      if (c.itemId !== params.itemId) return false;
      if (claimantId && uploaderId && c.participantIds && c.participantIds.length >= 2) {
        return c.participantIds.includes(claimantId) && c.participantIds.includes(uploaderId);
      }
      if (c.otherUser.id === (params.otherUser?.id || uploaderId)) return true;
      return false;
    });

    if (existingIdx !== -1) {
      const conv = { ...list[existingIdx] };
      conv.category = params.category;
      if (params.isVerifiedClaim !== undefined) {
        conv.isVerifiedClaim = params.isVerifiedClaim;
      }
      if (params.securityAnswers) {
        conv.securityAnswers = params.securityAnswers;
      }
      if (params.claimantDetails) {
        conv.claimantDetails = params.claimantDetails;
      }
      // Update participant references
      if (params.claimantUser) conv.claimantUser = params.claimantUser;
      if (params.uploaderUser) conv.uploaderUser = params.uploaderUser;
      if (claimantId && uploaderId) {
        conv.participantIds = [claimantId, uploaderId];
      }

      if (params.initialMessage) {
        const newMsg: ChatMessage = {
          id: `msg_${Date.now()}`,
          senderId: claimantId || 'usr_me',
          text: params.initialMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true,
          read: false,
        };
        conv.messages = [...(conv.messages || []), newMsg];
        conv.lastMessage = params.initialMessage;
        conv.lastMessageTime = 'Just now';
      }
      list[existingIdx] = conv;
      this.saveConversations(list);
      return conv;
    }

    // Otherwise create brand new conversation
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newConv: ChatConversation = {
      id: `conv_${Date.now()}`,
      itemId: params.itemId,
      itemTitle: params.itemTitle,
      itemImage: params.itemImage,
      itemType: params.itemType,
      itemLocation: params.itemLocation,
      otherUser: (params.otherUser || params.uploaderUser || {
        id: 'usr_unknown',
        name: 'Community Member',
        username: 'user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        isOnline: true,
      }) as UserSummary,
      claimantUser: params.claimantUser,
      uploaderUser: params.uploaderUser,
      participantIds: claimantId && uploaderId ? [claimantId, uploaderId] : undefined,
      claimantDetails: params.claimantDetails,
      lastMessage: params.initialMessage || 'Started inquiry regarding this item.',
      lastMessageTime: 'Just now',
      unreadCount: 0,
      category: params.category,
      isVerifiedClaim: params.isVerifiedClaim,
      securityAnswers: params.securityAnswers,
      messages: params.initialMessage
        ? [
            {
              id: `msg_${Date.now()}`,
              senderId: claimantId || 'usr_me',
              text: params.initialMessage,
              timestamp: now,
              isMe: true,
              read: false,
            },
          ]
        : [],
    };

    const updated = [newConv, ...list];
    this.saveConversations(updated);
    return newConv;
  },

  /**
   * Create or retrieve a Social Direct Chat with any community member by username.
   */
  getOrCreateSocialConversation(currentUserId: string, targetUser: UserSummary): ChatConversation {
    const list = this.getRawConversations();

    // Check if social chat already exists between these users
    const existingIdx = list.findIndex((c) => {
      if (c.category !== 'social') return false;
      if (c.participantIds && c.participantIds.length >= 2) {
        return c.participantIds.includes(currentUserId) && c.participantIds.includes(targetUser.id);
      }
      return c.otherUser?.id === targetUser.id || c.otherUser?.username === targetUser.username;
    });

    if (existingIdx !== -1) {
      return list[existingIdx];
    }

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newConv: ChatConversation = {
      id: `conv_social_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      itemId: 'social',
      itemTitle: `Chat with ${targetUser.name}`,
      itemImage: targetUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      itemType: 'found',
      itemLocation: 'Community Social Chat',
      participantIds: [currentUserId, targetUser.id],
      otherUser: {
        ...targetUser,
        isOnline: true,
      },
      lastMessage: `Connected with @${targetUser.username}`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      category: 'social',
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: targetUser.id,
          text: `Hey! I'm ${targetUser.name} (@${targetUser.username}). Glad to connect with you in Nellore! Feel free to send a message.`,
          timestamp: now,
          isMe: false,
          read: true,
        },
      ],
    };

    const updated = [newConv, ...list];
    this.saveConversations(updated);
    return newConv;
  },

  /**
   * Send a message in a conversation.
   * The senderId determines which side the message appears on.
   */
  sendMessage(conversationId: string, text: string, senderId?: string): ChatConversation | null {
    const list = this.getRawConversations();
    const idx = list.findIndex((c) => c.id === conversationId);
    if (idx === -1) return null;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: senderId || 'usr_me',
      text,
      timestamp: now,
      isMe: true, // Will be remapped by getConversations() based on viewer
      read: true,
    };

    const updatedConv: ChatConversation = {
      ...list[idx],
      lastMessage: text,
      lastMessageTime: 'Just now',
      messages: [...(list[idx].messages || []), newMsg],
    };

    list[idx] = updatedConv;
    this.saveConversations(list);

    return updatedConv;
  },

  /**
   * Simulate a reply from the other user in the conversation.
   */
  simulateReply(conversationId: string, replyText: string): Promise<ChatConversation | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const list = this.getRawConversations();
          const idx = list.findIndex((c) => c.id === conversationId);
          if (idx === -1) {
            resolve(null);
            return;
          }

          const replySenderId = list[idx].otherUser?.id || 'usr_other';
          const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          const replyMsg: ChatMessage = {
            id: `msg_${Date.now()}`,
            senderId: replySenderId,
            text: replyText,
            timestamp: now,
            isMe: false,
            read: true,
          };

          const updatedConv: ChatConversation = {
            ...list[idx],
            lastMessage: replyText,
            lastMessageTime: 'Just now',
            messages: [...(list[idx].messages || []), replyMsg],
          };

          list[idx] = updatedConv;
          this.saveConversations(list);

          resolve(updatedConv);
        } catch {
          resolve(null);
        }
      }, 1200);
    });
  },

  markAsRead(conversationId: string): void {
    try {
      const list = this.getRawConversations();
      const idx = list.findIndex((c) => c.id === conversationId);
      if (idx === -1) return;

      list[idx] = {
        ...list[idx],
        unreadCount: 0,
        messages: (list[idx].messages || []).map((m) => ({ ...m, read: true })),
      };
      this.saveConversations(list);
    } catch {
      // ignore
    }
  },

  getTotalUnreadCount(currentUserId?: string): number {
    try {
      return this.getConversations(currentUserId).reduce((acc, c) => acc + (c.unreadCount || 0), 0);
    } catch {
      return 0;
    }
  },
};
