import React, { useState, useRef } from 'react';
import { PostType, ItemCategory, ItemPost } from '../../types';
import { CATEGORIES, NEIGHBORHOODS } from '../../data/mockData';
import { itemService } from '../../services/itemService';
import { authService } from '../../services/authService';
import { GlassCard } from '../common/GlassCard';
import { GlassButton } from '../common/GlassButton';
import { GlassInput } from '../common/GlassInput';
import { ItemCard } from '../feed/ItemCard';
import { useToast } from '../common/Toast';
import {
  UploadCloud,
  MapPin,
  Calendar,
  Gift,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Camera,
  Layers,
  Check,
  Lock,
  HelpCircle,
} from 'lucide-react';

interface UploadWizardProps {
  onComplete: (createdPost: ItemPost) => void;
  onCancel: () => void;
}

export const UploadWizard: React.FC<UploadWizardProps> = ({ onComplete, onCancel }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step state
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishPhase, setPublishPhase] = useState<string>('');
  const [completedPost, setCompletedPost] = useState<ItemPost | null>(null);

  // Form fields
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
  ]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [identifyingFeatures, setIdentifyingFeatures] = useState('');

  // 3 Security Verification Questions & Answers (Mandatory before upload)
  const [securityQ1, setSecurityQ1] = useState('What unique sticker, scratch, or accessory is on it?');
  const [securityA1, setSecurityA1] = useState('');
  const [securityQ2, setSecurityQ2] = useState('What is inside the compartment or displayed on the screen?');
  const [securityA2, setSecurityA2] = useState('');
  const [securityQ3, setSecurityQ3] = useState('What specific brand or serial number detail can verify ownership?');
  const [securityA3, setSecurityA3] = useState('');

  // Location
  const [neighborhood, setNeighborhood] = useState('VRC Centre');
  const [locationName, setLocationName] = useState('Near VRC Clock Tower');
  const [city] = useState('Nellore');

  // Date & Time
  const [dateOccurred, setDateOccurred] = useState('Today around 3:30 PM');

  // Privacy & Reward
  const [contactPreference, setContactPreference] = useState<'foundit_chat' | 'claim_first'>('claim_first');
  const [hasReward, setHasReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState<number>(2000);
  const [rewardNote, setRewardNote] = useState('Thank you for helping me find this!');

  // Sample photo helpers
  const samplePhotos = [
    { label: 'Phone', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80' },
    { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80' },
    { label: 'Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80' },
    { label: 'Keys', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&auto=format&fit=crop&q=80' },
  ];

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImages([reader.result as string, ...images.slice(0, 2)]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preview object
  const currentUser = authService.getCurrentUser();
  const previewPost: ItemPost = {
    id: 'preview_temp',
    type: selectedType || 'lost',
    title: title || (selectedType === 'lost' ? 'Lost Item Title' : 'Found Item Title'),
    category: category,
    brand: brand || undefined,
    model: model || undefined,
    color: color || 'Color not specified',
    description: description || 'Detailed description of the item and circumstances...',
    identifyingFeatures: identifyingFeatures || undefined,
    images: images.length > 0 ? images : [samplePhotos[0].url],
    location: {
      name: locationName || 'Central Area',
      city: 'Nellore',
      neighborhood: neighborhood,
      distanceKm: 1.2,
      lat: 14.4426,
      lng: 79.9865,
      approximate: true,
    },
    dateOccurred: dateOccurred || 'Recently',
    dateReported: new Date().toISOString(),
    status: 'active',
    reward:
      selectedType === 'lost' && hasReward
        ? {
            hasReward: true,
            amount: rewardAmount,
            currency: '₹',
            note: rewardNote,
          }
        : undefined,
    uploader: {
      id: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      isVerifiedHelper: currentUser.isCommunityHelper,
    },
    securityQuestions: [
      { question: securityQ1.trim(), answer: securityA1.trim() },
      { question: securityQ2.trim(), answer: securityA2.trim() },
      { question: securityQ3.trim(), answer: securityA3.trim() },
    ],
    stats: { likes: 0, commentsCount: 0, shares: 0 },
    userInteractions: { liked: false, saved: false },
    contactPreference: contactPreference,
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    const phases = [
      'Uploading item imagery...',
      'Analyzing item features with AI...',
      'Encrypting 3 ownership verification questions...',
      'Geocoding approximate neighborhood zone...',
      'Setting up privacy-safe claim channel...',
      'Publishing to Nellore & Andhra Pradesh Community Feed...',
    ];

    for (let i = 0; i < phases.length; i++) {
      setPublishPhase(phases[i]);
      await new Promise((r) => setTimeout(r, 350));
    }

    const created = itemService.createPost({
      type: selectedType || 'lost',
      title: title.trim() || `${selectedType === 'lost' ? 'Lost' : 'Found'} ${category}`,
      category,
      brand: brand.trim() || undefined,
      model: model.trim() || undefined,
      color: color.trim() || 'Multicolor',
      description: description.trim() || 'Reported through FoundIt network.',
      identifyingFeatures: identifyingFeatures.trim() || undefined,
      images: images.length > 0 ? images : [samplePhotos[0].url],
      location: {
        name: locationName.trim() || `Near ${neighborhood}`,
        city: 'Nellore',
        neighborhood,
        distanceKm: Math.floor(Math.random() * 30) / 10 + 0.5,
        lat: 14.4426,
        lng: 79.9865,
        approximate: true,
      },
      dateOccurred,
      status: 'active',
      securityQuestions: [
        { question: securityQ1.trim(), answer: securityA1.trim() },
        { question: securityQ2.trim(), answer: securityA2.trim() },
        { question: securityQ3.trim(), answer: securityA3.trim() },
      ],
      reward:
        selectedType === 'lost' && hasReward
          ? {
              hasReward: true,
              amount: rewardAmount,
              currency: '₹',
              note: rewardNote,
            }
          : undefined,
      uploader: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        isVerifiedHelper: currentUser.isCommunityHelper,
      },
      contactPreference,
    });

    setIsPublishing(false);
    setCompletedPost(created);
    showToast(
      selectedType === 'lost'
        ? 'Lost item report published successfully!'
        : 'Found item report published successfully!'
    );
  };

  // CHOICE SCREEN: WHAT HAPPENED? (Section 13)
  if (!selectedType) {
    return (
      <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-400 mb-3 border border-white/15">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Community Report Gateway</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
          What Happened?
        </h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto mt-2">
          Choose whether you are looking for an item you lost, or helping return something you discovered.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-8 max-w-2xl mx-auto">
          {/* Choice 1: Lost */}
          <div
            onClick={() => setSelectedType('lost')}
            className="group p-8 rounded-3xl bg-gradient-to-b from-rose-500/15 via-white/[0.04] to-transparent border-2 border-rose-500/30 hover:border-rose-500/80 backdrop-blur-xl shadow-xl hover:shadow-rose-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg shadow-rose-950/40">
              🔴
            </div>
            <h3 className="text-xl font-bold text-white mt-5 group-hover:text-rose-300 transition-colors">
              I Lost Something
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Broadcast an alert to thousands of active Nellore neighbors, residents, and commuters across Andhra Pradesh.
            </p>
            <span className="mt-6 text-xs font-bold text-rose-400 flex items-center gap-1">
              <span>Start Lost Item Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          {/* Choice 2: Found */}
          <div
            onClick={() => setSelectedType('found')}
            className="group p-8 rounded-3xl bg-gradient-to-b from-emerald-500/15 via-white/[0.04] to-transparent border-2 border-emerald-500/30 hover:border-emerald-500/80 backdrop-blur-xl shadow-xl hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg shadow-emerald-950/40">
              🟢
            </div>
            <h3 className="text-xl font-bold text-white mt-5 group-hover:text-emerald-300 transition-colors">
              I Found Something
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Safely log an item you recovered. Keep your personal contact and exact home address private.
            </p>
            <span className="mt-6 text-xs font-bold text-emerald-400 flex items-center gap-1">
              <span>Start Found Item Report</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={onCancel}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            &larr; Return to main feed
          </button>
        </div>
      </div>
    );
  }

  // SUCCESS SCREEN
  if (completedPost) {
    return (
      <div className="max-w-2xl mx-auto py-8 sm:py-12 px-4 text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-4 animate-in zoom-in-75">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-white font-display">
          ✓ Successfully Published!
        </h2>
        <p className="text-sm text-slate-300 max-w-md mt-2">
          Your {completedPost.type === 'lost' ? 'lost item report' : 'found item post'} is now live on FoundIt.
          Nearby community members will be notified.
        </p>

        <div className="w-full max-w-md my-6">
          <ItemCard
            post={completedPost}
            onOpenDetails={() => onComplete(completedPost)}
            onToggleLike={() => {}}
            onToggleSave={() => {}}
            onOpenShare={() => {}}
            onOpenClaim={() => {}}
          />
        </div>

        <div className="flex gap-3">
          <GlassButton variant="primary" size="lg" onClick={() => onComplete(completedPost)}>
            View In Community Feed
          </GlassButton>
        </div>
      </div>
    );
  }

  // PUBLISHING PROGRESS ANIMATION (Section 33)
  if (isPublishing) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center flex flex-col items-center">
        <div className="relative w-24 h-24 mb-6">
          <div className="w-full h-full rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-emerald-400 font-bold text-xs">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white font-display">Publishing Report</h3>
        <p className="text-sm font-semibold text-emerald-300 mt-2 animate-pulse">{publishPhase}</p>
        <p className="text-xs text-slate-400 mt-1">Connecting to Nellore, Andhra Pradesh lost & found network</p>
      </div>
    );
  }

  // STEPS IN WIZARD (Sections 14 & 15)
  const steps = [
    { num: 1, title: 'Photo' },
    { num: 2, title: 'Item Details' },
    { num: 3, title: 'Security' },
    { num: 4, title: 'Location' },
    { num: 5, title: 'Time' },
    { num: 6, title: 'Privacy' },
    ...(selectedType === 'lost' ? [{ num: 7, title: 'Reward' }] : []),
    { num: selectedType === 'lost' ? 8 : 7, title: 'Preview' },
  ];

  const totalSteps = steps.length;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 text-left">
      {/* Top Header & Back */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
            } else {
              setSelectedType(null);
            }
          }}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
              selectedType === 'lost'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {selectedType === 'lost' ? 'Lost Item Report' : 'Found Item Report'}
          </span>
          <span className="text-xs text-slate-400">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      <GlassCard level="primary" className="p-6 sm:p-8">
        {/* STEP 1: ITEM PHOTO */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Upload Item Photography
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Clear photos dramatically boost recognition and quick recovery.
              </p>
            </div>

            {/* Main Upload Box */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-emerald-400/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-white/[0.03] hover:bg-emerald-500/[0.04] transition-all cursor-pointer group"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFile}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:scale-105 transition-all mb-3">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-emerald-300">
                Click to upload from device or drag & drop
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                JPEG, PNG, WEBP up to 10MB
              </p>
            </div>

            {/* Current Selected Image Preview */}
            {images.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Active Photo Preview:
                </span>
                <div className="flex items-center gap-3">
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/20">
                    <img src={images[0]} alt="Selected" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Primary
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <p className="font-semibold text-white">Image ready for publishing</p>
                    <p className="mt-0.5">You can also pick a demo placeholder below.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Demo Photo Selection */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Or choose sample photo:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {samplePhotos.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    onClick={() => setImages([sample.url])}
                    className={`p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                      images[0] === sample.url
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <img
                      src={sample.url}
                      alt={sample.label}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                    <span className="text-xs font-medium text-slate-300 mt-1 block truncate">
                      {sample.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ITEM INFORMATION */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-bold text-white font-display">Item Details</h3>
              <p className="text-xs text-slate-400 mt-1">
                Provide accurate information so searchers can filter and identify it.
              </p>
            </div>

            <GlassInput
              label="Item Title *"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apple iPhone 15 Pro, Black Leather Wallet..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 tracking-wide block mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full py-2.5 px-3.5 rounded-xl text-sm text-white bg-slate-900 border border-white/15 outline-none cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <GlassInput
                label="Primary Color *"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Matte Black, Rose Gold, Navy..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GlassInput
                label="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple, Sony, Titan, Samsonite..."
              />
              <GlassInput
                label="Model / Variant"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. M2 13-inch, 256GB..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 tracking-wide block mb-1.5">
                Description *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe circumstances, where you last had it, or where you discovered it..."
                className="w-full p-3 rounded-xl text-sm text-white bg-slate-900/80 border border-white/15 outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            <GlassInput
              label="Distinguishing Characteristics"
              value={identifyingFeatures}
              onChange={(e) => setIdentifyingFeatures(e.target.value)}
              placeholder="e.g. Tiny sticker on bottom, specific keychain, scratched screen..."
              helperText="Tip: Keep one secret detail for the ownership verification claim flow!"
            />
          </div>
        )}

        {/* STEP 3: 3 SECURITY VERIFICATION QUESTIONS (Mandatory Before Upload) */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Anti-Fraud & Ownership Protection</span>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Set 3 Security Questions
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                When someone clicks <span className="text-white font-semibold">Claim</span> on your item, they will be required to answer these 3 questions. Claimants with 3/3 correct answers will be routed to your <span className="text-emerald-400 font-semibold">Primary Verified Chats</span>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white block mb-0.5">
                  Keep answers concise & specific
                </span>
                The correct answers are stored securely and never displayed to the public feed or claimants.
              </div>
            </div>

            {/* Question 1 */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                  1
                </span>
                <span className="text-xs font-bold text-white">Security Question #1 *</span>
              </div>
              <GlassInput
                value={securityQ1}
                onChange={(e) => setSecurityQ1(e.target.value)}
                placeholder="e.g. What specific case, sticker, or scratch is on the item?"
              />
              <div>
                <label className="text-xs font-semibold text-emerald-300 block mb-1">
                  Secret Correct Answer #1 *
                </label>
                <GlassInput
                  value={securityA1}
                  onChange={(e) => setSecurityA1(e.target.value)}
                  placeholder="Enter the expected answer (e.g. Matte black Spigen case)"
                />
              </div>
            </div>

            {/* Question 2 */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                  2
                </span>
                <span className="text-xs font-bold text-white">Security Question #2 *</span>
              </div>
              <GlassInput
                value={securityQ2}
                onChange={(e) => setSecurityQ2(e.target.value)}
                placeholder="e.g. What is inside the main pocket / lock screen wallpaper?"
              />
              <div>
                <label className="text-xs font-semibold text-emerald-300 block mb-1">
                  Secret Correct Answer #2 *
                </label>
                <GlassInput
                  value={securityA2}
                  onChange={(e) => setSecurityA2(e.target.value)}
                  placeholder="Enter the expected answer (e.g. Photo of mountains / Bus pass ending in 44)"
                />
              </div>
            </div>

            {/* Question 3 */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                  3
                </span>
                <span className="text-xs font-bold text-white">Security Question #3 *</span>
              </div>
              <GlassInput
                value={securityQ3}
                onChange={(e) => setSecurityQ3(e.target.value)}
                placeholder="e.g. What specific serial digits, brand feature, or keychain is attached?"
              />
              <div>
                <label className="text-xs font-semibold text-emerald-300 block mb-1">
                  Secret Correct Answer #3 *
                </label>
                <GlassInput
                  value={securityA3}
                  onChange={(e) => setSecurityA3(e.target.value)}
                  placeholder="Enter the expected answer (e.g. Silver metallic ring / 256GB storage)"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: LOCATION */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                {selectedType === 'lost' ? 'Lost Location' : 'Found Location'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pinpoint the approximate area. Your exact home address is never shown publicly.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 tracking-wide block mb-1.5">
                  Neighborhood / Hub *
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl text-sm text-white bg-slate-900 border border-white/15 outline-none cursor-pointer"
                >
                  {NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <GlassInput
                label="Prominent Landmark / Street"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Near Trunk Road, AC Centre, VRC Clock Tower..."
              />
            </div>

            {/* Static Location Preview Graphic */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">
                    {locationName || neighborhood}, Nellore
                  </h5>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Protected approximate coordinates</span>
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/10 text-slate-300">
                Auto-tagged
              </span>
            </div>
          </div>
        )}

        {/* STEP 5: DATE & TIME */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Date & Approximate Time
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                When did this incident or discovery take place?
              </p>
            </div>

            <GlassInput
              label="Approximate Date & Time"
              value={dateOccurred}
              onChange={(e) => setDateOccurred(e.target.value)}
              placeholder="e.g. Today at 3:30 PM, Yesterday evening, Sept 4..."
              leftIcon={<Calendar className="w-4 h-4 text-emerald-400" />}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {['Today morning', 'Today afternoon', 'Yesterday evening', '2 days ago'].map(
                (quickTime) => (
                  <button
                    key={quickTime}
                    type="button"
                    onClick={() => setDateOccurred(quickTime)}
                    className="p-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors text-center cursor-pointer"
                  >
                    {quickTime}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* STEP 6: CONTACT PREFERENCES (Section 14 & 15) */}
        {currentStep === 6 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Contact & Safety Preferences
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                We never expose your phone number, email, or residential address to the public.
              </p>
            </div>

            <div className="space-y-3">
              <label
                onClick={() => setContactPreference('claim_first')}
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  contactPreference === 'claim_first'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="contact_pref"
                  checked={contactPreference === 'claim_first'}
                  onChange={() => setContactPreference('claim_first')}
                  className="mt-1 accent-emerald-500"
                />
                <div>
                  <span className="text-sm font-bold text-white block">
                    Safe Claim First (Recommended)
                  </span>
                  <span className="text-xs text-slate-300 block mt-0.5">
                    Claimants must answer your private verification questions before establishing contact.
                  </span>
                </div>
              </label>

              <label
                onClick={() => setContactPreference('foundit_chat')}
                className={`p-4 rounded-2xl border flex items-start gap-3 cursor-pointer transition-all ${
                  contactPreference === 'foundit_chat'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="contact_pref"
                  checked={contactPreference === 'foundit_chat'}
                  onChange={() => setContactPreference('foundit_chat')}
                  className="mt-1 accent-emerald-500"
                />
                <div>
                  <span className="text-sm font-bold text-white block">
                    Allow In-App FoundIt Messages
                  </span>
                  <span className="text-xs text-slate-300 block mt-0.5">
                    Permit verified community members to message you directly within FoundIt.
                  </span>
                </div>
              </label>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>🔒 Personal details are protected under FoundIt Safe Return Guidelines.</span>
            </div>
          </div>
        )}

        {/* STEP 7 (FOR LOST ONLY): REWARD */}
        {selectedType === 'lost' && currentStep === 7 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-bold text-white font-display">Bounty & Reward</h3>
              <p className="text-xs text-slate-400 mt-1">
                Offering a cash reward or token of gratitude boosts helper motivation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHasReward(false)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  !hasReward
                    ? 'border-emerald-500 bg-emerald-500/15 text-white font-bold'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                No Reward
              </button>
              <button
                type="button"
                onClick={() => setHasReward(true)}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  hasReward
                    ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                🎁 Offer Bounty / Gift
              </button>
            </div>

            {hasReward && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-4">
                <GlassInput
                  label="Reward Amount (₹ INR)"
                  type="number"
                  value={rewardAmount}
                  onChange={(e) => setRewardAmount(parseInt(e.target.value, 10) || 0)}
                  leftIcon={<span className="font-bold text-amber-300">₹</span>}
                />
                <GlassInput
                  label="Note to Finder"
                  value={rewardNote}
                  onChange={(e) => setRewardNote(e.target.value)}
                  placeholder="e.g. Sincere gratitude upon safe handover, no questions asked!"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 8 / FINAL STEP: PREVIEW (Section 14 & 15) */}
        {((selectedType === 'lost' && currentStep === 8) ||
          (selectedType === 'found' && currentStep === 7)) && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-bold text-white font-display">
                Post Preview
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Review exactly how your post will look to neighbors in the live feed.
              </p>
            </div>

            <div className="max-w-md mx-auto w-full">
              <ItemCard
                post={previewPost}
                onOpenDetails={() => {}}
                onToggleLike={() => {}}
                onToggleSave={() => {}}
                onOpenShare={() => {}}
                onOpenClaim={() => {}}
              />
            </div>
          </div>
        )}

        {/* WIZARD BOTTOM ACTIONS */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-5 border-t border-white/10">
          <GlassButton
            type="button"
            variant="ghost"
            size="md"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else {
                setSelectedType(null);
              }
            }}
          >
            Back
          </GlassButton>

          {currentStep < totalSteps ? (
            <GlassButton
              type="button"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                if (currentStep === 2 && !title.trim()) {
                  showToast('Please enter an item title to proceed', 'error');
                  return;
                }
                if (currentStep === 3) {
                  if (
                    !securityQ1.trim() ||
                    !securityA1.trim() ||
                    !securityQ2.trim() ||
                    !securityA2.trim() ||
                    !securityQ3.trim() ||
                    !securityA3.trim()
                  ) {
                    showToast('Please specify all 3 security questions and their answers', 'error');
                    return;
                  }
                }
                setCurrentStep(currentStep + 1);
              }}
            >
              Next Step
            </GlassButton>
          ) : (
            <GlassButton
              type="button"
              variant={selectedType === 'lost' ? 'urgent' : 'primary'}
              size="lg"
              leftIcon={<Check className="w-5 h-5" />}
              onClick={handlePublish}
            >
              {selectedType === 'lost' ? 'Publish Lost Item' : 'Publish Found Item'}
            </GlassButton>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
