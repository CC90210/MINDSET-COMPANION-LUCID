import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LucidScores, MindsetArchetype } from '@/lib/assessment';

// ===== UI STORE =====
interface UIState {
    theme: 'dark' | 'light';
    mobileNavOpen: boolean;
    postModalOpen: boolean;
    activeChannel: string | null;

    setTheme: (theme: 'dark' | 'light') => void;
    toggleMobileNav: () => void;
    openPostModal: () => void;
    closePostModal: () => void;
    setActiveChannel: (channel: string | null) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            theme: 'dark',
            mobileNavOpen: false,
            postModalOpen: false,
            activeChannel: null,

            setTheme: (theme) => set({ theme }),
            toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
            openPostModal: () => set({ postModalOpen: true }),
            closePostModal: () => set({ postModalOpen: false }),
            setActiveChannel: (channel) => set({ activeChannel: channel }),
        }),
        {
            name: 'lucid-ui',
            partialize: (state) => ({ theme: state.theme }),
        }
    )
);

// ===== ASSESSMENT STORE =====
interface AssessmentState {
    currentAnswers: number[];
    isComplete: boolean;
    result: {
        scores: LucidScores;
        archetype: MindsetArchetype;
    } | null;

    setAnswer: (questionIndex: number, answerIndex: number) => void;
    setResult: (result: { scores: LucidScores; archetype: MindsetArchetype }) => void;
    resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
    persist(
        (set) => ({
            currentAnswers: [],
            isComplete: false,
            result: null,

            setAnswer: (questionIndex, answerIndex) =>
                set((state) => {
                    const newAnswers = [...state.currentAnswers];
                    newAnswers[questionIndex] = answerIndex;
                    return { currentAnswers: newAnswers };
                }),

            setResult: (result) => set({ result, isComplete: true }),

            resetAssessment: () => set({ currentAnswers: [], isComplete: false, result: null }),
        }),
        {
            name: 'lucid-assessment',
        }
    )
);

// ===== CHAT STORE =====
interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatState {
    currentConversationId: string | null;
    messages: ChatMessage[];
    isLoading: boolean;
    isTyping: boolean;
    deepDiveMode: boolean;
    conversationHistory: { role: 'user' | 'assistant'; content: string }[];

    setCurrentConversation: (id: string | null) => void;
    setMessages: (messages: ChatMessage[]) => void;
    addMessage: (message: ChatMessage) => void;
    setIsLoading: (loading: boolean) => void;
    setIsTyping: (typing: boolean) => void;
    toggleDeepDive: () => void;
    clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    currentConversationId: null,
    messages: [],
    isLoading: false,
    isTyping: false,
    deepDiveMode: false,
    conversationHistory: [],

    setCurrentConversation: (id) => set({ currentConversationId: id }),

    setMessages: (messages) => set({
        messages,
        conversationHistory: messages.map(m => ({ role: m.role, content: m.content })),
    }),

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
        conversationHistory: [...state.conversationHistory, { role: message.role, content: message.content }],
    })),

    setIsLoading: (loading) => set({ isLoading: loading }),
    setIsTyping: (typing) => set({ isTyping: typing }),
    toggleDeepDive: () => set((state) => ({ deepDiveMode: !state.deepDiveMode })),
    clearChat: () => set({ messages: [], conversationHistory: [], currentConversationId: null }),
}));

// ===== FEED STORE =====
interface FeedPost {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    authorLevel?: number;
    content: string;
    imageUrl?: string;
    channel?: string;
    isAnonymous: boolean;
    createdAt: Date;
    likeCount: number;
    commentCount: number;
    isLiked?: boolean;
}

interface FeedState {
    posts: FeedPost[];
    feedType: 'foryou' | 'following';
    isLoading: boolean;
    hasMore: boolean;

    setPosts: (posts: FeedPost[]) => void;
    addPosts: (posts: FeedPost[]) => void;
    updatePost: (id: string, data: Partial<FeedPost>) => void;
    setFeedType: (type: 'foryou' | 'following') => void;
    setIsLoading: (loading: boolean) => void;
    setHasMore: (hasMore: boolean) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
    posts: [],
    feedType: 'foryou',
    isLoading: false,
    hasMore: true,

    setPosts: (posts) => set({ posts }),
    addPosts: (posts) => set((state) => ({
        posts: [...state.posts, ...posts.filter(p => !state.posts.some(ep => ep.id === p.id))]
    })),
    updatePost: (id, data) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, ...data } : p),
    })),
    setFeedType: (type) => set({ feedType: type, posts: [], hasMore: true }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setHasMore: (hasMore) => set({ hasMore }),
}));

// ===== GAMIFICATION STORE =====
interface GamificationState {
    xp: number;
    level: number;
    streak: number;
    dailyXpEarned: number;
    lastXpDate: string | null;
    achievements: string[];

    addXP: (amount: number) => void;
    setLevel: (level: number) => void;
    setStreak: (streak: number) => void;
    unlockAchievement: (achievementId: string) => void;
    resetDailyXP: () => void;
}

export const useGamificationStore = create<GamificationState>()(
    persist(
        (set, get) => ({
            xp: 0,
            level: 1,
            streak: 0,
            dailyXpEarned: 0,
            lastXpDate: null,
            achievements: [],

            addXP: (amount) => {
                const today = new Date().toISOString().split('T')[0];
                const state = get();

                // Reset daily XP if new day
                const dailyXp = state.lastXpDate === today
                    ? state.dailyXpEarned + amount
                    : amount;

                set({
                    xp: state.xp + amount,
                    dailyXpEarned: dailyXp,
                    lastXpDate: today,
                });
            },

            setLevel: (level) => set({ level }),
            setStreak: (streak) => set({ streak }),

            unlockAchievement: (achievementId) => set((state) => ({
                achievements: state.achievements.includes(achievementId)
                    ? state.achievements
                    : [...state.achievements, achievementId],
            })),

            resetDailyXP: () => set({ dailyXpEarned: 0 }),
        }),
        {
            name: 'lucid-gamification',
        }
    )
);

// ===== NOTIFICATION STORE =====
interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'dm' | 'achievement' | 'system';
    title: string;
    message: string;
    createdAt: Date;
    read: boolean;
    data?: Record<string, any>;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;

    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,

    addNotification: (notification) => {
        const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            read: false,
        };

        set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        }));
    },

    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
    })),

    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
    })),

    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

// ===== SUBSCRIPTION STORE =====
interface SubscriptionState {
    tier: 'free' | 'premium';
    messagesRemaining: number;
    stripeCustomerId: string | null;

    setTier: (tier: 'free' | 'premium') => void;
    setMessagesRemaining: (count: number) => void;
    decrementMessages: () => void;
    resetDailyMessages: () => void;
    setStripeCustomerId: (id: string | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
    tier: 'free',
    messagesRemaining: 5,
    stripeCustomerId: null,

    setTier: (tier) => set({ tier }),
    setMessagesRemaining: (count) => set({ messagesRemaining: count }),
    decrementMessages: () => set((state) => ({
        messagesRemaining: state.tier === 'premium'
            ? Infinity
            : Math.max(0, state.messagesRemaining - 1),
    })),
    resetDailyMessages: () => set((state) => ({
        messagesRemaining: state.tier === 'premium' ? Infinity : 5,
    })),
    setStripeCustomerId: (id) => set({ stripeCustomerId: id }),
}));
