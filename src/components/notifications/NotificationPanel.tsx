import React, { useState } from 'react';
import { NotificationItem, ItemPost } from '../../types';
import { notificationService } from '../../services/notificationService';
import { itemService } from '../../services/itemService';
import { GlassModal } from '../common/GlassModal';
import { GlassButton } from '../common/GlassButton';
import { Bell, Sparkles, MessageCircle, ShieldCheck, CheckCheck, Clock } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenItem: (post: ItemPost) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  onOpenItem,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    notificationService.getNotifications()
  );
  const [filter, setFilter] = useState<'all' | 'unread' | 'match' | 'claim'>('all');

  const handleMarkAllRead = () => {
    const updated = notificationService.markAllAsRead();
    setNotifications(updated);
  };

  const handleItemClick = (notif: NotificationItem) => {
    notificationService.markAsRead(notif.id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (notif.relatedItemId) {
      const post = itemService.getPostById(notif.relatedItemId);
      if (post) {
        onOpenItem(post);
        onClose();
      }
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'match') return n.type === 'match_found';
    if (filter === 'claim') return n.type === 'claim_received' || n.type === 'claim_accepted';
    return true;
  });

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-emerald-400" />
          <span>Activity & Alerts</span>
        </div>
      }
      subtitle="Real-time recovery alerts, AI match suggestions, and verification updates"
      maxWidth="md"
    >
      <div className="flex flex-col gap-4 text-left">
        {/* Header Actions & Filters */}
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 flex-wrap">
          <div className="flex items-center gap-1">
            {(['all', 'unread', 'match', 'claim'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={handleMarkAllRead}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No notifications matching current filter
            </div>
          ) : (
            filteredNotifs.map((notif) => {
              const getIcon = () => {
                switch (notif.type) {
                  case 'match_found':
                    return <Sparkles className="w-4 h-4 text-emerald-400" />;
                  case 'comment':
                    return <MessageCircle className="w-4 h-4 text-sky-400" />;
                  case 'claim_received':
                  case 'claim_accepted':
                    return <ShieldCheck className="w-4 h-4 text-amber-400" />;
                  default:
                    return <Bell className="w-4 h-4 text-slate-400" />;
                }
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  className={`p-3 rounded-2xl border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                    notif.read
                      ? 'bg-white/[0.02] border-white/5 opacity-75 hover:opacity-100 hover:bg-white/5'
                      : 'bg-emerald-500/[0.07] border-emerald-500/30 hover:bg-emerald-500/15'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white/5 shrink-0 mt-0.5">{getIcon()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className="text-xs font-bold text-white truncate">{notif.title}</h5>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </GlassModal>
  );
};
