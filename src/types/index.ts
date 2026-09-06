export type PostType = 'lost' | 'found';

export type PostStatus = 'active' | 'submitted' | 'found' | 'resolved';

export type ItemCategory = 
  | 'Electronics'
  | 'Mobile Phones'
  | 'Laptops'
  | 'Wallets'
  | 'Keys'
  | 'Bags'
  | 'Documents'
  | 'Jewelry'
  | 'Clothing'
  | 'Accessories'
  | 'Vehicles'
  | 'Pets'
  | 'Other';

export interface LocationInfo {
  name: string;
  city: string;
  neighborhood: string;
  distanceKm: number;
  lat: number;
  lng: number;
  approximate: boolean;
}

export interface RewardInfo {
  hasReward: boolean;
  amount?: number;
  currency: string;
  note?: string;
}

export interface SecurityQuestion {
  question: string;
  answer: string;
}

export interface UserSummary {
  id: string;
  name: string;
  username: string;
  avatar: string;
  rating?: number;
  returnsCount?: number;
  isVerifiedHelper?: boolean;
}

export interface ItemPost {
  id: string;
  type: PostType;
  title: string;
  category: ItemCategory;
  brand?: string;
  model?: string;
  color: string;
  description: string;
  identifyingFeatures?: string;
  images: string[];
  location: LocationInfo;
  dateOccurred: string;
  dateReported: string;
  status: PostStatus;
  reward?: RewardInfo;
  uploader: UserSummary;
  securityQuestions?: SecurityQuestion[];
  stats: {
    likes: number;
    commentsCount: number;
    shares: number;
  };
  userInteractions: {
    liked: boolean;
    saved: boolean;
  };
  contactPreference: 'foundit_chat' | 'claim_first';
  matchScore?: number; // Calculated on search
}

export interface Comment {
  id: string;
  itemId: string;
  user: UserSummary;
  text: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface Claim {
  id: string;
  itemId: string;
  itemTitle: string;
  claimant: UserSummary;
  claimantPhone?: string;
  claimantLocation?: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected';
  answers: {
    question: string;
    answer: string;
  }[];
  contactNote: string;
  createdAt: string;
  reviewedAt?: string;
  score?: number; // Number of correct answers (0 - 3)
  isVerified?: boolean;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  itemId?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  otherUser: UserSummary;
  item?: ItemPost;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  category: 'primary' | 'secondary';
  isVerifiedClaim?: boolean;
  securityAnswers?: { question: string; answer: string }[];
}

export interface CommunityBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface AppNotification {
  id: string;
  type: 'comment' | 'match' | 'match_found' | 'claim' | 'claim_received' | 'claim_accepted' | 'status' | 'share';
  title: string;
  message: string;
  itemId?: string;
  relatedItemId?: string;
  read: boolean;
  timestamp: string;
}

export type NotificationItem = AppNotification;

export interface UserProfile {
  id: string;
  role?: 'user' | 'admin';
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  location: string;
  city: string;
  joinedDate?: string;
  reputationScore?: number;
  reportedCount?: number;
  returnsCount?: number;
  badges?: CommunityBadge[];
  stats: {
    lostReports: number;
    foundReports: number;
    successfulReturns: number;
    helpfulActions: number;
  };
  reputationBadge: string;
  isCommunityHelper: boolean;
  settings: {
    theme: 'dark' | 'light' | 'system';
    defaultRadiusKm: number;
    defaultLocation: string;
    contactPreferences: 'app_only' | 'verified_only';
    locationVisibility: 'approximate' | 'exact_on_claim';
    profileVisibility: 'public' | 'community_only';
    notifications: {
      nearbyMatches: boolean;
      comments: boolean;
      likes: boolean;
      claims: boolean;
      statusUpdates: boolean;
    };
  };
}

export type FeedSortOption = 
  | 'recent'
  | 'closest'
  | 'relevant'
  | 'liked'
  | 'commented';

export interface FeedFilterOptions {
  type: 'all' | 'lost' | 'found';
  category?: string;
  neighborhood?: string;
  maxDistanceKm?: number;
  status?: PostStatus | 'all';
  hasRewardOnly?: boolean;
  searchQuery?: string;
  sortBy: FeedSortOption;
}
