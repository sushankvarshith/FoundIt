import React, { useState, useEffect } from 'react';
import { ItemPost } from '../../types';
import { GlassModal } from '../common/GlassModal';
import { GlassButton } from '../common/GlassButton';
import { GlassInput } from '../common/GlassInput';
import { claimService } from '../../services/claimService';
import { authService } from '../../services/authService';
import { notificationService } from '../../services/notificationService';
import { chatService } from '../../services/chatService';
import { useToast } from '../common/Toast';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  MapPin,
  User,
  Phone,
} from 'lucide-react';

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ItemPost | null;
  onClaimSubmitted?: () => void;
  onOpenChat?: (conversationId: string) => void;
}

function checkAnswerMatch(expected: string, userAns: string): boolean {
  if (!expected || !userAns) return false;
  const expNorm = expected.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();
  const userNorm = userAns.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim();

  if (expNorm === userNorm) return true;
  if (expNorm.includes(userNorm) && userNorm.length >= 2) return true;
  if (userNorm.includes(expNorm) && expNorm.length >= 2) return true;

  // Keyword overlap
  const expWords = expNorm.split(/\s+/).filter((w) => w.length > 2);
  const userWords = new Set(userNorm.split(/\s+/).filter((w) => w.length > 2));
  if (expWords.length > 0) {
    const matches = expWords.filter((w) => userWords.has(w));
    if (matches.length >= Math.ceil(expWords.length * 0.45)) {
      return true;
    }
  }
  return false;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  post,
  onClaimSubmitted,
  onOpenChat,
}) => {
  const { showToast } = useToast();
  const currentUser = authService.getCurrentUser();

  // Multi-step: 'details' -> 'security' -> success view
  const [claimStep, setClaimStep] = useState<'details' | 'security'>('details');

  // Step 1: Personal Details & Location
  const [claimantName, setClaimantName] = useState(currentUser.name || '');
  const [claimantPhone, setClaimantPhone] = useState(currentUser.phone || '');
  const [claimantLocation, setClaimantLocation] = useState('');
  const [contactNote, setContactNote] = useState('');

  // Step 2: 3 Security Answers
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');

  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultScore, setResultScore] = useState<number>(0);
  const [isResultVerified, setIsResultVerified] = useState<boolean>(false);
  const [createdConvId, setCreatedConvId] = useState<string>('');

  useEffect(() => {
    if (isOpen && currentUser) {
      setClaimantName(currentUser.name || '');
      setClaimantPhone(currentUser.phone || '');
    }
  }, [isOpen, currentUser]);

  if (!post) return null;

  const isClaimingFoundItem = post.type === 'found';

  // Dynamic verification questions: use uploader's 3 questions if set, or category defaults
  const getSecurityQuestions = () => {
    if (post.securityQuestions && post.securityQuestions.length >= 3) {
      return post.securityQuestions;
    }
    return [
      {
        question: `What specific distinguishing feature, case, or scratch does this ${post.category} have?`,
        answer: post.identifyingFeatures || post.color || '',
      },
      {
        question: `What is the exact brand, model, or inner label of the item?`,
        answer: post.brand || post.model || '',
      },
      {
        question: `What landmark or specific circumstances confirm you are connected to this item?`,
        answer: post.location.name || post.location.neighborhood || '',
      },
    ];
  };

  const securityQuestions = getSecurityQuestions();

  const handleProceedToSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!claimantLocation.trim()) {
      showToast('Please specify the found or lost location', 'error');
      return;
    }
    setClaimStep('security');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer1.trim() || !answer2.trim() || !answer3.trim()) {
      showToast('Please answer all 3 security questions to verify your claim', 'error');
      return;
    }

    setIsSubmitting(true);

    // Check answers against owner's expected answers
    const a1Match = checkAnswerMatch(securityQuestions[0].answer, answer1);
    const a2Match = checkAnswerMatch(securityQuestions[1].answer, answer2);
    const a3Match = checkAnswerMatch(securityQuestions[2].answer, answer3);
    const score = (a1Match ? 1 : 0) + (a2Match ? 1 : 0) + (a3Match ? 1 : 0);
    const verified = score === 3;

    try {
      // 1. Submit claim to claim registry
      await claimService.submitClaim({
        itemId: post.id,
        itemTitle: post.title,
        claimant: {
          id: currentUser.id,
          name: claimantName.trim() || currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
          isVerifiedHelper: currentUser.isCommunityHelper,
        },
        claimantPhone: claimantPhone.trim(),
        claimantLocation: claimantLocation.trim(),
        answers: [
          { question: securityQuestions[0].question, answer: answer1 },
          { question: securityQuestions[1].question, answer: answer2 },
          { question: securityQuestions[2].question, answer: answer3 },
        ],
        contactNote: contactNote || 'Please contact me on FoundIt to coordinate safe handover.',
        score,
        isVerified: verified,
      });

      // 2. Trigger in-app notification to the item uploader
      notificationService.addNotification({
        type: verified ? 'claim_received' : 'claim',
        title: verified
          ? `🎉 Verified Claim on "${post.title}"!`
          : `New Claim on "${post.title}" (${score}/3 score)`,
        message: verified
          ? `${claimantName} answered all 3 security questions correctly! Check your Primary Chats.`
          : `${claimantName} answered ${score}/3 questions on your report. Check your Secondary Chats.`,
        itemId: post.id,
      });

      // 3. Automatically create/connect conversation in chatService with BOTH participants
      const initialChatMsg = contactNote.trim()
        ? `Hello! I submitted a verification claim for "${post.title}".\n📍 Location: ${claimantLocation.trim()}${claimantPhone.trim() ? `\n📞 Contact: ${claimantPhone.trim()}` : ''}\n💬 Note: ${contactNote.trim()}`
        : `Hello! I submitted a verification claim for "${post.title}".\n📍 Location: ${claimantLocation.trim()}${claimantPhone.trim() ? `\n📞 Contact: ${claimantPhone.trim()}` : ''}`;

      const conv = chatService.createOrGetConversation({
        itemId: post.id,
        itemTitle: post.title,
        itemImage: post.images[0] || '',
        itemType: post.type,
        itemLocation: post.location.name,
        claimantUser: {
          id: currentUser.id,
          name: claimantName.trim() || currentUser.name,
          username: currentUser.username,
          avatar: currentUser.avatar,
          isVerifiedHelper: currentUser.isCommunityHelper,
        },
        uploaderUser: post.uploader,
        claimantDetails: {
          name: claimantName.trim() || currentUser.name,
          contact: claimantPhone.trim(),
          location: claimantLocation.trim(),
          note: contactNote.trim(),
        },
        category: verified ? 'primary' : 'secondary',
        isVerifiedClaim: verified,
        securityAnswers: [
          { question: securityQuestions[0].question, answer: answer1, isCorrect: a1Match },
          { question: securityQuestions[1].question, answer: answer2, isCorrect: a2Match },
          { question: securityQuestions[2].question, answer: answer3, isCorrect: a3Match },
        ],
        initialMessage: initialChatMsg,
      });

      setResultScore(score);
      setIsResultVerified(verified);
      setCreatedConvId(conv.id);
      setIsSubmitting(false);
      setIsSuccess(true);

      if (verified) {
        showToast('🎉 Perfect match! 3/3 questions verified. Message sent to uploader!');
      } else {
        showToast(`Claim logged (${score}/3 score). Message sent to uploader's chats.`);
      }

      if (onClaimSubmitted) onClaimSubmitted();
    } catch {
      setIsSubmitting(false);
      showToast('Could not submit claim. Please retry.', 'error');
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setClaimStep('details');
    setAnswer1('');
    setAnswer2('');
    setAnswer3('');
    setClaimantLocation('');
    setContactNote('');
    onClose();
  };

  const handleGoToChat = () => {
    handleClose();
    if (onOpenChat && createdConvId) {
      onOpenChat(createdConvId);
    }
  };

  return (
    <GlassModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{isClaimingFoundItem ? 'Claim Found Item' : 'Report Item Found / Ownership'}</span>
        </div>
      }
      subtitle={`Case #${post.id} — ${post.title}`}
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-6 flex flex-col items-center text-center gap-4">
          <div
            className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg ${
              isResultVerified
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/20'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-amber-500/20'
            }`}
          >
            {isResultVerified ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold ${
                  isResultVerified
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                Verification Score: {resultScore} / 3 Correct
              </span>
            </div>
            <h4 className="text-xl font-bold text-white">
              {isResultVerified
                ? '3/3 Answers Verified Correctly!'
                : 'Claim Submitted & Dispatched to Uploader'}
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
            {isResultVerified ? (
              <>
                Your answers perfectly matched the uploader&apos;s security criteria! A direct verified message has been sent to{' '}
                <span className="text-emerald-400 font-bold">{post.uploader.name}&apos;s Primary Chats</span>.
              </>
            ) : (
              <>
                You answered {resultScore} of 3 questions correctly. Your claim message with your details has been dispatched to{' '}
                <span className="text-amber-300 font-bold">{post.uploader.name}&apos;s Secondary Chats</span> inbox for review.
              </>
            )}
          </p>

          <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Conversation created between you and {post.uploader.name}</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Both of you can now view this chat in your <span className="text-white font-medium">Chats</span> page to safely coordinate handover in Nellore.
            </p>
          </div>

          <div className="flex items-center gap-3 mt-3 w-full sm:w-auto">
            <GlassButton variant="ghost" size="md" onClick={handleClose}>
              Done & Return
            </GlassButton>
            {onOpenChat && (
              <GlassButton
                variant="primary"
                size="md"
                onClick={handleGoToChat}
                leftIcon={<MessageSquare className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Open Chat with {post.uploader.name}
              </GlassButton>
            )}
          </div>
        </div>
      ) : claimStep === 'details' ? (
        /* STEP 1: CLAIMANT PERSONAL DETAILS & LOCATION */
        <form onSubmit={handleProceedToSecurity} className="flex flex-col gap-4 text-left">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black flex items-center justify-center">
                1
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Step 1: Your Details & Location
              </span>
            </div>
            <span className="text-xs text-slate-400">Step 1 of 2</span>
          </div>

          {/* Claimant Name */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your Full Name *</span>
            </label>
            <GlassInput
              required
              value={claimantName}
              onChange={(e) => setClaimantName(e.target.value)}
              placeholder="e.g. Sushank Varshith"
            />
          </div>

          {/* Contact Phone / WhatsApp */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Contact Phone / WhatsApp (Optional)</span>
            </label>
            <GlassInput
              type="tel"
              value={claimantPhone}
              onChange={(e) => setClaimantPhone(e.target.value)}
              placeholder="e.g. +91 94401 23456"
            />
          </div>

          {/* Found / Lost Location */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {isClaimingFoundItem
                  ? 'Where / which area did you lose your item? *'
                  : 'Where / which area did you find this item? *'}
              </span>
            </label>
            <GlassInput
              required
              value={claimantLocation}
              onChange={(e) => setClaimantLocation(e.target.value)}
              placeholder="e.g. Near VRC Clock Tower / Gandhi Nagar Park / MGB Mall..."
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Helps the uploader confirm you were in the same area.
            </span>
          </div>

          {/* Handover Note */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5">
              Message to Uploader / Circumstances Note
            </label>
            <textarea
              rows={2}
              value={contactNote}
              onChange={(e) => setContactNote(e.target.value)}
              placeholder="e.g. I have kept this item safely with me and can meet at the bus station or mall..."
              className="w-full p-3 rounded-xl text-sm text-white bg-slate-900/80 border border-white/15 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <GlassButton type="button" variant="ghost" size="md" onClick={handleClose}>
              Cancel
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Security Questions
            </GlassButton>
          </div>
        </form>
      ) : (
        /* STEP 2: ANSWER 3 SECURITY QUESTIONS */
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black flex items-center justify-center">
                2
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Step 2: Security Verification
              </span>
            </div>
            <span className="text-xs text-slate-400">Step 2 of 2</span>
          </div>

          {/* Privacy Trust Banner */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-white block mb-0.5">
                3 Security Questions Set by {post.uploader.name}
              </span>
              Answer all 3 questions attached to this report. Matching all 3 will route your chat into the{' '}
              <span className="text-emerald-400 font-semibold">Primary Verified</span> inbox!
            </div>
          </div>

          {/* Question 1 */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. {securityQuestions[0].question}</span>
              <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={answer1}
              onChange={(e) => setAnswer1(e.target.value)}
              placeholder="Enter specific answer..."
              className="w-full p-3 rounded-xl text-sm text-white bg-slate-900/80 border border-white/15 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Question 2 */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. {securityQuestions[1].question}</span>
              <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={2}
              value={answer2}
              onChange={(e) => setAnswer2(e.target.value)}
              placeholder="Enter specific answer..."
              className="w-full p-3 rounded-xl text-sm text-white bg-slate-900/80 border border-white/15 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Question 3 */}
          <div>
            <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. {securityQuestions[2].question}</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              required
              type="text"
              value={answer3}
              onChange={(e) => setAnswer3(e.target.value)}
              placeholder="Enter corroborating proof or detail..."
              className="w-full p-3 rounded-xl text-sm text-white bg-slate-900/80 border border-white/15 outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <GlassButton
              type="button"
              variant="ghost"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setClaimStep('details')}
            >
              Back to Details
            </GlassButton>
            <GlassButton
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<ShieldCheck className="w-4 h-4" />}
            >
              Verify & Submit Claim
            </GlassButton>
          </div>
        </form>
      )}
    </GlassModal>
  );
};
