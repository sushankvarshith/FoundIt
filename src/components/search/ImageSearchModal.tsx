import React, { useState, useRef } from 'react';
import { GlassModal } from '../common/GlassModal';
import { GlassButton } from '../common/GlassButton';
import { searchService, ImageScanResult } from '../../services/searchService';
import { UploadCloud, Camera, Sparkles, CheckCircle2, ArrowRight, RefreshCw, Eye } from 'lucide-react';
import { ItemPost } from '../../types';
import { MatchBadge } from '../common/Badges';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (post: ItemPost) => void;
}

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ImageScanResult | null>(null);
  const [activeStep, setActiveStep] = useState<'upload' | 'scanning' | 'results'>('upload');
  const [resultFilter, setResultFilter] = useState<'all' | 'lost' | 'found'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = [
    {
      name: 'Black iPhone 15 Pro',
      url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Leather Wallet',
      url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Vehicle Smart Key',
      url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Golden Retriever Pup',
      url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      startScan(url, file.name);
    };
    reader.readAsDataURL(file);
  };

  const startScan = async (url: string, name: string) => {
    setImagePreview(url);
    setImageName(name);
    setIsScanning(true);
    setActiveStep('scanning');

    try {
      const res = await searchService.simulateImageScan(url, name);
      setScanResult(res);
      setIsScanning(false);
      setActiveStep('results');
    } catch {
      setIsScanning(false);
      setActiveStep('upload');
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setImageName('');
    setScanResult(null);
    setActiveStep('upload');
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>AI Visual Match Search</span>
        </div>
      }
      subtitle="Upload or snap a photo to instantly find matching lost & found reports"
      maxWidth="2xl"
    >
      <div className="flex flex-col gap-6 text-left">
        {activeStep === 'upload' && (
          <div className="flex flex-col gap-5">
            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/20 hover:border-emerald-400/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-white/[0.03] hover:bg-emerald-500/[0.04] transition-all duration-300 cursor-pointer group"
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300 mb-3 shadow-lg">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-emerald-300">
                Drop your item photo here, or browse
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Supports JPG, PNG, WEBP. Our AI extracts device models, color patterns, and
                distinguishing markings.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  Camera / Mobile Snap
                </span>
              </div>
            </div>

            {/* Quick Test Demo Photos */}
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                Or try with a demo photo:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {sampleImages.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => startScan(sample.url, sample.name)}
                    className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 text-left transition-all duration-200 group flex flex-col gap-2 cursor-pointer"
                  >
                    <div className="w-full aspect-video rounded-xl overflow-hidden bg-slate-900">
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-300 group-hover:text-emerald-300 truncate">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: AI SCANNING ANIMATION (Section 32) */}
        {activeStep === 'scanning' && imagePreview && (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-64 h-64 rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 bg-slate-950">
              <img
                src={imagePreview}
                alt="Scanning"
                className="w-full h-full object-cover opacity-80"
              />

              {/* Laser scan beam line passing across */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-beam shadow-[0_0_15px_#10b981]" />

              {/* Scanning visual overlay & crosshairs */}
              <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] pointer-events-none" />
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

              {/* Pulsing AI indicator */}
              <div className="absolute bottom-3 inset-x-3 py-1 px-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 text-center">
                <span className="text-[11px] font-bold text-emerald-300 animate-pulse flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Extracting visual features...
                </span>
              </div>
            </div>

            <div className="mt-5 text-center">
              <h4 className="text-base font-bold text-white">Analyzing Object Characteristics</h4>
              <p className="text-xs text-slate-400 mt-1">
                Searching active lost & found records in Nellore & Andhra Pradesh regions...
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: MATCHING RESULTS */}
        {activeStep === 'results' && scanResult && (
          <div className="flex flex-col gap-5">
            {/* Scanned Summary Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Scanned item"
                    className="w-14 h-14 rounded-xl object-cover border border-white/20 shrink-0"
                  />
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">
                      Detected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {scanResult.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-emerald-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1 shrink-0"
                title="Scan another image"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">New Scan</span>
              </button>
            </div>

            {/* Matching Posts List with Filter Pills */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Visual Matches Found ({scanResult.matches.length})
                  </h5>
                  <span className="text-[11px] text-cyan-300 font-mono">• Ranked by CV Similarity</span>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 self-start sm:self-auto">
                  {(['all', 'lost', 'found'] as const).map((filterKey) => (
                    <button
                      key={filterKey}
                      type="button"
                      onClick={() => setResultFilter(filterKey)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                        resultFilter === filterKey
                          ? filterKey === 'lost'
                            ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                            : filterKey === 'found'
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                            : 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {filterKey === 'all' ? 'All Matches' : filterKey === 'lost' ? 'Lost Items' : 'Found Items'}
                    </button>
                  ))}
                </div>
              </div>

              {(() => {
                const displayedMatches = scanResult.matches.filter((m) => {
                  if (resultFilter === 'lost') return m.type === 'lost';
                  if (resultFilter === 'found') return m.type === 'found';
                  return true;
                });

                if (displayedMatches.length > 0) {
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                      {displayedMatches.map((match) => (
                        <div
                          key={match.id}
                          onClick={() => {
                            onSelectResult(match);
                            onClose();
                          }}
                          className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 transition-all duration-200 flex gap-3 cursor-pointer group text-left"
                        >
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                            <img
                              src={match.images[0]}
                              alt={match.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <span
                              className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                                match.type === 'lost'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-emerald-500 text-white'
                              }`}
                            >
                              {match.type.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <MatchBadge score={match.matchConfidence} size="sm" />
                                <span className="text-[10px] text-slate-400 truncate">
                                  {match.location.neighborhood}
                                </span>
                              </div>
                              <h6 className="text-xs font-bold text-white truncate group-hover:text-emerald-300">
                                {match.title}
                              </h6>
                              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                {match.color} &bull; {match.category}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-emerald-400 font-semibold pt-1">
                              <span>View Item & Claim</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                }

                return (
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 mb-1">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                    </div>
                    <h6 className="text-sm font-bold text-white">No items matching current filter</h6>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Switch filter to &ldquo;All Matches&rdquo; to view other visually similar reports in Nellore.
                    </p>
                    <button
                      onClick={() => setResultFilter('all')}
                      className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                    >
                      Show All Visual Matches
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </GlassModal>
  );
};
