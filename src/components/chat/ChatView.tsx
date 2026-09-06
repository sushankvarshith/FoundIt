import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { chatService, ChatConversation, ChatMessage } from '../../services/chatService';
import { authService } from '../../services/authService';
import { GlassButton } from '../common/GlassButton';
import { LostBadge, FoundBadge } from '../common/Badges';
import { UserSummary } from '../../types';
import {
  Send,
  ShieldCheck,
  MapPin,
  CheckCheck,
  Search,
  MessageSquare,
  ArrowLeft,
  ExternalLink,
  ChevronDown,
  Users,
  UserPlus,
  Sparkles,
  Globe,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface ChatViewProps {
  onOpenItem: (itemId: string) => void;
  onOpenSafety: () => void;
  initialConversationId?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  onOpenItem,
  onOpenSafety,
  initialConversationId,
}) => {
  const { showToast } = useToast();
  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser.id;

  // ─── SAFE STATE INITIALIZATION ───────────────────────────────────
  const loadConversations = useCallback((): ChatConversation[] => {
    try {
      return chatService.getConversations(currentUserId) || [];
    } catch {
      return [];
    }
  }, [currentUserId]);

  const [conversations, setConversations] = useState<ChatConversation[]>(loadConversations);
  const [selectedCategory, setSelectedCategory] = useState<'primary' | 'secondary' | 'social'>('primary');
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── RESET WINDOW SCROLL TO TOP ON MOUNT ─────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // ─── INITIALIZE ACTIVE CONVERSATION ──────────────────────────────
  useEffect(() => {
    const convs = loadConversations();
    setConversations(convs);

    if (initialConversationId) {
      const found = convs.find((c) => c.id === initialConversationId);
      if (found) {
        setSelectedCategory(found.category || 'secondary');
        setActiveConvId(found.id);
        return;
      }
    }

    // On desktop, auto-select first conversation
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      const primaryFirst = convs.find((c) => (c.category || 'secondary') === 'primary');
      if (primaryFirst) {
        setActiveConvId(primaryFirst.id);
        setSelectedCategory('primary');
      } else if (convs.length > 0) {
        setActiveConvId(convs[0].id);
        setSelectedCategory(convs[0].category || 'secondary');
      }
    }
  }, [initialConversationId, currentUserId, loadConversations]);

  // ─── REFRESH CONVERSATIONS DATA (safe) ───────────────────────────
  const refreshConversations = useCallback(() => {
    try {
      const fresh = chatService.getConversations(currentUserId) || [];
      setConversations(fresh);
      return fresh;
    } catch {
      return conversations;
    }
  }, [currentUserId, conversations]);

  // Get active conversation safely
  const activeConv = conversations.find((c) => c.id === activeConvId) || null;

  // ─── MARK AS READ on conversation switch ─────────────────────────
  useEffect(() => {
    if (activeConvId) {
      try {
        chatService.markAsRead(activeConvId);
        refreshConversations();
      } catch {
        // ignore
      }
    }
  }, [activeConvId]);

  // ─── AUTO-SCROLL to bottom of messages (CONTAINER ONLY, no page scroll) ─
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [activeConv?.messages?.length, isTyping, activeConvId]);

  // ─── SOCIAL USER SEARCH & START CHAT ─────────────────────────────
  const matchingUsers = useMemo(() => {
    if (selectedCategory !== 'social' || !searchQuery.trim()) return [];
    return authService.searchUsers(searchQuery, currentUserId);
  }, [selectedCategory, searchQuery, currentUserId]);

  const suggestedMembers = useMemo(() => {
    return authService.getAllUsers().filter((u) => u.id !== currentUserId).slice(0, 6);
  }, [currentUserId]);

  const handleStartSocialChat = useCallback(
    (targetUser: { id: string; name: string; username: string; avatar?: string; isCommunityHelper?: boolean }) => {
      const targetSummary: UserSummary = {
        id: targetUser.id,
        name: targetUser.name,
        username: targetUser.username,
        avatar: targetUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        isVerifiedHelper: targetUser.isCommunityHelper ?? false,
      };
      const conv = chatService.getOrCreateSocialConversation(currentUserId, targetSummary);
      refreshConversations();
      setSelectedCategory('social');
      setActiveConvId(conv.id);
      setSearchQuery('');
      showToast(`Chat opened with @${targetUser.username}`, 'success');
    },
    [currentUserId, refreshConversations, showToast]
  );

  // ─── SEND MESSAGE HANDLER ────────────────────────────────────────
  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const text = textToSend || messageInput;
    if (!text.trim() || !activeConv) return;

    try {
      // Send message with current user's ID as sender
      const updated = chatService.sendMessage(activeConv.id, text.trim(), currentUserId);
      if (updated) {
        setMessageInput('');
        refreshConversations();

        // Clear typing indicator and do not trigger automatic replies
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
        setIsTyping(false);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      showToast('Failed to send message. Please try again.', 'error');
    }
  }, [messageInput, activeConv, currentUserId, refreshConversations, showToast]);

  // ─── CLEANUP typing timeouts ─────────────────────────────────────
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // ─── DERIVED DATA (safe) ─────────────────────────────────────────
  const primaryCount = conversations.filter((c) => (c.category || 'secondary') === 'primary').length;
  const secondaryCount = conversations.filter((c) => (c.category || 'secondary') === 'secondary').length;
  const socialCount = conversations.filter((c) => c.category === 'social').length;

  const filteredConversations = conversations.filter((c) => {
    const convCategory = c.category || 'secondary';
    if (convCategory !== selectedCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (c.otherUser?.name || '').toLowerCase().includes(q) ||
      (c.otherUser?.username || '').toLowerCase().includes(q) ||
      (c.itemTitle || '').toLowerCase().includes(q) ||
      (c.lastMessage || '').toLowerCase().includes(q)
    );
  });

  const quickReplies = activeConv?.category === 'social'
    ? [
        'Hello! 👋',
        'Nice to meet you!',
        'How are you doing today?',
        'Are you based in Nellore?',
        'Glad to connect with you!',
      ]
    : [
        'Can we meet at the nearest bus station?',
        'I have the purchase invoice as proof.',
        'Are you available this afternoon around 4 PM?',
        'Thank you so much for your help!',
      ];

  // ─── RENDER ──────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto py-1 sm:py-2 px-3 sm:px-6 text-left">
      {/* Compact Page Title Bar */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display flex items-center gap-2">
              <span>Chats</span>
              <span className="hidden sm:inline-block text-[11px] font-normal text-slate-400">
                • Encrypted Community Messaging
              </span>
            </h2>
          </div>
        </div>

        <button
          onClick={onOpenSafety}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/20 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Safe Return Guidelines</span>
        </button>
      </div>

      {/* Main Split Chat Stage - Sized to prevent window overflow so input bar is always locked on screen */}
      <div className="rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[calc(100vh-170px)] min-h-[460px] max-h-[calc(100vh-170px)]">
        {/* Left: Conversations List */}
        <div
          className={`md:col-span-5 lg:col-span-4 border-r border-white/10 flex flex-col h-full min-h-0 bg-slate-900/40 overflow-hidden ${
            activeConv ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Thread & User Search Box */}
          <div className="shrink-0 p-2.5 border-b border-white/10">
            <div className="relative flex items-center w-full rounded-xl bg-white/5 px-2.5 py-1.5 border border-white/10 focus-within:border-emerald-400/50">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  selectedCategory === 'social'
                    ? 'Search stranger by username (e.g. varshith)...'
                    : 'Search chats or items...'
                }
                className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* THREE CATEGORIES TABS: Primary vs Secondary vs Social */}
          <div className="shrink-0 grid grid-cols-3 p-1 gap-1 border-b border-white/10 bg-slate-950/50">
            {/* 1. Primary Tab */}
            <button
              onClick={() => {
                setSelectedCategory('primary');
                const firstPrimary = conversations.find(
                  (c) => (c.category || 'secondary') === 'primary'
                );
                if (firstPrimary) setActiveConvId(firstPrimary.id);
              }}
              className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                selectedCategory === 'primary'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Primary</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/30 text-[9px] text-emerald-200">
                {primaryCount}
              </span>
            </button>

            {/* 2. Secondary Tab */}
            <button
              onClick={() => {
                setSelectedCategory('secondary');
                const firstSecondary = conversations.find(
                  (c) => (c.category || 'secondary') === 'secondary'
                );
                if (firstSecondary) setActiveConvId(firstSecondary.id);
              }}
              className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                selectedCategory === 'secondary'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Secondary</span>
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/30 text-[9px] text-cyan-200">
                {secondaryCount}
              </span>
            </button>

            {/* 3. Social Tab */}
            <button
              onClick={() => {
                setSelectedCategory('social');
                const firstSocial = conversations.find((c) => c.category === 'social');
                if (firstSocial) setActiveConvId(firstSocial.id);
              }}
              className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                selectedCategory === 'social'
                  ? 'bg-purple-500/25 text-purple-300 border border-purple-500/45 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Social</span>
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500/30 text-[9px] text-purple-200">
                {socialCount}
              </span>
            </button>
          </div>

          {/* Category Explanation Banner */}
          <div className="shrink-0 px-3 py-1 bg-white/[0.02] border-b border-white/5 text-[10px] text-slate-400 flex items-center justify-between">
            {selectedCategory === 'primary' ? (
              <span className="text-emerald-400/90 font-medium truncate">
                ✓ 3/3 Security Answers Verified
              </span>
            ) : selectedCategory === 'secondary' ? (
              <span className="text-slate-400 font-medium truncate">
                💬 Direct Messages & Inquiries
              </span>
            ) : (
              <span className="text-purple-300/90 font-medium truncate flex items-center gap-1">
                <Globe className="w-3 h-3 text-purple-400 shrink-0" />
                <span>🌐 Social & Stranger Chat (Search by @username)</span>
              </span>
            )}
          </div>

          {/* Conversation List with Custom Scrollbar */}
          <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-white/5 custom-scrollbar">
            {/* Social Mode: Matching Users from Username Search */}
            {selectedCategory === 'social' && matchingUsers.length > 0 && (
              <div className="p-2.5 bg-purple-500/10 border-b border-purple-500/20">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-300 mb-1.5 px-1">
                  <UserPlus className="w-3.5 h-3.5 text-purple-400" />
                  <span>Found Users ({matchingUsers.length})</span>
                </div>
                <div className="space-y-1.5">
                  {matchingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="p-2 rounded-xl bg-slate-900/90 border border-purple-500/30 flex items-center justify-between gap-2 hover:bg-purple-950/40 transition-all"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={user.name}
                          className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0 text-left">
                          <span className="text-xs font-bold text-white truncate block">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-purple-300 font-medium truncate block">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartSocialChat(user)}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[11px] font-semibold flex items-center gap-1 shrink-0 cursor-pointer shadow-sm transition-all"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Chat</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* If Social Mode and No Conversations and No Search Query: Show Suggested Members */}
            {selectedCategory === 'social' && filteredConversations.length === 0 && matchingUsers.length === 0 && (
              <div className="p-4 text-center">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto mb-2.5">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white mb-0.5">Start a Social Chat</h4>
                <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                  Search anyone above by username (e.g. <span className="text-purple-300 font-semibold">varshith</span>, <span className="text-purple-300 font-semibold">priya_doc</span>) or tap anyone below to start chatting:
                </p>
                <div className="space-y-1.5 text-left">
                  {suggestedMembers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleStartSocialChat(user)}
                      className="p-2 rounded-xl bg-slate-950/60 hover:bg-purple-950/30 border border-white/5 hover:border-purple-500/30 flex items-center justify-between gap-2 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={user.name}
                          className="w-7 h-7 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-white group-hover:text-purple-300 transition-colors truncate block">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate block">
                            @{user.username}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold shrink-0 border border-purple-500/30">
                        Chat
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Filtered Conversations List */}
            {filteredConversations.length === 0 && selectedCategory !== 'social' ? (
              <div className="py-12 text-center text-xs text-slate-400 px-4">
                <MessageSquare className="w-7 h-7 text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-300">
                  No {selectedCategory === 'primary' ? 'Primary' : 'Secondary'} chats found
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {selectedCategory === 'primary'
                    ? 'Chats from claimants who answer all 3 security questions correctly appear here.'
                    : 'Direct messages and general questions appear here.'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                if (!conv || !conv.otherUser) return null;
                const isSelected = activeConvId === conv.id;
                const isPrimary = (conv.category || 'secondary') === 'primary';
                const isSocial = conv.category === 'social';
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`p-3 transition-all cursor-pointer flex items-start gap-2.5 relative ${
                      isSelected
                        ? isPrimary
                          ? 'bg-emerald-500/15 border-l-4 border-emerald-400'
                          : isSocial
                          ? 'bg-purple-500/20 border-l-4 border-purple-400'
                          : 'bg-cyan-500/15 border-l-4 border-cyan-400'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    {/* User Avatar with Online status */}
                    <div className="relative shrink-0">
                      <img
                        src={conv.otherUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={conv.otherUser.name || 'User'}
                        className="w-10 h-10 rounded-xl object-cover border border-white/15"
                      />
                      {conv.otherUser.isOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
                      )}
                    </div>

                    {/* Details snippet */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="text-xs font-bold text-white truncate">
                            {conv.otherUser.name || 'Community Member'}
                          </span>
                          {isPrimary && (
                            <span
                              title="3/3 Verified Questions"
                              className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold"
                            >
                              ✓ Verified
                            </span>
                          )}
                          {isSocial && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-purple-500/25 text-purple-300 border border-purple-500/40 font-bold">
                              🌐 Social
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {conv.lastMessageTime || ''}
                        </span>
                      </div>

                      {/* Associated Item Pill or Username */}
                      {isSocial ? (
                        <div className="flex items-center gap-1 text-[11px] text-purple-300 font-medium truncate mb-0.5">
                          <span>@{conv.otherUser.username || 'member'}</span>
                        </div>
                      ) : (
                        <div className="mb-1 space-y-0.5">
                          <div className="flex items-center gap-1 truncate">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-tight inline-block truncate ${
                                conv.itemType === 'found'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {conv.itemType === 'found'
                                ? 'Contacted for claiming the item you found'
                                : 'Contacted for claiming the item you lost'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium truncate">
                            <span className="truncate">📦 {conv.itemTitle || 'Item'}</span>
                          </div>
                        </div>
                      )}

                      <p className="text-xs text-slate-400 truncate">
                        {conv.lastMessage || 'No messages yet'}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {conv.unreadCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 self-center ml-1 shadow-sm shadow-emerald-400" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Conversation */}
        {activeConv ? (
          <div className="md:col-span-7 lg:col-span-8 flex flex-col h-full min-h-0 bg-slate-950/60 overflow-hidden">
            {/* Active Header (Streamlined & Compact) */}
            <div className="shrink-0 px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between gap-2.5 bg-slate-900/60">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  onClick={() => setActiveConvId('')}
                  className="md:hidden p-1 -ml-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="relative shrink-0">
                  <img
                    src={activeConv.otherUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt={activeConv.otherUser?.name || 'User'}
                    className="w-9 h-9 rounded-xl object-cover border border-white/15"
                  />
                  {activeConv.otherUser?.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-white truncate">
                      {activeConv.otherUser?.name || 'Community Member'}
                    </span>
                    {activeConv.otherUser?.username && (
                      <span className="text-[11px] text-slate-400 font-normal">
                        @{activeConv.otherUser.username}
                      </span>
                    )}
                    {activeConv.otherUser?.isVerifiedHelper && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Helper
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                    {activeConv.otherUser?.isOnline ? (
                      <span className="text-emerald-400 font-semibold">Active now</span>
                    ) : (
                      activeConv.otherUser?.lastSeen || 'Offline'
                    )}
                  </span>
                </div>
              </div>

              {/* Right Header Element: Social Badge or Item Anchor Pill */}
              {activeConv.category === 'social' ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold shrink-0">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span>Social Chat</span>
                </div>
              ) : (
                <div
                  onClick={() => onOpenItem(activeConv.itemId)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group shrink-0 max-w-[220px] sm:max-w-xs"
                  title="View original item report"
                >
                  <img
                    src={activeConv.itemImage}
                    alt=""
                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 text-left">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded tracking-tight inline-block truncate max-w-full mb-0.5 ${
                        activeConv.itemType === 'found'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {activeConv.itemType === 'found'
                        ? 'Contacted for claiming the item you found'
                        : 'Contacted for claiming the item you lost'}
                    </span>
                    <span className="text-[11px] font-bold text-white truncate block group-hover:text-emerald-300">
                      {activeConv.itemTitle}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate block">
                      {activeConv.itemLocation}
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-400 shrink-0 ml-1" />
                </div>
              )}
            </div>

            {/* Public Safety Tip Banner - Slim single-line */}
            <div className="shrink-0 px-3 py-1 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">
                  {activeConv.category === 'social'
                    ? 'Direct community chat. Be respectful, kind, and protect personal privacy.'
                    : 'Meet in public daylight areas (e.g. Bus stations, malls). Never wire advance fees.'}
                </span>
              </div>
              <button
                onClick={onOpenSafety}
                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 underline shrink-0 ml-2 cursor-pointer"
              >
                Safety Guide
              </button>
            </div>

            {/* Message Stream Area with Custom Scrollbar */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto min-h-0 p-3 sm:p-4 flex flex-col gap-2.5 custom-scrollbar"
            >
              {/* Context Pill: Contacted for claiming item you found / lost */}
              {activeConv.category !== 'social' && (
                <div className="mx-auto my-0.5 max-w-lg w-full px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between gap-2 text-xs shrink-0 shadow-sm">
                  <div className="flex items-center gap-1.5 truncate">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        activeConv.itemType === 'found' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    />
                    <span className="text-slate-300 font-medium truncate">
                      {activeConv.itemType === 'found'
                        ? 'Contacted for claiming the item you found:'
                        : 'Contacted for claiming the item you lost:'}{' '}
                      <span className="text-white font-bold">{activeConv.itemTitle}</span>
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenItem(activeConv.itemId)}
                    className="text-[10px] text-cyan-300 hover:text-cyan-200 font-semibold shrink-0 flex items-center gap-0.5"
                  >
                    <span>View</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
              {/* If Primary / Secondary Claim with Verification info */}
              {activeConv.category !== 'social' &&
                (Boolean(activeConv.securityAnswers?.length) || Boolean(activeConv.claimantDetails)) && (
                  <div className="mx-auto my-0.5 max-w-lg w-full rounded-xl bg-emerald-500/10 border border-emerald-500/30 overflow-hidden shadow-sm">
                    <div
                      onClick={() => setShowSecurityDetails(!showSecurityDetails)}
                      className="px-3 py-1.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-emerald-500/15 transition-colors select-none"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">
                          {activeConv.securityAnswers && activeConv.securityAnswers.length > 0
                            ? `✓ ${activeConv.securityAnswers.filter((a) => a.isCorrect).length}/${activeConv.securityAnswers.length} Security Answers Verified`
                            : 'Claimant Verification Details'}
                        </span>
                        {activeConv.claimantDetails?.name && (
                          <span className="text-[10px] text-emerald-200/70 font-normal hidden sm:inline">
                            • {activeConv.claimantDetails.name}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-md">
                        <span>{showSecurityDetails ? 'Hide Info' : 'View Answers'}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform duration-200 ${
                            showSecurityDetails ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Expandable Details Tray */}
                    {showSecurityDetails && (
                      <div className="p-3 border-t border-emerald-500/20 space-y-2 text-left bg-slate-950/80">
                        {/* Claimant Contact Details */}
                        {activeConv.claimantDetails && (
                          <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs">
                            <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
                              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Claimant Contact & Location</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
                              <div>
                                <span className="text-slate-400 font-medium">Name: </span>
                                <span className="text-white font-semibold">{activeConv.claimantDetails.name}</span>
                              </div>
                              {activeConv.claimantDetails.contact && (
                                <div>
                                  <span className="text-slate-400 font-medium">Contact: </span>
                                  <span className="text-white font-semibold">{activeConv.claimantDetails.contact}</span>
                                </div>
                              )}
                              {activeConv.claimantDetails.location && (
                                <div className="sm:col-span-2">
                                  <span className="text-slate-400 font-medium">Location: </span>
                                  <span className="text-cyan-200 font-semibold">{activeConv.claimantDetails.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Security Questions & Answers */}
                        {activeConv.securityAnswers && activeConv.securityAnswers.length > 0 && (
                          <div className="space-y-1.5">
                            {activeConv.securityAnswers.map((qa, index) => (
                              <div
                                key={index}
                                className="p-2 rounded-lg bg-slate-900/90 border border-white/10 text-xs"
                              >
                                <div className="text-[11px] text-slate-400 font-medium">
                                  Q{index + 1}: {qa.question}
                                </div>
                                <div className="text-white font-semibold mt-0.5 flex items-center justify-between gap-2">
                                  <span>Ans: &ldquo;{qa.answer}&rdquo;</span>
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                      qa.isCorrect
                                        ? 'text-emerald-400 bg-emerald-500/10'
                                        : 'text-amber-400 bg-amber-500/10'
                                    }`}
                                  >
                                    {qa.isCorrect ? 'Verified' : 'Mismatch'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              {/* If Social Chat: Show friendly connection pill */}
              {activeConv.category === 'social' && (
                <div className="mx-auto my-0.5 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-[11px] font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>Direct connection with @{activeConv.otherUser?.username || 'member'}</span>
                </div>
              )}

              {/* Messages */}
              {(activeConv.messages || []).map((msg) => {
                if (!msg) return null;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
                      msg.isMe ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed text-left transition-all ${
                        msg.isMe
                          ? activeConv.category === 'social'
                            ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white rounded-br-xs shadow-md shadow-purple-950/40'
                            : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-br-xs shadow-md shadow-emerald-950/40'
                          : 'bg-slate-900 border border-white/15 text-slate-200 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 px-1 text-[10px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {msg.isMe && (
                        <CheckCheck
                          className={`w-3 h-3 ${
                            activeConv.category === 'social' ? 'text-purple-400' : 'text-emerald-400'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && activeConv.otherUser && (
                <div className="self-start flex items-center gap-2 p-2.5 rounded-2xl bg-slate-900 border border-white/10 text-xs text-slate-400 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <span>{activeConv.otherUser.name} is typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips (Always pinned at bottom with shrink-0) */}
            <div className="shrink-0 px-3 py-1.5 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                Quick Reply:
              </span>
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSendMessage(reply)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-medium border border-white/10 whitespace-nowrap cursor-pointer transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Message Input Box (Always pinned at bottom with shrink-0) */}
            <div className="shrink-0 p-2.5 sm:p-3 border-t border-white/10 bg-slate-900/60 flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  activeConv.category === 'social'
                    ? `Message @${activeConv.otherUser?.username || 'member'} safely...`
                    : `Message ${activeConv.otherUser?.name || 'user'} safely...`
                }
                className="flex-1 py-2 px-3.5 rounded-xl text-xs text-white bg-slate-900 border border-white/15 outline-none focus:border-emerald-400 transition-colors"
              />
              <GlassButton
                variant="primary"
                size="md"
                disabled={!messageInput.trim()}
                onClick={() => handleSendMessage()}
              >
                <Send className="w-4 h-4" />
              </GlassButton>
            </div>
          </div>
        ) : (
          <div className="md:col-span-8 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <MessageSquare className="w-10 h-10 text-slate-600 mb-2.5" />
            <h4 className="text-base font-bold text-white">Select a conversation</h4>
            <p className="text-xs max-w-sm mt-1">
              Choose a message thread from the left or search a member in Social to coordinate with neighbors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
