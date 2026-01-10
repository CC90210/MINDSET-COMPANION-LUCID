'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Home,
    MessageCircle,
    Users,
    User,
    Settings,
    Flame,
    Zap,
    Crown,
    Hash
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getLevelFromXP, getStreakBadge } from '@/lib/gamification';
import Avatar from '@/components/ui/Avatar';

const mainNav = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/chat', icon: MessageCircle, label: 'Chat with CC' },
    { href: '/feed', icon: Users, label: 'Community' },
    { href: '/messages', icon: MessageCircle, label: 'Messages' },
];

const channels = [
    { id: 'mindset', label: '#mindset' },
    { id: 'wins', label: '#wins' },
    { id: 'accountability', label: '#accountability' },
    { id: 'questions', label: '#questions' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { profile } = useAuth();

    const levelInfo = getLevelFromXP(profile?.xp || 0);
    const streakInfo = getStreakBadge(profile?.streak || 0);
    const isPremium = profile?.subscriptionTier === 'premium';

    return (
        <aside className="hidden lg:flex lg:flex-col w-64 h-screen bg-background border-r border-border p-4 sticky top-0">
            {/* Logo */}
            <div className="mb-8 px-3">
                <span className="text-2xl font-bold gradient-text">LUCID</span>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 space-y-1">
                {mainNav.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors relative
                ${isActive
                                    ? 'bg-accent-primary/10 text-accent-primary'
                                    : 'text-foreground-secondary hover:text-foreground hover:bg-background-tertiary'
                                }
              `}
                        >
                            <Icon size={20} />
                            {item.label}

                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-primary rounded-r-full"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}

                {/* Channels */}
                <div className="pt-4 mt-4 border-t border-border">
                    <p className="px-3 mb-2 text-xs font-medium text-foreground-tertiary uppercase tracking-wider">
                        Channels
                    </p>
                    {channels.map((channel) => {
                        const isActive = pathname === `/feed?channel=${channel.id}`;
                        return (
                            <Link
                                key={channel.id}
                                href={`/feed?channel=${channel.id}`}
                                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                  transition-colors
                  ${isActive
                                        ? 'bg-accent-primary/10 text-accent-primary'
                                        : 'text-foreground-tertiary hover:text-foreground-secondary hover:bg-background-tertiary'
                                    }
                `}
                            >
                                <Hash size={16} />
                                {channel.id}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Stats */}
            <div className="mt-auto pt-4 border-t border-border space-y-3">
                {/* Streak & XP */}
                <div className="flex items-center gap-3 px-3">
                    <div className="streak-badge text-xs">
                        <Flame size={14} />
                        {profile?.streak || 0}
                    </div>
                    <div className="xp-badge text-xs">
                        <Zap size={14} />
                        Lv.{levelInfo.level}
                    </div>
                    {isPremium && (
                        <div className="ml-auto">
                            <Crown size={16} className="text-accent-secondary" />
                        </div>
                    )}
                </div>

                {/* User */}
                <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-background-tertiary transition-colors"
                >
                    <Avatar src={profile?.avatarUrl} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {profile?.displayName || profile?.name || 'Profile'}
                        </p>
                        {profile?.lucidScores?.overall && (
                            <p className="text-xs text-foreground-tertiary">
                                Score: {profile.lucidScores.overall}
                            </p>
                        )}
                    </div>
                    <Settings size={16} className="text-foreground-tertiary" />
                </Link>
            </div>
        </aside>
    );
}
