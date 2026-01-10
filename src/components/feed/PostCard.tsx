'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, Flag, EyeOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';

interface PostCardProps {
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
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
    currentUserId?: string;
}

export default function PostCard({
    id,
    authorId,
    authorName,
    authorAvatar,
    content,
    imageUrl,
    channel,
    isAnonymous,
    createdAt,
    likeCount,
    commentCount,
    isLiked = false,
    onLike,
    onComment,
    currentUserId,
}: PostCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [liked, setLiked] = useState(isLiked);
    const [likes, setLikes] = useState(likeCount);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
        onLike(id);
    };

    const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="post-card"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {isAnonymous ? (
                        <div className="w-10 h-10 rounded-full bg-background-hover flex items-center justify-center">
                            <EyeOff size={18} className="text-foreground-subtle" />
                        </div>
                    ) : (
                        <Link href={`/profile/${authorId}`}>
                            <Avatar src={authorAvatar} size="md" />
                        </Link>
                    )}

                    <div>
                        <Link
                            href={isAnonymous ? '#' : `/profile/${authorId}`}
                            className={`font-medium ${isAnonymous ? 'text-foreground-muted cursor-default' : 'text-foreground hover:underline'}`}
                        >
                            {isAnonymous ? 'Anonymous' : authorName}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                            <span>{timeAgo}</span>
                            {channel && (
                                <>
                                    <span>•</span>
                                    <Link
                                        href={`/feed?channel=${channel}`}
                                        className="text-accent-primary hover:underline"
                                    >
                                        #{channel}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 rounded-lg text-foreground-subtle hover:text-foreground hover:bg-background-hover transition-colors"
                    >
                        <MoreHorizontal size={18} />
                    </button>

                    {showMenu && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute right-0 top-full mt-1 w-48 bg-background-elevated border border-border rounded-xl shadow-lg overflow-hidden z-10"
                        >
                            <button
                                onClick={() => {
                                    // TODO: Report functionality
                                    setShowMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                            >
                                <Flag size={16} />
                                Report post
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="mb-4">
                <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
                    {content}
                </p>
            </div>

            {/* Image */}
            {imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                        src={imageUrl}
                        alt="Post attachment"
                        className="w-full h-auto max-h-96 object-cover"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-3 border-t border-border">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${liked ? 'text-error' : 'text-foreground-muted hover:text-error'
                        }`}
                >
                    <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                    <span className="text-sm">{likes > 0 ? likes : ''}</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onComment(id)}
                    className="flex items-center gap-2 text-foreground-muted hover:text-accent-secondary transition-colors"
                >
                    <MessageCircle size={20} />
                    <span className="text-sm">{commentCount > 0 ? commentCount : ''}</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        navigator.share?.({
                            title: `Post by ${isAnonymous ? 'Anonymous' : authorName}`,
                            text: content.slice(0, 100),
                            url: window.location.origin + `/post/${id}`,
                        }).catch(() => { });
                    }}
                    className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors"
                >
                    <Share2 size={20} />
                </motion.button>
            </div>
        </motion.article>
    );
}
