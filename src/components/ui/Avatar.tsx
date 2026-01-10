'use client';

import Image from 'next/image';
import { User } from 'lucide-react';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showBadge?: boolean;
    badgeContent?: React.ReactNode;
}

export default function Avatar({
    src,
    alt = 'User avatar',
    size = 'md',
    className = '',
    showBadge = false,
    badgeContent,
}: AvatarProps) {
    const sizeStyles = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const iconSizes = {
        xs: 12,
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                className={`
          ${sizeStyles[size]}
          rounded-full overflow-hidden
          bg-background-hover border border-border
          flex items-center justify-center
        `}
            >
                {src ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover"
                        sizes={size === 'xl' ? '64px' : size === 'lg' ? '48px' : '40px'}
                    />
                ) : (
                    <User size={iconSizes[size]} className="text-foreground-muted" />
                )}
            </div>

            {showBadge && (
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
                    {badgeContent}
                </div>
            )}
        </div>
    );
}
