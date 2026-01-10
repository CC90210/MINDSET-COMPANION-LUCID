'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, User as UserIcon, Hash } from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { getLevelFromXP } from '@/lib/gamification';

interface PostCardProps {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar?: string;
    authorLevel?: number;
    authorXp?: number;
    content: string;
    imageUrl?: string;
    channel?: string;
    isAnonymous: boolean;
    createdAt: Date;
    likeCount: number;
    commentCount: number;
    isLiked?: boolean;
    currentUserId?: string;
    onLike?: (id: string) => void;
    onComment?: (id: string) => void;
    onShare?: (id: string) => void;
}

export default function PostCard({
    id,
    authorId,
    authorName,
    authorAvatar,
    authorLevel,
    authorXp,
    content,
    imageUrl,
    channel,
    isAnonymous,
    createdAt,
    likeCount,
    commentCount,
    isLiked = false,
    currentUserId,
    onLike,
    onComment,
    onShare,
}: PostCardProps) {
    const [liked, setLiked] = useState(isLiked);
    const [likes, setLikes] = useState(likeCount);
    const [isAnimating, setIsAnimating] = useState(false);

    const levelInfo = authorXp !== undefined ? getLevelFromXP(authorXp) :
        authorLevel ? { level: authorLevel, name: '' } : null;

    const handleLike = () => {
        setIsAnimating(true);
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
        onLike?.(id);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                text: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
                url: `https://getlucid.app/post/${id}`,
            });
        } catch {
            // Fallback: copy link
            navigator.clipboard.writeText(`https://getlucid.app/post/${id}`);
        }
        onShare?.(id);
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="post-card"
        >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                {isAnonymous ? (
                    <div className="w-10 h-10 rounded-full bg-background-tertiary flex items-center justify-center">
                        <UserIcon size={20} className="text-foreground-tertiary" />
                    </div>
                ) : (
                    <Avatar src={authorAvatar} size="md" />
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                            {isAnonymous ? 'Anonymous' : authorName}
                        </span>

                        {levelInfo && !isAnonymous && (
                            <span className="level-badge text-xs">
                                {levelInfo.level}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-foreground-tertiary">
                        <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>

                        {channel && (
                            <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Hash size={12} />
                                    {channel}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <button className="p-1.5 rounded-lg text-foreground-tertiary hover:text-foreground hover:bg-background-tertiary transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>

            {/* Content */}
            <p className="text-foreground whitespace-pre-wrap leading-relaxed mb-4">
                {content}
            </p>

            {/* Image */}
            {imageUrl && (
                <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                        src={imageUrl}
                        alt="Post image"
                        className="w-full object-cover max-h-96"
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-6 pt-3 border-t border-border">
                <motion.button
                    onClick={handleLike}
                    animate={isAnimating ? { scale: [1, 1.3, 1] } : {}}
                    className={`flex items-center gap-2 text-sm transition-colors ${liked
                            ? 'text-error'
                            : 'text-foreground-tertiary hover:text-error'
                        }`}
                >
                    <Heart size={18} className={liked ? 'fill-current' : ''} />
                    <span>{likes > 0 ? likes : ''}</span>
                </motion.button>

                <button
                    onClick={() => onComment?.(id)}
                    className="flex items-center gap-2 text-sm text-foreground-tertiary hover:text-accent-primary transition-colors"
                >
                    <MessageCircle size={18} />
                    <span>{commentCount > 0 ? commentCount : ''}</span>
                </button>

                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-sm text-foreground-tertiary hover:text-foreground transition-colors"
                >
                    <Share2 size={18} />
                </button>
            </div>
        </motion.article>
    );
}
