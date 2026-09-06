import React, { useState, useRef } from 'react';
import { UserProfile } from '../../types';
import { authService } from '../../services/authService';
import { NEIGHBORHOODS } from '../../data/mockData';
import { GlassModal } from '../common/GlassModal';
import { GlitterStar } from '../common/GlitterOverlay';
import { useToast } from '../common/Toast';
import {
  User,
  AtSign,
  Mail,
  Phone,
  MapPin,
  FileText,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Save,
  X,
  UploadCloud,
  ImagePlus,
  Link,
  Layers,
  Trash2,
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onProfileUpdated: (updatedUser: UserProfile) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [location, setLocation] = useState(currentUser.location);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [avatarSourceTab, setAvatarSourceTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Sync state whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setName(currentUser.name);
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
      setLocation(currentUser.location);
      setBio(currentUser.bio);
      setAvatar(currentUser.avatar);
      setCustomAvatarUrl('');
      setAvatarSourceTab('upload');
      setUploadedFileName(null);
    }
  }, [isOpen, currentUser]);

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please choose an image file (PNG, JPG, WebP, GIF)', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file should be smaller than 8MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setAvatar(dataUrl);
        setUploadedFileName(file.name);
        showToast('Photo uploaded! Save profile to finalize.');
      }
    };
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleApplyCustomAvatar = () => {
    if (customAvatarUrl.trim()) {
      setAvatar(customAvatarUrl.trim());
      setUploadedFileName(null);
      showToast('Custom avatar URL applied!');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    setIsSubmitting(true);

    const cleanUsername =
      username.trim().replace(/^@/, '') ||
      name.toLowerCase().replace(/\s+/g, '_');

    const isCommunityHelper =
      (currentUser.reputationScore || 0) >= 90 &&
      ((currentUser.stats.successfulReturns || 0) >= 2 ||
        (currentUser.stats.lostReports || 0) + (currentUser.stats.foundReports || 0) >= 3);

    const updatedUser = authService.updateCurrentUser({
      name: name.trim(),
      username: cleanUsername,
      email: email.trim() || currentUser.email,
      phone: phone.trim() || currentUser.phone,
      location: location.trim() || currentUser.location,
      bio: bio.trim() || currentUser.bio,
      avatar: avatar.trim() || currentUser.avatar,
      isCommunityHelper,
    });

    setIsSubmitting(false);
    showToast('Profile updated successfully!');
    onProfileUpdated(updatedUser);
    onClose();
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-cyan-300" />
          <span>Edit Community Profile</span>
          <GlitterStar size={12} className="text-cyan-200" variant="fast" />
        </div>
      }
      subtitle="Update your public profile, profile picture, contact coordination details, and helper badges."
    >
      <form onSubmit={handleSave} className="space-y-4 p-4 sm:p-6 text-left">
        {/* Hidden File Input for Device Photo Upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* Avatar Chooser & Upload Section */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`p-4 rounded-2xl border transition-all ${
            isDragging
              ? 'bg-cyan-500/15 border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400'
              : 'bg-white/[0.03] border-cyan-500/25'
          } flex flex-col sm:flex-row items-center gap-4`}
        >
          {/* Avatar Preview with Click-To-Upload Overlay */}
          <div className="relative group shrink-0">
            <img
              src={avatar}
              alt="Avatar preview"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
              title="Click to choose a photo from your device"
            >
              <Camera className="w-4 h-4 mb-0.5 text-cyan-300" />
              <span>Upload Photo</span>
            </button>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md pointer-events-none">
              <Camera className="w-3 h-3 stroke-[2.5]" />
            </span>
          </div>

          <div className="flex-1 w-full min-w-0">
            {/* Tab selector for Avatar Source */}
            <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Profile Picture</span>
                {uploadedFileName && (
                  <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded-md truncate max-w-[120px]">
                    {uploadedFileName}
                  </span>
                )}
              </span>

              {/* Pill Switcher */}
              <div className="flex items-center p-0.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setAvatarSourceTab('upload')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    avatarSourceTab === 'upload'
                      ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <ImagePlus className="w-3 h-3" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarSourceTab('preset')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    avatarSourceTab === 'preset'
                      ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Presets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarSourceTab('url')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    avatarSourceTab === 'url'
                      ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Link className="w-3 h-3" />
                  <span>URL</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Upload Own Photo */}
            {avatarSourceTab === 'upload' && (
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 hover:text-white border border-cyan-400/40 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <UploadCloud className="w-4 h-4 text-cyan-300 stroke-[2.2]" />
                  <span>Choose Image File</span>
                </button>
                <span className="text-[11px] text-slate-400 text-center sm:text-left">
                  or drag & drop here (PNG, JPG, WebP up to 8MB)
                </span>
              </div>
            )}

            {/* TAB 2: Presets */}
            {avatarSourceTab === 'preset' && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                {PRESET_AVATARS.map((av, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatar(av);
                      setUploadedFileName(null);
                    }}
                    className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      avatar === av
                        ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/30'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={av} alt="Avatar" className="w-full h-full object-cover" />
                    {avatar === av && (
                      <span className="absolute inset-0 bg-cyan-500/25 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-200" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* TAB 3: Custom Web URL */}
            {avatarSourceTab === 'url' && (
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="Paste direct image link (https://...)"
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs text-white outline-none focus:border-cyan-400"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomAvatar}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Name & Username Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Display Name *
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Username (@handle)
            </label>
            <div className="relative flex items-center">
              <AtSign className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username_handle"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl"
              />
            </div>
          </div>
        </div>

        {/* Email & Phone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Phone / WhatsApp
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl"
              />
            </div>
          </div>
        </div>

        {/* Primary Location Corridor */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Primary Nellore / Andhra Pradesh Location
          </label>
          <div className="relative flex items-center">
            <MapPin className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white outline-none backdrop-blur-xl cursor-pointer"
            >
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={`${n}, Nellore`}>
                  {n}, Nellore
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bio / Tagline */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Bio & Community Status
          </label>
          <div className="relative flex items-start">
            <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell neighbors what corridors you frequent and your items recovery experiences..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl resize-none"
            />
          </div>
        </div>

        {/* Dynamic Reputation Note */}
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-400/40">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Community Helper Status</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-cyan-400/20 text-cyan-300 font-semibold">
                  Automatic
                </span>
              </div>
              <div className="text-[10px] text-slate-300">
                Earned automatically when reputation reaches 90+ with verified item handovers
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs tracking-wide shadow-[0_6px_22px_rgba(6,182,212,0.5)] border border-white/70 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 relative overflow-hidden"
          >
            {/* Top specular reflection */}
            <span className="absolute inset-x-0 top-0 h-1/2 bg-white/40 pointer-events-none rounded-t-xl" />
            <Save className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Save Profile</span>
            <GlitterStar size={10} className="text-slate-950" variant="fast" />
          </button>
        </div>
      </form>
    </GlassModal>
  );
};
