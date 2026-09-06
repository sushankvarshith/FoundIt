import { MOCK_CLAIMS } from '../data/mockData';
import { Claim, UserSummary } from '../types';
import { apiClient } from './apiClient';

const STORAGE_KEY = 'foundit_item_claims';

export const claimService = {
  getClaims(): Claim[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return MOCK_CLAIMS;
  },

  submitClaim(data: {
    itemId: string;
    itemTitle: string;
    claimant: UserSummary;
    claimantPhone?: string;
    claimantLocation?: string;
    answers: { question: string; answer: string }[];
    contactNote: string;
    score?: number;
    isVerified?: boolean;
  }): Promise<Claim> {
    return new Promise((resolve) => {
      const claims = this.getClaims();
      const newClaim: Claim = {
        id: `claim_${Date.now()}`,
        itemId: data.itemId,
        itemTitle: data.itemTitle,
        claimant: data.claimant,
        claimantPhone: data.claimantPhone,
        claimantLocation: data.claimantLocation,
        status: 'pending',
        answers: data.answers,
        contactNote: data.contactNote,
        createdAt: new Date().toISOString(),
        score: data.score,
        isVerified: data.isVerified,
      };
      const updated = [newClaim, ...claims];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }

      // Sync with Java backend
      apiClient.post('/claims', {
        itemId: data.itemId,
        itemTitle: data.itemTitle,
        claimantId: data.claimant.id,
        claimantName: data.claimant.name,
        claimantUsername: data.claimant.username,
        claimantAvatar: data.claimant.avatar,
        contactNote: data.contactNote,
        q1: data.answers.length > 0 ? data.answers[0].question : 'Verification Proof',
        a1: data.answers.length > 0 ? data.answers[0].answer : 'Provided',
      }).catch(() => {});

      resolve(newClaim);
    });
  },

  getClaimsForItem(itemId: string): Claim[] {
    return this.getClaims().filter((c) => c.itemId === itemId);
  },

  getUserClaims(userId: string): Claim[] {
    return this.getClaims().filter((c) => c.claimant.id === userId);
  },

  updateClaimStatus(claimId: string, status: Claim['status']): Claim | null {
    const claims = this.getClaims();
    const index = claims.findIndex((c) => c.id === claimId);
    if (index === -1) return null;
    claims[index] = {
      ...claims[index],
      status,
      reviewedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(claims));
    } catch {
      // ignore
    }

    // Sync status with Java backend
    apiClient.put(`/claims/${claimId}/status`, { status }).catch(() => {});

    return claims[index];
  },

  deleteClaimsByUserId(userId: string): number {
    const claims = this.getClaims();
    const remaining = claims.filter(
      (c) => c.claimant?.id !== userId && c.claimant?.username !== userId
    );
    const count = claims.length - remaining.length;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    } catch {
      // ignore
    }
    return count;
  },
};
