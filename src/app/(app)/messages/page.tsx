'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageCircle, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/ui/Avatar';
import Input from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { getDMConversations, DMConversation, getUserProfile } from '@/lib/firebase';
import Link from 'next/link';

interface EnrichedConversation extends DMConversation {
    otherUser?: {
        id: string;
        name: string;
        avatar?: string;
    };
}

export default function MessagesPage() {
    const { user, profile } = useAuth();
    const [conversations, setConversations] = useState<EnrichedConversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            loadConversations();
        }
    }, [user]);

    const loadConversations = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const convos = await getDMConversations(user.uid);

            // Enrich with other user info
            const enriched = await Promise.all(
                convos.map(async (convo) => {
                    const otherUserId = convo.participants.find(p => p !== user.uid);
                    if (otherUserId) {
                        const otherProfile = await getUserProfile(otherUserId);
                        return {
                            ...convo,
                            otherUser: otherProfile ? {
                                id: otherUserId,
                                name: otherProfile.displayName || otherProfile.name,
                                avatar: otherProfile.avatarUrl,
                            } : undefined,
                        };
                    }
                    return convo;
                })
            );

            setConversations(enriched);
        } catch (error) {
            console.error('Error loading conversations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredConversations = conversations.filter(
        (c) => c.otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Check if premium
    const isPremium = profile?.subscriptionTier === 'premium';

    if (!isPremium) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent-primary/10 flex items-center justify-center">
                        <MessageCircle size={28} className="text-accent-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                        Direct Messages
                    </h2>
                    <p className="text-foreground-muted mb-6">
                        DMs are a Premium feature. Upgrade to connect directly with others in the community.
                    </p>
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-xl hover:bg-accent-primary-hover transition-colors"
                    >
                        Upgrade to Premium
                        <ChevronRight size={18} />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <h1 className="text-xl font-semibold text-foreground mb-4">Messages</h1>
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        leftIcon={<Search size={18} />}
                    />
                </div>
            </header>

            <div className="max-w-2xl mx-auto">
                {isLoading ? (
                    <div className="p-4 space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-4 animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-background-hover" />
                                <div className="flex-1">
                                    <div className="w-24 h-4 bg-background-hover rounded mb-2" />
                                    <div className="w-48 h-3 bg-background-hover rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredConversations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-hover flex items-center justify-center">
                            <MessageCircle size={24} className="text-foreground-muted" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            No conversations yet
                        </h3>
                        <p className="text-foreground-muted">
                            Visit someone's profile to start a conversation
                        </p>
                    </motion.div>
                ) : (
                    <div className="divide-y divide-border">
                        {filteredConversations.map((convo) => (
                            <Link
                                key={convo.id}
                                href={`/messages/${convo.id}`}
                                className="flex items-center gap-3 p-4 hover:bg-background-hover transition-colors"
                            >
                                <Avatar src={convo.otherUser?.avatar} size="lg" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-foreground truncate">
                                            {convo.otherUser?.name || 'Unknown User'}
                                        </span>
                                        <span className="text-xs text-foreground-subtle">
                                            {convo.lastMessageAt && (
                                                formatDistanceToNow(
                                                    (convo.lastMessageAt as any).toDate ? (convo.lastMessageAt as any).toDate() :
                                                        (convo.lastMessageAt as any).seconds ? new Date((convo.lastMessageAt as any).seconds * 1000) :
                                                            new Date(),
                                                    { addSuffix: true }
                                                )
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground-muted truncate">
                                        {convo.lastMessage || 'No messages yet'}
                                    </p>
                                </div>
                                <ChevronRight size={18} className="text-foreground-subtle" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
