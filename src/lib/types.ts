import type { Timestamp } from 'firebase/firestore';

export type UserRole = 'admin' | 'operator';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  emailVerified?: boolean;
}

export interface Author {
  id: string;
  handle: string;
  displayName?: string;
  avatarUrl?: string;
  authorWeight: 1.0 | 0.6 | 0.2;
  lastRepliedAt?: Timestamp;
}

export type PostStatus = 'queued' | 'manual' | 'skipped' | 'processed';

export interface Post {
  id: string;
  sourcePostId: string;
  authorHandle: string;
  author: Author;
  text: string;
  createdAt: Timestamp;
  language?: string;
  topicTags: string[];
  priorityScore?: number;
  riskScore?: number;
  rawJson?: any;
  status: PostStatus;
}

export interface Candidate {
  id: string;
  postId: string;
  text: string;
  tone: string;
  emojis: string[];
  safetyScore: number;
  semanticVector?: number[];
  createdAt: Timestamp;
  generatedBy: string;
  safetyChecks?: SafetyCheckResult;
}

export type ReplyStatus = 'posted' | 'failed' | 'paused' | 'approved';

export interface Reply {
  id: string;
  candidateId: string;
  postId: string;
  postedText: string;
  postedAt?: Timestamp;
  posterWorkerId?: string;
  status: ReplyStatus;
  xReplyId?: string;
}

export interface Flag {
  id: string;
  postId: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
}

export interface Template {
  id: string;
  name: string;
  seed: string;
  tone: string;
  tags: string[];
  safetyFlags: string[];
  sampleOutputs: string[];
  version: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SystemConfig {
  rateLimits: {
    global: number;
    perAuthor: number;
    jitter: number;
  };
  emojiPools: string[];
  blacklistWords: string[];
  safetyThresholds: {
    toxicity: number;
    political: number;
    medical: number;
    doxx: number;
  };
  isSystemPaused: boolean;
}

export interface ApiKeys {
  xApiKey: string;
  openAiApiKey: string;
}

export interface SafetyCheckResult {
  toxicity: number;
  political: number;
  medical: number;
  doxx: number;
}

export interface AuditLog {
  id: string;
  timestamp: Timestamp;
  user: string; // or User ID
  action: string;
  details: any;
}
