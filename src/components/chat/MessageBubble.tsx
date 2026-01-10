'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface MessageBubbleProps {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: Date;
    userName?: string;
}

export default function MessageBubble({
    role,
    content,
    timestamp
}: MessageBubbleProps) {
    const isUser = role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mb-4 ${isUser ? 'ml-8 sm:ml-12' : 'mr-8 sm:mr-12'}`}
        >
            <div
                className={`
          relative p-4 rounded-2xl
          ${isUser
                        ? 'bg-background-hover rounded-br-md'
                        : 'bg-transparent border-l-3 border-accent-primary pl-5 rounded-none'
                    }
        `}
                style={!isUser ? { borderLeftWidth: '3px', borderLeftColor: 'var(--accent-primary)' } : {}}
            >
                {/* Message content */}
                <div
                    className={`
            text-foreground whitespace-pre-wrap break-words
            ${isUser ? 'text-base' : 'text-[1.0625rem] leading-relaxed'}
          `}
                >
                    {content}
                </div>

                {/* Timestamp */}
                {timestamp && (
                    <div
                        className={`
              mt-2 text-xs text-foreground-subtle
              ${isUser ? 'text-right' : 'text-left'}
            `}
                    >
                        {format(timestamp, 'h:mm a')}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
