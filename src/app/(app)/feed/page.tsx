'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Hash, RefreshCw } from 'lucide-react';
import PostCard from '@/components/feed/PostCard';
import DailyCheckin from '@/components/feed/DailyCheckin';
import CommentSection from '@/components/feed/CommentSection';
import { Skeleton } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { useFeedStore, useUIStore } from '@/lib/store';
import { getPosts, getFollowingPosts, likePost, Post } from '@/lib/firebase';
import { Timestamp } from 'firebase/firestore';

const channels = ['mindset', 'wins', 'accountability', 'questions'];

export default function FeedPage() {
    const { user, profile } = useAuth();
    const searchParams = useSearchParams();
    const channelParam = searchParams.get('channel');

    const {
        posts,
        feedType,
        isLoading,
        hasMore,
        setPosts,
        addPosts,
        updatePost,
        setFeedType,
        setIsLoading,
        setHasMore,
    } = useFeedStore();

    const { openPostModal, setActiveChannel } = useUIStore();

    const [selectedComment, setSelectedComment] = useState<string | null>(null);
    const [lastDoc, setLastDoc] = useState<any>(null);

    // Load posts on mount and when feed type changes
    useEffect(() => {
        loadPosts(true);
    }, [feedType, channelParam]);

    // Update active channel
    useEffect(() => {
        setActiveChannel(channelParam);
    }, [channelParam, setActiveChannel]);

    const loadPosts = async (refresh = false) => {
        if (!user) return;

        setIsLoading(true);

        try {
            let result;

            if (feedType === 'following') {
                result = await getFollowingPosts(
                    user.uid,
                    refresh ? undefined : lastDoc,
                    20
                );
            } else {
                result = await getPosts(
                    refresh ? undefined : lastDoc,
                    20,
                    channelParam || undefined
                );
            }

            const formattedPosts = result.posts.map(p => ({
                ...p,
                createdAt: (p.createdAt as Timestamp)?.toDate?.() || new Date(),
            }));

            if (refresh) {
                setPosts(formattedPosts);
            } else {
                addPosts(formattedPosts);
            }

            setLastDoc(result.lastDoc);
            setHasMore(result.posts.length === 20);

        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefresh = () => {
        setLastDoc(null);
        loadPosts(true);
    };

    const handleLike = async (postId: string) => {
        if (!user) return;

        try {
            const isNowLiked = await likePost(postId, user.uid);
            updatePost(postId, {
                isLiked: isNowLiked,
                likeCount: posts.find(p => p.id === postId)?.likeCount! + (isNowLiked ? 1 : -1),
            });
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollHeight - scrollTop <= clientHeight * 1.5 && !isLoading && hasMore) {
            loadPosts(false);
        }
    }, [isLoading, hasMore]);

    return (
        <div className="min-h-screen" onScroll={handleScroll}>
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-2xl mx-auto px-4">
                    {/* Feed Type Tabs */}
                    <div className="flex items-center gap-1 pt-4">
                        <button
                            onClick={() => setFeedType('foryou')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${feedType === 'foryou'
                                    ? 'bg-accent-primary/10 text-accent-primary'
                                    : 'text-foreground-muted hover:text-foreground'
                                }`}
                        >
                            <TrendingUp size={16} />
                            For You
                        </button>
                        <button
                            onClick={() => setFeedType('following')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${feedType === 'following'
                                    ? 'bg-accent-primary/10 text-accent-primary'
                                    : 'text-foreground-muted hover:text-foreground'
                                }`}
                        >
                            <Users size={16} />
                            Following
                        </button>
                        <div className="flex-1" />
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading}
                            className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                    </div>

                    {/* Channel Filters */}
                    <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
                        <a
                            href="/feed"
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${!channelParam
                                    ? 'bg-foreground text-background'
                                    : 'bg-background-hover text-foreground-muted hover:text-foreground'
                                }`}
                        >
                            All
                        </a>
                        {channels.map((channel) => (
                            <a
                                key={channel}
                                href={`/feed?channel=${channel}`}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors ${channelParam === channel
                                        ? 'bg-foreground text-background'
                                        : 'bg-background-hover text-foreground-muted hover:text-foreground'
                                    }`}
                            >
                                <Hash size={12} />
                                {channel}
                            </a>
                        ))}
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Daily Check-in */}
                {!channelParam && (
                    <div className="mb-6">
                        <DailyCheckin />
                    </div>
                )}

                {/* Posts */}
                <div className="space-y-4">
                    {isLoading && posts.length === 0 ? (
                        // Loading skeletons
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-6 bg-background-elevated border border-border rounded-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <Skeleton className="w-10 h-10 rounded-full" />
                                    <div>
                                        <Skeleton className="w-24 h-4 mb-2" />
                                        <Skeleton className="w-16 h-3" />
                                    </div>
                                </div>
                                <Skeleton className="w-full h-20 mb-4" />
                                <div className="flex gap-4">
                                    <Skeleton className="w-12 h-6" />
                                    <Skeleton className="w-12 h-6" />
                                </div>
                            </div>
                        ))
                    ) : posts.length === 0 ? (
                        // Empty state
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-16"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-hover flex items-center justify-center">
                                <Users size={24} className="text-foreground-muted" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                {feedType === 'following' ? 'No posts from people you follow' : 'No posts yet'}
                            </h3>
                            <p className="text-foreground-muted mb-6">
                                {feedType === 'following'
                                    ? 'Follow some people to see their posts here'
                                    : 'Be the first to share something with the community'
                                }
                            </p>
                            <button
                                onClick={() => openPostModal()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary-hover transition-colors"
                            >
                                Share something
                            </button>
                        </motion.div>
                    ) : (
                        // Posts list
                        posts.map((post) => (
                            <PostCard
                                key={post.id}
                                {...post}
                                createdAt={post.createdAt instanceof Date ? post.createdAt : new Date()}
                                onLike={handleLike}
                                onComment={(id) => setSelectedComment(id)}
                                currentUserId={user?.uid}
                            />
                        ))
                    )}

                    {/* Load more indicator */}
                    {isLoading && posts.length > 0 && (
                        <div className="py-8 text-center">
                            <div className="inline-flex items-center gap-2 text-foreground-muted">
                                <RefreshCw size={16} className="animate-spin" />
                                Loading more...
                            </div>
                        </div>
                    )}

                    {/* End of feed */}
                    {!hasMore && posts.length > 0 && (
                        <div className="py-8 text-center text-foreground-subtle text-sm">
                            You've reached the end. Time to post something?
                        </div>
                    )}
                </div>
            </div>

            {/* Comments Panel */}
            <CommentSection
                postId={selectedComment || ''}
                isOpen={!!selectedComment}
                onClose={() => setSelectedComment(null)}
            />
        </div>
    );
}
