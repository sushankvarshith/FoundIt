import React from 'react';
import { GlassModal } from './GlassModal';
import { ShieldAlert, ShieldCheck, MapPin, AlertTriangle, PhoneCall, Check } from 'lucide-react';

interface SafetyGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyGuidelinesModal: React.FC<SafetyGuidelinesModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <GlassModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Community Safety & Return Protocol</span>
        </div>
      }
      subtitle="Mandatory guidelines to protect citizens during item returns and verification"
      maxWidth="lg"
    >
      <div className="flex flex-col gap-5 text-left text-xs text-slate-300 leading-relaxed">
        {/* Safe Meetup Recommendation */}
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              Public Safe-Exchange Zones
            </h4>
            <p>
              Always arrange the physical handover in well-lit, CCTV-monitored public spaces:
            </p>
            <ul className="list-disc pl-4 mt-1.5 space-y-1 text-slate-300">
              <li>Metro Station Customer Service counters (e.g. Raidurg, Hitec City, Ameerpet)</li>
              <li>Shopping Mall information desks (Inorbit Mall, Forum Sujana, Sarath City)</li>
              <li>Local Police Station visitor areas or busy day-time coffee shops</li>
            </ul>
          </div>
        </div>

        {/* Verification Before Meeting */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
          <Check className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-white mb-1">
              Strict Identity Verification
            </h4>
            <p>
              Never hand over an item without demanding the claimant answer the private
              verification questions (e.g., unlocking the phone passcode in front of you, naming
              internal wallet contents, or matching purchase bills).
            </p>
          </div>
        </div>

        {/* Anti-Scam Rules */}
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-300 mb-1">
              Zero Tolerance Anti-Extortion
            </h4>
            <p className="text-slate-300">
              Never pay shipping fees, courier deposits, or ransom to anonymous callers claiming
              to have your device. FoundIt is a community goodwill initiative. If anyone solicits
              fraudulent upfront payments, report them immediately.
            </p>
          </div>
        </div>

        {/* Emergency Assistance */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Emergency / Cyber Helpline (Andhra Pradesh): 1930 / 112</span>
          </div>
          <span className="text-[11px] font-semibold text-white">Always Available</span>
        </div>
      </div>
    </GlassModal>
  );
};
