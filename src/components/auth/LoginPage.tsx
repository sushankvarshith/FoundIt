import React, { useState, useRef } from 'react';
import { authService } from '../../services/authService';
import { UserProfile } from '../../types';
import { NEIGHBORHOODS } from '../../data/mockData';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { FoundItLogo } from '../common/FoundItLogo';
import { GlitterStar, AmbientGlitterField } from '../common/GlitterOverlay';
import { useToast } from '../common/Toast';
import {
  Mail,
  Lock,
  User,
  AtSign,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  LogIn,
  UserPlus,
  UploadCloud,
  Camera,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: (user: UserProfile) => void;
  onCancel?: () => void;
  initialMode?: 'login' | 'signup';
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onCancel,
  initialMode = 'login',
}) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupLocation, setSignupLocation] = useState('Magunta Layout, Nellore');
  const [signupBio, setSignupBio] = useState('');
  const [signupAvatar, setSignupAvatar] = useState(PRESET_AVATARS[1]);
  const signupFileInputRef = useRef<HTMLInputElement>(null);

  const handleSignupAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        if (result) {
          setSignupAvatar(result);
          showToast('Custom avatar uploaded!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.login(loginEmail, loginPassword);
      if (res.success && res.user) {
        showToast(`Welcome back, ${res.user.name}!`);
        onSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Failed to sign in. Please verify credentials.');
      }
    } catch {
      setErrorMessage('An unexpected authentication error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signupName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!signupPassword || signupPassword.length < 4) {
      setErrorMessage('Password should contain at least 4 characters.');
      return;
    }

    const finalUsername =
      signupUsername.trim() ||
      signupName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    setIsLoading(true);
    try {
      const res = await authService.signup({
        name: signupName.trim(),
        username: finalUsername,
        email: signupEmail.trim(),
        password: signupPassword,
        phone: signupPhone.trim() || '+91 98765 00000',
        location: signupLocation,
        bio: signupBio.trim() || 'Active community member in Nellore, Andhra Pradesh.',
        avatar: signupAvatar,
      });

      if (res.success && res.user) {
        showToast(`Account created! Welcome to FoundIt, ${res.user.name}!`);
        onSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Failed to create account.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred during signup.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] py-8 sm:py-12 px-3 sm:px-6 flex items-center justify-center">
      {/* Background Glitter Starfield */}
      <AmbientGlitterField />

      {/* Radial liquid illumination backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[540px] h-96 sm:h-[540px] bg-gradient-to-tr from-cyan-500/20 via-teal-500/10 to-blue-600/25 rounded-full blur-[110px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Liquid Glass Auth Container */}
        <GlassCard level="highlight" className="p-6 sm:p-8 border border-cyan-400/40 shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
          {/* Top Close / Cancel Button */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close and return to feed"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Header Brand & Twinkle */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative mb-2">
              <FoundItLogo size="lg" />
              <span className="absolute -top-2 -right-3">
                <GlitterStar size={16} className="text-cyan-200" variant="fast" />
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xs mt-1">
              Nellore & Andhra Pradesh's community network for safely recovering and returning lost belongings.
            </p>
          </div>

          {/* Liquid Glass Segmented Pill Switcher (Sign In vs Create Account) */}
          <div className="relative flex p-1 rounded-2xl bg-[#050c1e]/80 border border-cyan-500/25 backdrop-blur-xl mb-6 shadow-inner">
            {/* Specular gloss streak */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.05] rounded-t-2xl pointer-events-none" />

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer relative z-10 ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_4px_16px_rgba(6,182,212,0.45)] border border-cyan-300/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
              {mode === 'login' && <GlitterStar size={10} className="text-white" variant="fast" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer relative z-10 ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-[0_4px_16px_rgba(6,182,212,0.45)] border border-white/60 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
              {mode === 'signup' && <GlitterStar size={10} className="text-slate-950" variant="fast" />}
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <span className="shrink-0 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                !
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MODE 1: LOGIN (EMAIL & PASSWORD) */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Email Address</span>
                  <span className="text-[10px] text-cyan-400 font-normal">mail&pass login</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="sushankvarshith16@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginPassword('password123');
                      showToast('Default password auto-filled: password123');
                    }}
                    className="text-[10px] text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer"
                  >
                    Forgot or need demo pass?
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-sm text-white placeholder:text-slate-500 outline-none backdrop-blur-xl transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-cyan-300 transition-colors p-1 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-cyan-500/30 bg-slate-950 text-cyan-500 focus:ring-0 focus:outline-none accent-cyan-400"
                  />
                  <span>Remember my login</span>
                </label>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Encrypted & Safe</span>
                </span>
              </div>

              {/* Primary Sign In Button with Liquid Glow */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm tracking-wide shadow-[0_8px_30px_rgba(6,182,212,0.5)] border-2 border-white/70 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden flex items-center justify-center gap-2 group"
              >
                {/* Specular gloss top reflection */}
                <span className="absolute inset-x-0 top-0 h-1/2 bg-white/40 pointer-events-none rounded-t-2xl" />
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Signing in safely...</span>
                  </span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 stroke-[2.5]" />
                    <span>Sign In to FoundIt</span>
                    <GlitterStar size={12} className="text-slate-950 ml-1" variant="fast" />
                    <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE 2: SIGN UP (CREATE NEW ACCOUNT) */}
          {mode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-left">
              {/* Full Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Sushank Varshith"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <AtSign className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      placeholder="sushank_v"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Password *
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 4 characters"
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 text-slate-400 hover:text-cyan-300 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone & Neighborhood Corridor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Phone / WhatsApp
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nellore & AP Area
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <select
                      value={signupLocation}
                      onChange={(e) => setSignupLocation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white outline-none backdrop-blur-xl cursor-pointer"
                    >
                      {NEIGHBORHOODS.map((n) => (
                        <option key={n} value={`${n}, Nellore`}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Avatar Selector with Upload Option */}
              <div>
                <input
                  type="file"
                  ref={signupFileInputRef}
                  accept="image/*"
                  onChange={handleSignupAvatarUpload}
                  className="hidden"
                />
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Choose Profile Avatar</span>
                  <button
                    type="button"
                    onClick={() => signupFileInputRef.current?.click()}
                    className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload photo</span>
                  </button>
                </label>
                <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
                  {/* Upload button chip */}
                  <button
                    type="button"
                    onClick={() => signupFileInputRef.current?.click()}
                    className="w-11 h-11 rounded-2xl border-2 border-dashed border-cyan-400/60 hover:border-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 flex flex-col items-center justify-center text-cyan-300 transition-all cursor-pointer shrink-0"
                    title="Upload image from device"
                  >
                    <Camera className="w-4 h-4" />
                    <span className="text-[8px] font-bold mt-0.5">Upload</span>
                  </button>

                  {/* Preset avatars */}
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSignupAvatar(av)}
                      className={`relative w-11 h-11 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        signupAvatar === av
                          ? 'border-cyan-400 ring-2 ring-cyan-400/40 scale-105'
                          : 'border-white/20 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt="Avatar option" className="w-full h-full object-cover" />
                      {signupAvatar === av && (
                        <span className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio / Headline */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  About You (Bio)
                </label>
                <input
                  type="text"
                  value={signupBio}
                  onChange={(e) => setSignupBio(e.target.value)}
                  placeholder="e.g. Resident in Magunta Layout / Working near Trunk Road"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-cyan-500/25 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 outline-none backdrop-blur-xl"
                />
              </div>

              {/* Submit Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm tracking-wide shadow-[0_8px_30px_rgba(6,182,212,0.5)] border-2 border-white/70 active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden flex items-center justify-center gap-2 group"
              >
                {/* Specular reflection */}
                <span className="absolute inset-x-0 top-0 h-1/2 bg-white/40 pointer-events-none rounded-t-2xl" />
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Creating your profile...</span>
                  </span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    <span>Create Free Account</span>
                    <GlitterStar size={12} className="text-slate-950 ml-1" variant="fast" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Security Note */}
          <div className="mt-5 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Community safe. Your contact details remain private until verified.</span>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
