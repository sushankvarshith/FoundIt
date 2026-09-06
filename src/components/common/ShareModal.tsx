import React, { useState } from 'react';
import { ItemPost } from '../../types';
import { GlassModal } from './GlassModal';
import { GlassButton } from './GlassButton';
import { useToast } from './Toast';
import { Copy, Check, Share2, MapPin, Gift, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ItemPost | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, post }) => {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const shareUrl = `${window.location.origin}#item-${post.id}`;
  const shareText = `${post.type === 'lost' ? '🚨 LOST ITEM ALERT' : '🟢 FOUND ITEM ALERT'}: ${
    post.title
  } near ${post.location.neighborhood}, Nellore, Andhra Pradesh. Please help reunite!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    showToast('Link and alert text copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSocialShare = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    let url = '';

    switch (platform) {
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'x':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator
            .share({
              title: post.title,
              text: shareText,
              url: shareUrl,
            })
            .catch(() => {});
          return;
        } else {
          handleCopy();
          return;
        }
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-emerald-400" />
          <span>Share Alert With Community</span>
        </div>
      }
      subtitle="Sharing boosts recovery rates by 68% within the first 24 hours"
      maxWidth="md"
    >
      <div className="flex flex-col gap-5 text-left">
        {/* Generated Share-Card Preview */}
        <div className="rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-4 shadow-xl relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  post.type === 'lost'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {post.type === 'lost' ? 'LOST IN NELLORE, AP' : 'FOUND IN NELLORE, AP'}
              </span>
              <span className="text-[10px] text-slate-400">{post.dateOccurred}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400">FoundIt Network</span>
          </div>

          <div className="flex gap-3">
            <img
              src={post.images[0]}
              alt={post.title}
              className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold text-white truncate">{post.title}</h5>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
                <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{post.location.neighborhood}, Nellore</span>
              </p>
              {post.reward?.hasReward && (
                <p className="text-xs font-bold text-amber-300 flex items-center gap-1 mt-1">
                  <Gift className="w-3 h-3 shrink-0" />
                  <span>
                    Reward: ₹{post.reward.amount?.toLocaleString()} Offered
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Link Copy Bar */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900 border border-white/15">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="bg-transparent text-xs text-slate-300 flex-1 px-2 outline-none truncate"
          />
          <GlassButton
            size="sm"
            variant={copied ? 'secondary' : 'primary'}
            leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={handleCopy}
          >
            {copied ? 'Copied!' : 'Copy'}
          </GlassButton>
        </div>

        {/* Social Share Grid */}
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
            Broadcast To Channels
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              onClick={() => handleSocialShare('whatsapp')}
              className="p-3 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-emerald-300 text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="text-base">💬</span>
              <span>WhatsApp</span>
            </button>
            <button
              onClick={() => handleSocialShare('telegram')}
              className="p-3 rounded-xl bg-[#0088cc]/15 hover:bg-[#0088cc]/25 border border-[#0088cc]/30 text-sky-300 text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="text-base">✈️</span>
              <span>Telegram</span>
            </button>
            <button
              onClick={() => handleSocialShare('x')}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="text-base">𝕏</span>
              <span>X (Twitter)</span>
            </button>
            <button
              onClick={() => handleSocialShare('facebook')}
              className="p-3 rounded-xl bg-[#1877F2]/15 hover:bg-[#1877F2]/25 border border-[#1877F2]/30 text-blue-300 text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="text-base">📘</span>
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* System Native Share Button if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <GlassButton
            variant="outline"
            size="md"
            className="w-full"
            leftIcon={<ExternalLink className="w-4 h-4" />}
            onClick={() => handleSocialShare('native')}
          >
            Open Device System Share
          </GlassButton>
        )}
      </div>
    </GlassModal>
  );
};
