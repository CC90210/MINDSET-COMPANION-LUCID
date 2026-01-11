'use client';

import { motion } from 'framer-motion';
import { LucidIcon } from './LucidIcon';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
    const sizeStyles = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div
            className={`
        ${sizeStyles[size]}
        border-accent-primary/30 border-t-accent-primary
        rounded-full animate-spin
        ${className}
      `}
        />
    );
}

interface LoadingDotsProps {
    className?: string;
}

export function LoadingDots({ className = '' }: LoadingDotsProps) {
    return (
        <div className={`flex items-center gap-1 ${className}`}>
            {[0, 1, 2].map((index) => (
                <motion.span
                    key={index}
                    className="w-2 h-2 bg-accent-primary rounded-full"
                    animate={{
                        y: [0, -4, 0],
                        opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: index * 0.15,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

interface TypingIndicatorProps {
    className?: string;
}

export function TypingIndicator({ className = '' }: TypingIndicatorProps) {
    return (
        <div className={`flex items-center gap-1 px-4 py-3 ${className}`}>
            <motion.span
                className="w-2 h-2 bg-accent-primary rounded-full"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
            />
            <motion.span
                className="w-2 h-2 bg-accent-primary rounded-full"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
                className="w-2 h-2 bg-accent-primary rounded-full"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
            />
        </div>
    );
}

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`
        bg-background-hover rounded-lg animate-shimmer
        ${className}
      `}
            style={{
                background: 'linear-gradient(90deg, var(--background-elevated) 0%, var(--background-hover) 50%, var(--background-elevated) 100%)',
                backgroundSize: '200% 100%',
            }}
        />
    );
}

interface FullPageLoaderProps {
    message?: string;
}

export function FullPageLoader({ message = 'Loading...' }: FullPageLoaderProps) {
    return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6"
            >
                {/* Logo animation */}
                <motion.div
                    className="mx-auto"
                    animate={{
                        boxShadow: [
                            '0 0 20px rgba(139, 92, 246, 0.3)',
                            '0 0 40px rgba(139, 92, 246, 0.5)',
                            '0 0 20px rgba(139, 92, 246, 0.3)',
                        ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <LucidIcon size={64} />
                </motion.div>

                <LoadingDots />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-foreground-muted text-sm"
                >
                    {message}
                </motion.p>
            </motion.div>
        </div>
    );
}
