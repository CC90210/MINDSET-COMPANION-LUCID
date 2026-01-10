'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image, X, Send, Hash, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Avatar from '@/components/ui/Avatar';
import { useAuth } from '@/contexts/AuthContext';
import { createPost, uploadImage } from '@/lib/firebase';
import { useFeedStore, useUIStore } from '@/lib/store';

const channels = ['mindset', 'wins', 'accountability', 'questions'];

export default function CreatePostModal() {
    const { profile, user } = useAuth();
    const { postModalOpen, closePostModal } = useUIStore();
    const { prependPost } = useFeedStore();

    const [content, setContent] = useState('');
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!content.trim() || !user || !profile) return;

        setIsSubmitting(true);

        try {
            let imageUrl: string | undefined;

            if (imageFile) {
                const path = `posts/${user.uid}/${Date.now()}_${imageFile.name}`;
                imageUrl = await uploadImage(imageFile, path);
            }

            const postId = await createPost({
                authorId: user.uid,
                authorName: isAnonymous ? 'Anonymous' : (profile.displayName || profile.name),
                authorAvatar: isAnonymous ? undefined : profile.avatarUrl,
                content: content.trim(),
                imageUrl,
                channel: selectedChannel || undefined,
                isAnonymous,
            });

            // Add to local feed
            prependPost({
                id: postId,
                authorId: user.uid,
                authorName: isAnonymous ? 'Anonymous' : (profile.displayName || profile.name),
                authorAvatar: isAnonymous ? undefined : profile.avatarUrl,
                content: content.trim(),
                imageUrl,
                channel: selectedChannel || undefined,
                isAnonymous,
                createdAt: new Date(),
                likeCount: 0,
                commentCount: 0,
            });

            // Reset form
            setContent('');
            setSelectedChannel(null);
            setIsAnonymous(false);
            removeImage();
            closePostModal();

        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid = content.trim().length > 0;
    const charCount = content.length;
    const maxChars = 1000;

    return (
        <Modal
            isOpen={postModalOpen}
            onClose={closePostModal}
            title="Share with the community"
            size="lg"
        >
            <div className="p-6">
                {/* Author info */}
                <div className="flex items-center gap-3 mb-4">
                    <Avatar
                        src={isAnonymous ? null : profile?.avatarUrl}
                        size="md"
                    />
                    <div>
                        <p className="font-medium text-foreground">
                            {isAnonymous ? 'Anonymous' : (profile?.displayName || profile?.name || 'You')}
                        </p>
                        {selectedChannel && (
                            <p className="text-xs text-accent-primary">
                                posting to #{selectedChannel}
                            </p>
                        )}
                    </div>
                </div>

                {/* Content textarea */}
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
                    placeholder="What's on your mind? Share a win, ask a question, or just check in..."
                    className="w-full p-4 text-base bg-transparent text-foreground placeholder:text-foreground-subtle resize-none focus:outline-none min-h-[150px]"
                    autoFocus
                />

                {/* Image preview */}
                {imagePreview && (
                    <div className="relative mb-4 rounded-xl overflow-hidden">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-auto max-h-64 object-cover"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Channel selection */}
                <div className="mb-4">
                    <p className="text-sm text-foreground-muted mb-2">Select a channel (optional)</p>
                    <div className="flex flex-wrap gap-2">
                        {channels.map((channel) => (
                            <motion.button
                                key={channel}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedChannel(selectedChannel === channel ? null : channel)}
                                className={`
                  flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors
                  ${selectedChannel === channel
                                        ? 'bg-accent-primary text-white'
                                        : 'bg-background-hover text-foreground-muted hover:text-foreground'
                                    }
                `}
                            >
                                <Hash size={14} />
                                {channel}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Options bar */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                        {/* Image upload */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                        >
                            <Image size={20} />
                        </motion.button>

                        {/* Anonymous toggle */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsAnonymous(!isAnonymous)}
                            className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                ${isAnonymous
                                    ? 'bg-accent-primary/10 text-accent-primary'
                                    : 'text-foreground-muted hover:bg-background-hover'
                                }
              `}
                        >
                            <EyeOff size={16} />
                            Anonymous
                        </motion.button>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Character count */}
                        <span className={`text-sm ${charCount > maxChars * 0.9 ? 'text-warning' : 'text-foreground-subtle'}`}>
                            {charCount}/{maxChars}
                        </span>

                        {/* Submit button */}
                        <Button
                            onClick={handleSubmit}
                            disabled={!isValid || isSubmitting}
                            isLoading={isSubmitting}
                            rightIcon={<Send size={16} />}
                        >
                            Post
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
