// ===== LUCID GAMIFICATION SYSTEM =====
// XP, Levels, Streaks, Challenges, Achievements

// XP rewards for actions
export const XP_REWARDS = {
    COMPLETE_ASSESSMENT: 100,
    DAILY_CHECKIN: 20,
    AI_CONVERSATION: 10, // per exchange, max 50/day
    COMMUNITY_POST: 15,
    COMMENT: 5,
    RECEIVE_LIKE: 2,
    WEEKLY_CHALLENGE: 100,
    ASSESSMENT_IMPROVEMENT: 50, // per point gained
    FIRST_POST: 50,
    FIRST_CONVERSATION: 25,
    PROFILE_COMPLETE: 30,
} as const;

// Daily XP caps
export const DAILY_XP_CAPS = {
    AI_CONVERSATION: 50,
    RECEIVE_LIKE: 20,
} as const;

// Level thresholds and names
export const LEVELS: readonly { level: number; xpRequired: number; name: string }[] = [
    { level: 1, xpRequired: 0, name: 'Awakening' },
    { level: 2, xpRequired: 200, name: 'Aware' },
    { level: 3, xpRequired: 500, name: 'Rising' },
    { level: 4, xpRequired: 1000, name: 'Focused' },
    { level: 5, xpRequired: 2000, name: 'Disciplined' },
    { level: 6, xpRequired: 4000, name: 'Integrated' },
    { level: 7, xpRequired: 7500, name: 'Elevated' },
    { level: 8, xpRequired: 12000, name: 'Mastering' },
    { level: 9, xpRequired: 20000, name: 'Transcendent' },
    { level: 10, xpRequired: 35000, name: 'Unlocked' },
];

// Streak milestones
export const STREAK_MILESTONES: readonly number[] = [7, 30, 90, 365];

// Get level from XP
export function getLevelFromXP(xp: number): {
    level: number;
    name: string;
    currentXP: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    progress: number;
} {
    let currentLevel = LEVELS[0];
    let nextLevel = LEVELS[1];

    for (let i = 0; i < LEVELS.length; i++) {
        if (xp >= LEVELS[i].xpRequired) {
            currentLevel = LEVELS[i];
            nextLevel = LEVELS[i + 1] || LEVELS[i];
        } else {
            break;
        }
    }

    const xpForCurrentLevel = currentLevel.xpRequired;
    const xpForNextLevel = nextLevel.xpRequired;
    const xpInLevel = xp - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    const progress = xpNeededForLevel > 0 ? (xpInLevel / xpNeededForLevel) * 100 : 100;

    return {
        level: currentLevel.level,
        name: currentLevel.name,
        currentXP: xp,
        xpForCurrentLevel,
        xpForNextLevel,
        progress: Math.min(100, Math.max(0, progress)),
    };
}

// Get streak badge info
export function getStreakBadge(streak: number): {
    milestone: number | null;
    nextMilestone: number | null;
    emoji: string;
} {
    let milestone: number | null = null;
    let nextMilestone: number | null = STREAK_MILESTONES[0];

    for (const m of STREAK_MILESTONES) {
        if (streak >= m) {
            milestone = m;
            const index = STREAK_MILESTONES.indexOf(m);
            nextMilestone = STREAK_MILESTONES[index + 1] || null;
        } else {
            break;
        }
    }

    let emoji = '🔥';
    if (streak >= 365) emoji = '👑';
    else if (streak >= 90) emoji = '💎';
    else if (streak >= 30) emoji = '⚡';
    else if (streak >= 7) emoji = '🔥';

    return { milestone, nextMilestone, emoji };
}

// Weekly challenges
export interface WeeklyChallenge {
    id: string;
    title: string;
    description: string;
    duration: number; // days
    xpReward: number;
    participants?: number;
}

export const SAMPLE_CHALLENGES: WeeklyChallenge[] = [
    {
        id: 'no-complaining',
        title: 'No Complaining',
        description: 'For 7 days, catch yourself before complaining. Not because positivity is magic — because complaining trains you to see problems, not paths.',
        duration: 7,
        xpReward: 100,
    },
    {
        id: 'morning-silence',
        title: '10 Minutes of Silence',
        description: 'Every morning, 10 minutes of silence before your phone. No music. No podcasts. Just you and your thoughts.',
        duration: 7,
        xpReward: 100,
    },
    {
        id: 'uncomfortable-conversation',
        title: 'The Hard Conversation',
        description: 'Have one conversation this week you\'ve been avoiding. The one that makes your stomach turn a little.',
        duration: 7,
        xpReward: 100,
    },
    {
        id: 'daily-gratitude',
        title: 'Gratitude Log',
        description: 'Write down 3 things you\'re grateful for each night. Specific ones. Not "family" — but "the way mom called just to check in."',
        duration: 7,
        xpReward: 100,
    },
    {
        id: 'no-excuses',
        title: 'No Excuses Week',
        description: 'Every time you catch yourself making an excuse, replace it with "I chose not to." See how that feels.',
        duration: 7,
        xpReward: 100,
    },
];

// Achievements
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    xpReward: number;
    condition: (stats: UserStats) => boolean;
}

export interface UserStats {
    totalXP: number;
    level: number;
    streak: number;
    postsCount: number;
    conversationsCount: number;
    assessmentsTaken: number;
    lucidScore: number;
    lucidScoreImprovement: number;
    challengesCompleted: number;
    daysActive: number;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first-steps',
        name: 'First Steps',
        description: 'Complete your first assessment',
        icon: '🎯',
        xpReward: 50,
        condition: (stats) => stats.assessmentsTaken >= 1,
    },
    {
        id: 'voice-found',
        name: 'Voice Found',
        description: 'Have your first conversation with CC',
        icon: '💬',
        xpReward: 25,
        condition: (stats) => stats.conversationsCount >= 1,
    },
    {
        id: 'showing-up',
        name: 'Showing Up',
        description: 'Reach a 7-day streak',
        icon: '🔥',
        xpReward: 100,
        condition: (stats) => stats.streak >= 7,
    },
    {
        id: 'consistent',
        name: 'Consistent',
        description: 'Reach a 30-day streak',
        icon: '⚡',
        xpReward: 250,
        condition: (stats) => stats.streak >= 30,
    },
    {
        id: 'unbreakable',
        name: 'Unbreakable',
        description: 'Reach a 90-day streak',
        icon: '💎',
        xpReward: 500,
        condition: (stats) => stats.streak >= 90,
    },
    {
        id: 'community-voice',
        name: 'Community Voice',
        description: 'Create your first post',
        icon: '📝',
        xpReward: 50,
        condition: (stats) => stats.postsCount >= 1,
    },
    {
        id: 'level-5',
        name: 'Disciplined',
        description: 'Reach Level 5',
        icon: '🏆',
        xpReward: 200,
        condition: (stats) => stats.level >= 5,
    },
    {
        id: 'level-10',
        name: 'Unlocked',
        description: 'Reach Level 10 — the highest level',
        icon: '👑',
        xpReward: 1000,
        condition: (stats) => stats.level >= 10,
    },
    {
        id: 'growth',
        name: 'Growth',
        description: 'Improve your Lucid Score by 10 points',
        icon: '📈',
        xpReward: 150,
        condition: (stats) => stats.lucidScoreImprovement >= 10,
    },
    {
        id: 'challenger',
        name: 'Challenger',
        description: 'Complete 5 weekly challenges',
        icon: '🎯',
        xpReward: 200,
        condition: (stats) => stats.challengesCompleted >= 5,
    },
];

// Check for newly unlocked achievements
export function checkNewAchievements(
    stats: UserStats,
    unlockedAchievementIds: string[]
): Achievement[] {
    return ACHIEVEMENTS.filter(
        (achievement) =>
            !unlockedAchievementIds.includes(achievement.id) &&
            achievement.condition(stats)
    );
}

// Calculate XP for score improvement
export function calculateScoreImprovementXP(oldScore: number, newScore: number): number {
    const improvement = Math.max(0, newScore - oldScore);
    return improvement * XP_REWARDS.ASSESSMENT_IMPROVEMENT;
}

// Format XP for display
export function formatXP(xp: number): string {
    if (xp >= 10000) {
        return `${(xp / 1000).toFixed(1)}k`;
    }
    return xp.toLocaleString();
}

// Get level color
export function getLevelColor(level: number): string {
    if (level >= 10) return '#F59E0B'; // Gold
    if (level >= 7) return '#8B5CF6'; // Purple
    if (level >= 4) return '#6366F1'; // Indigo
    return '#A0A0A0'; // Gray
}
