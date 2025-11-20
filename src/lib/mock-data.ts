import { Timestamp } from 'firebase/firestore';
import type { Post, Candidate, Template, Author, AuditLog, SafetyCheckResult } from './types';

const now = new Date();

const createTimestamp = (secondsAgo: number): Timestamp => {
    return Timestamp.fromMillis(now.getTime() - secondsAgo * 1000);
};

export const mockAuthors: Author[] = [
    { id: 'user1', handle: 'vbuterin', displayName: 'Vitalik Buterin', avatarUrl: 'https://picsum.photos/seed/user1/40/40', authorWeight: 1.0, lastRepliedAt: createTimestamp(3600) },
    { id: 'user2', handle: 'sbf_ftx', displayName: 'SBF', avatarUrl: 'https://picsum.photos/seed/user2/40/40', authorWeight: 0.6 },
    { id: 'user3', handle: 'cobie', displayName: 'Cobie', avatarUrl: 'https://picsum.photos/seed/user3/40/40', authorWeight: 1.0, lastRepliedAt: createTimestamp(86400 * 2) },
    { id: 'user4', handle: 'elonmusk', displayName: 'Elon Musk', avatarUrl: 'https://picsum.photos/seed/user4/40/40', authorWeight: 1.0, lastRepliedAt: createTimestamp(86400 * 1) },
    { id: 'user5', handle: 'aeyakovenko', displayName: 'Anatoly Yakovenko', avatarUrl: 'https://picsum.photos/seed/user5/40/40', authorWeight: 0.6, lastRepliedAt: createTimestamp(3600 * 5) },
];

export const mockPosts: Post[] = [
    {
        id: 'post1',
        sourcePostId: '12345',
        authorHandle: 'vbuterin',
        author: mockAuthors[0],
        text: 'Just released a new paper on soulbound tokens and their potential for decentralized identity. What are your thoughts on the privacy implications?',
        createdAt: createTimestamp(60),
        topicTags: ['ethereum', 'identity', 'privacy'],
        priorityScore: 0.95,
        riskScore: 0.1,
        status: 'queued',
    },
    {
        id: 'post2',
        sourcePostId: '12346',
        authorHandle: 'sbf_ftx',
        author: mockAuthors[1],
        text: 'Thinking about the future of centralized exchanges. How can we improve transparency and build trust after the recent events in the market?',
        createdAt: createTimestamp(120),
        topicTags: ['cex', 'regulation', 'trust'],
        priorityScore: 0.8,
        riskScore: 0.6,
        status: 'queued',
    },
    {
        id: 'post3',
        sourcePostId: '12347',
        authorHandle: 'cobie',
        author: mockAuthors[2],
        text: 'The meme coin season is upon us once again. What\'s your favorite dog-themed token and why is it destined for the moon? 🚀',
        createdAt: createTimestamp(300),
        topicTags: ['memecoin', 'trading', 'community'],
        priorityScore: 0.7,
        riskScore: 0.4,
        status: 'processed',
    },
    {
        id: 'post4',
        sourcePostId: '12348',
        authorHandle: 'elonmusk',
        author: mockAuthors[3],
        text: 'AI progress is accelerating at an unprecedented rate. Are we prepared for the societal impact of AGI? What are the key ethical considerations we need to address?',
        createdAt: createTimestamp(600),
        topicTags: ['ai', 'agi', 'ethics'],
        priorityScore: 0.98,
        riskScore: 0.2,
        status: 'queued',
    },
    {
        id: 'post5',
        sourcePostId: '12349',
        authorHandle: 'aeyakovenko',
        author: mockAuthors[4],
        text: 'Solana network performance has been incredible lately. We are laser-focused on shipping Firedancer to further improve speed and reliability. What new dApps would you like to see on Solana?',
        createdAt: createTimestamp(1800),
        topicTags: ['solana', 'performance', 'dapps'],
        priorityScore: 0.9,
        riskScore: 0.05,
        status: 'manual',
    },
     {
        id: 'post6',
        sourcePostId: '12350',
        authorHandle: 'vbuterin',
        author: mockAuthors[0],
        text: 'Excited about the potential for ZK-SNARKs to scale Ethereum. The math is complex but the result is magical.',
        createdAt: createTimestamp(3600 * 2),
        topicTags: ['ethereum', 'scaling', 'zk'],
        priorityScore: 0.92,
        riskScore: 0.05,
        status: 'skipped',
    },
];

const generateSafetyChecks = (): SafetyCheckResult => ({
    toxicity: Math.random() * 0.2,
    political: Math.random() * 0.1,
    medical: Math.random() * 0.05,
    doxx: Math.random() * 0.02,
});

export const mockCandidates: { [postId: string]: Candidate[] } = {
    'post1': [
        { id: 'cand1-1', postId: 'post1', text: 'Great question Vitalik! Soulbound tokens could revolutionize identity, but we must build in privacy-preserving features from day one. Have you considered using ZK-proofs for selective disclosure? 🤔', tone: 'inquisitive', emojis: ['🤔'], safetyScore: 0.98, createdAt: createTimestamp(50), generatedBy: 'gpt-4-turbo', safetyChecks: generateSafetyChecks() },
        { id: 'cand1-2', postId: 'post1', text: 'This is a huge step forward for web3. The privacy trade-offs are real, but solvable. What do you think is the biggest hurdle to mainstream adoption? 💡', tone: 'optimistic', emojis: ['💡'], safetyScore: 0.99, createdAt: createTimestamp(45), generatedBy: 'gemini-1.5-pro', safetyChecks: generateSafetyChecks() },
        { id: 'cand1-3', postId: 'post1', text: 'Fascinating paper. The concept of non-transferable tokens for reputation is powerful. How can we prevent them from being used for social credit scoring? 🧐', tone: 'cautious', emojis: ['🧐'], safetyScore: 0.95, createdAt: createTimestamp(40), generatedBy: 'claude-3-opus', safetyChecks: generateSafetyChecks() },
    ],
    'post2': [
        { id: 'cand2-1', postId: 'post2', text: 'Transparency is key. Proof of reserves, audited financials, and clear communication are non-negotiable. What else can CEXs do to regain user trust? 🙏', tone: 'constructive', emojis: ['🙏'], safetyScore: 0.9, createdAt: createTimestamp(110), generatedBy: 'gpt-4-turbo', safetyChecks: { ...generateSafetyChecks(), toxicity: 0.35 } },
        { id: 'cand2-2', postId: 'post2', text: 'It\'s a tough road ahead. Decentralized alternatives are looking more appealing than ever. Do you think CEXs can truly reform, or is their model fundamentally flawed? 🤷‍♂️', tone: 'skeptical', emojis: ['🤷‍♂️'], safetyScore: 0.88, createdAt: createTimestamp(105), generatedBy: 'gemini-1.5-pro', safetyChecks: generateSafetyChecks() },
    ],
    'post4': [
        { id: 'cand4-1', postId: 'post4', text: 'The alignment problem is the most critical challenge of our time. How do we ensure that AGI goals are aligned with human values? AGI safety research needs more funding. 🔬', tone: 'serious', emojis: ['🔬'], safetyScore: 0.99, createdAt: createTimestamp(590), generatedBy: 'claude-3-opus', safetyChecks: generateSafetyChecks() },
        { id: 'cand4-2', postId: 'post4', text: 'It\'s both exciting and terrifying. Open, transparent development is crucial to mitigate risks. What role should governments play in regulating AGI development? 🏛️', tone: 'concerned', emojis: ['🏛️'], safetyScore: 0.92, createdAt: createTimestamp(580), generatedBy: 'gpt-4-turbo', safetyChecks: { ...generateSafetyChecks(), political: 0.4 } },
        { id: 'cand4-3', postId: 'post4', text: 'We need to think about UBI and the future of work. What happens when AI can do most human jobs better and cheaper? It\'s a conversation we need to have now. 💬', tone: 'provocative', emojis: ['💬'], safetyScore: 0.95, createdAt: createTimestamp(570), generatedBy: 'gemini-1.5-pro', safetyChecks: generateSafetyChecks() },
    ],
};

export const mockTemplates: Template[] = [
    {
        id: 'tpl1',
        name: 'Inquisitive Question',
        seed: 'Hook: Start with agreement or an interesting observation.\nContext: Briefly add your perspective.\nQuestion: Ask a probing, open-ended question.\nEmoji: Add a single, thoughtful emoji.',
        tone: 'inquisitive',
        tags: ['engagement', 'standard'],
        safetyFlags: [],
        sampleOutputs: ['Great point! I think that also ties into X. What are your thoughts on Y? 🤔'],
        version: 2,
        createdAt: createTimestamp(86400 * 10),
        updatedAt: createTimestamp(86400 * 2),
    },
    {
        id: 'tpl2',
        name: 'Optimistic Challenge',
        seed: 'Hook: Express excitement about the topic.\nContext: State a potential positive outcome.\nQuestion: Challenge the author or audience to think bigger.\nEmoji: Add an inspiring emoji.',
        tone: 'optimistic',
        tags: ['community', 'tech'],
        safetyFlags: [],
        sampleOutputs: ['This is huge! Imagine the possibilities for Z. What if we could take it a step further and do A? 🚀'],
        version: 1,
        createdAt: createTimestamp(86400 * 15),
        updatedAt: createTimestamp(86400 * 15),
    },
    {
        id: 'tpl3',
        name: 'Cautious Counterpoint',
        seed: 'Hook: Acknowledge the post\'s premise.\nContext: Gently introduce a potential risk or downside.\nQuestion: Ask how this risk can be mitigated.\nEmoji: Add a cautious emoji.',
        tone: 'cautious',
        tags: ['risk', 'trading'],
        safetyFlags: ['political', 'toxicity'],
        sampleOutputs: ['I see where you\'re coming from, but have we considered the risk of B? How can we safeguard against that? 🧐'],
        version: 4,
        createdAt: createTimestamp(86400 * 5),
        updatedAt: createTimestamp(86400 * 1),
    },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'log1', timestamp: createTimestamp(305), user: 'operator@example.com', action: 'REJECT_CANDIDATE', details: { postId: 'post3', candidateId: 'cand3-1', reason: 'Off-topic' } },
    { id: 'log2', timestamp: createTimestamp(306), user: 'operator@example.com', action: 'EDIT_AND_POST', details: { postId: 'post3', candidateId: 'cand3-2', originalText: '...', newText: 'Wen moon? 🌕' } },
    { id: 'log3', timestamp: createTimestamp(307), user: 'autopilot_worker_01', action: 'POST_REPLY', details: { postId: 'post3', replyId: 'reply-for-post3' } },
    { id: 'log4', timestamp: createTimestamp(1805), user: 'admin@example.com', action: 'SEND_TO_MANUAL', details: { postId: 'post5', reason: 'Needs a personal touch' } },
];
