
export const MOCK_LUCID_SCORE = {
    overall: 67,
    selfAwareness: 78,
    resilience: 54,
    growthOrientation: 71,
    emotionalRegulation: 42,
    innerDialogue: 61,
    archetype: 'The Overthinker',
    archetypeDescription: "You see everything clearly — except the exit from your own head.",
};

export const MOCK_USER_PROFILE = {
    uid: 'mock-user-123',
    name: 'Demo User',
    displayName: 'Demo',
    email: 'demo@lucid.app',
    bio: 'Working on becoming someone I\'d be proud to know.',
    avatarUrl: null,
    streak: 12,
    xp: 1240,
    level: 4,
    subscriptionTier: 'free' as const,
    createdAt: new Date().toISOString(),
    lucidScores: MOCK_LUCID_SCORE, // Note: Changed to match interface (plural)
    archetype: 'The Overthinker', // Added to match interface
};

export const MOCK_POSTS = [
    {
        id: '1',
        authorId: 'user-1',
        authorName: 'Marcus',
        authorAvatar: null,
        level: 5,
        content: "Day 47 of showing up. Some days I don't feel like it. Today was one of them. Did it anyway.",
        createdAt: { seconds: Date.now() / 1000 - 2 * 60 * 60, nanoseconds: 0 }, // Timestamp-like
        likeCount: 42,
        commentCount: 8,
        isLiked: false,
    },
    {
        id: '2',
        authorId: 'anonymous',
        authorName: 'Anonymous',
        authorAvatar: null,
        level: 0,
        content: "Anyone else feel like they're performing their life instead of living it?",
        channel: 'struggles',
        createdAt: { seconds: Date.now() / 1000 - 5 * 60 * 60, nanoseconds: 0 },
        likeCount: 89,
        commentCount: 23,
        isLiked: true,
    },
    {
        id: '3',
        authorId: 'cc',
        authorName: 'CC',
        authorAvatar: null,
        level: 10,
        isPinned: true,
        content: "This week's challenge: No complaining.\n\nNot because positivity is magic. Because complaining is a habit that trains you to see problems, not paths.",
        createdAt: { seconds: Date.now() / 1000 - 24 * 60 * 60, nanoseconds: 0 },
        likeCount: 312,
        commentCount: 67,
        isLiked: false,
    },
];

export const MOCK_CHAT_MESSAGES = [
    {
        id: '1',
        role: 'assistant' as const,
        content: "What's on your mind?",
        timestamp: { seconds: Date.now() / 1000 - 60, nanoseconds: 0 },
    },
];

export const MOCK_WEEKLY_CHALLENGE = {
    id: '1',
    title: 'No complaining for 7 days',
    description: 'Notice when you want to complain. Pause. Reframe or stay silent.',
    currentDay: 3,
    totalDays: 7,
    participantCount: 847,
};
