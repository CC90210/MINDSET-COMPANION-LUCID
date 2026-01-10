'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/Loading';
import { useAuth } from '@/contexts/AuthContext';
import { getComments, addComment, Comment } from '@/lib/firebase';

interface CommentSectionProps {
    postId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function CommentSection({ postId, isOpen, onClose }: CommentSectionProps) {
    const { user, profile } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && postId) {
            loadComments();
        }
    }, [isOpen, postId]);

    const loadComments = async () => {
        setIsLoading(true);
        try {
            const fetchedComments = await getComments(postId);
            setComments(fetchedComments);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!newComment.trim() || !user || !profile) return;

        setIsSubmitting(true);
        try {
            const commentId = await addComment(postId, {
                authorId: user.uid,
                authorName: profile.displayName || profile.name,
                authorAvatar: profile.avatarUrl,
                content: newComment.trim(),
            });

            // Add to local state
            setComments([
                ...comments,
                {
                    id: commentId,
                    authorId: user.uid,
                    authorName: profile.displayName || profile.name,
                    authorAvatar: profile.avatarUrl,
                    content: newComment.trim(),
                    createdAt: { toDate: () => new Date() } as any,
                },
            ]);

            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="relative w-full max-w-lg max-h-[80vh] bg-background-elevated rounded-t-2xl sm:rounded-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <h3 className="font-semibold text-foreground">Comments</h3>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Comments list */}
                        <div className="overflow-y-auto max-h-[50vh] p-4 space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner />
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-foreground-muted">No comments yet.</p>
                                    <p className="text-sm text-foreground-subtle">Be the first to share your thoughts.</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <motion.div
                                        key={comment.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-3"
                                    >
                                        <Avatar src={comment.authorAvatar} size="sm" />
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-medium text-sm text-foreground">
                                                    {comment.authorName}
                                                </span>
                                                <span className="text-xs text-foreground-subtle">
                                                    {formatDistanceToNow(
                                                        comment.createdAt?.toDate?.() || new Date(),
                                                        { addSuffix: true }
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-foreground-muted mt-0.5">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Comment input */}
                        {user && profile ? (
                            <div className="p-4 border-t border-border">
                                <div className="flex gap-3">
                                    <Avatar src={profile.avatarUrl} size="sm" />
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                            placeholder="Add a comment..."
                                            className="flex-1 px-4 py-2 bg-background-hover text-foreground rounded-xl text-sm placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
                                        />
                                        <Button
                                            size="sm"
                                            onClick={handleSubmit}
                                            disabled={!newComment.trim() || isSubmitting}
                                            isLoading={isSubmitting}
                                        >
                                            <Send size={16} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 border-t border-border text-center">
                                <p className="text-sm text-foreground-muted">
                                    <a href="/auth" className="text-accent-primary hover:underline">Sign in</a> to comment
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
