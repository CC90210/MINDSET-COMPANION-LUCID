import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ========== UI STORE ==========
interface UIState {
    theme: 'dark' | 'light';
    isMobileNavOpen: boolean;
    isPostModalOpen: boolean;
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
            isMobileNavOpen: false,
            isPostModalOpen: false,
            activeChannel: null,
            setTheme: (theme) => set({ theme }),
            toggleMobileNav: () => set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
            openPostModal: () => set({ isPostModalOpen: true }),
            closePostModal: () => set({ isPostModalOpen: false }),
            setActiveChannel: (channel) => set({ activeChannel: channel }),
        }),
        {
            name: 'cc-ui-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ theme: state.theme }),
        }
    )
);

// ========== CHAT STORE ==========
interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatState {
    currentConversationId: string | null;
    messages: ChatMessage[];
    isLoading: boolean;
    isTyping: boolean;
    deepDiveEnabled: boolean;
    setCurrentConversation: (id: string | null) => void;
    setMessages: (messages: ChatMessage[]) => void;
    addMessage: (message: ChatMessage) => void;
    setIsLoading: (loading: boolean) => void;
    setIsTyping: (typing: boolean) => void;
    toggleDeepDive: () => void;
    clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
    currentConversationId: null,
    messages: [],
    isLoading: false,
    isTyping: false,
    deepDiveEnabled: false,
    setCurrentConversation: (id) => set({ currentConversationId: id }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setIsTyping: (typing) => set({ isTyping: typing }),
    toggleDeepDive: () => set((state) => ({ deepDiveEnabled: !state.deepDiveEnabled })),
    clearMessages: () => set({ messages: [], currentConversationId: null }),
}));

// ========== FEED STORE ==========
interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
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
    posts: Post[];
    feedType: 'foryou' | 'following';
    isLoading: boolean;
    hasMore: boolean;
    setPosts: (posts: Post[]) => void;
    addPosts: (posts: Post[]) => void;
    updatePost: (id: string, updates: Partial<Post>) => void;
    setFeedType: (type: 'foryou' | 'following') => void;
    setIsLoading: (loading: boolean) => void;
    setHasMore: (hasMore: boolean) => void;
    prependPost: (post: Post) => void;
}

export const useFeedStore = create<FeedState>((set) => ({
    posts: [],
    feedType: 'foryou',
    isLoading: false,
    hasMore: true,
    setPosts: (posts) => set({ posts }),
    addPosts: (posts) => set((state) => ({
        posts: [...state.posts, ...posts.filter(p => !state.posts.find(existing => existing.id === p.id))]
    })),
    updatePost: (id, updates) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, ...updates } : p)
    })),
    setFeedType: (type) => set({ feedType: type, posts: [], hasMore: true }),
    setIsLoading: (loading) => set({ isLoading: loading }),
    setHasMore: (hasMore) => set({ hasMore }),
    prependPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
}));

// ========== NOTIFICATION STORE ==========
interface Notification {
    id: string;
    type: 'like' | 'comment' | 'follow' | 'dm' | 'system';
    title: string;
    message: string;
    read: boolean;
    createdAt: Date;
    actionUrl?: string;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    unreadCount: 0,
    addNotification: (notification) => set((state) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            createdAt: new Date(),
            read: false,
        };
        return {
            notifications: [newNotification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
        };
    }),
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1),
    })),
    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
    })),
    clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

// ========== SUBSCRIPTION STORE ==========
interface SubscriptionState {
    tier: 'free' | 'premium';
    messagesRemaining: number;
    stripeCustomerId: string | null;
    setTier: (tier: 'free' | 'premium') => void;
    setMessagesRemaining: (count: number) => void;
    decrementMessages: () => void;
    setStripeCustomerId: (id: string | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
    tier: 'free',
    messagesRemaining: 5,
    stripeCustomerId: null,
    setTier: (tier) => set({ tier, messagesRemaining: tier === 'premium' ? Infinity : 5 }),
    setMessagesRemaining: (count) => set({ messagesRemaining: count }),
    decrementMessages: () => set((state) => ({
        messagesRemaining: Math.max(0, state.messagesRemaining - 1)
    })),
    setStripeCustomerId: (id) => set({ stripeCustomerId: id }),
}));
