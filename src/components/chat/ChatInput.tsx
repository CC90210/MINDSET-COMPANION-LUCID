'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { useChatStore, useSubscriptionStore } from '@/lib/store';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function ChatInput({
    onSend,
    disabled = false,
    placeholder = "What's on your mind?"
}: ChatInputProps) {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { isLoading, deepDiveEnabled, toggleDeepDive } = useChatStore();
    const { tier, messagesRemaining } = useSubscriptionStore();

    const handleSubmit = () => {
        if (message.trim() && !disabled && !isLoading) {
            onSend(message.trim());
            setMessage('');

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        // Auto-resize
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    };

    const isDisabled = disabled || isLoading || (tier === 'free' && messagesRemaining <= 0);

    return (
        <div className="border-t border-border bg-background-elevated/80 backdrop-blur-xl">
            {/* Rate limit warning */}
            {tier === 'free' && messagesRemaining <= 2 && messagesRemaining > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-2 bg-warning/10 border-b border-warning/20"
                >
                    <p className="text-sm text-warning text-center">
                        {messagesRemaining} {messagesRemaining === 1 ? 'message' : 'messages'} remaining today.{' '}
                        <a href="/pricing" className="underline font-medium">Upgrade for unlimited</a>
                    </p>
                </motion.div>
            )}

            {/* Limit reached */}
            {tier === 'free' && messagesRemaining <= 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 bg-error/10 border-b border-error/20"
                >
                    <p className="text-sm text-error text-center">
                        You've used all your free messages today.{' '}
                        <a href="/pricing" className="underline font-medium">Go Premium for unlimited access</a>
                    </p>
                </motion.div>
            )}

            <div className="max-w-3xl mx-auto px-4 py-4">
                <div className="relative flex items-end gap-3">
                    {/* Deep Dive Toggle (Premium only) */}
                    {tier === 'premium' && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleDeepDive}
                            className={`
                p-3 rounded-xl transition-all duration-200
                ${deepDiveEnabled
                                    ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/30'
                                    : 'bg-background-hover text-foreground-muted hover:text-foreground'
                                }
              `}
                            title={deepDiveEnabled ? 'Deep Dive enabled' : 'Enable Deep Dive for longer responses'}
                        >
                            <Sparkles size={20} />
                        </motion.button>
                    )}

                    {/* Input container */}
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={message}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            disabled={isDisabled}
                            placeholder={isDisabled && tier === 'free' && messagesRemaining <= 0
                                ? "Daily limit reached"
                                : placeholder
                            }
                            rows={1}
                            className={`
                w-full px-4 py-3 pr-12 text-base
                bg-background-hover text-foreground
                border border-border rounded-2xl
                placeholder:text-foreground-subtle
                resize-none
                transition-all duration-200
                focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20
                disabled:opacity-50 disabled:cursor-not-allowed
                max-h-[150px]
              `}
                        />
                    </div>

                    {/* Send button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        disabled={isDisabled || !message.trim()}
                        className={`
              p-3 rounded-xl transition-all duration-200
              ${message.trim() && !isDisabled
                                ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/30 hover:bg-accent-primary-hover'
                                : 'bg-background-hover text-foreground-subtle'
                            }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Send size={20} />
                        )}
                    </motion.button>
                </div>

                {/* Helper text */}
                <p className="mt-2 text-xs text-foreground-subtle text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}
