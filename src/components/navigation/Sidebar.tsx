'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Home,
    MessageCircle,
    Mail,
    User,
    Settings,
    Crown,
    Flame,
    Hash,
    TrendingUp,
    CheckCircle,
    HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Avatar from '@/components/ui/Avatar';

const mainNavItems = [
    { href: '/feed', icon: Home, label: 'Home Feed' },
    { href: '/chat', icon: MessageCircle, label: 'Talk to CC' },
    { href: '/messages', icon: Mail, label: 'Messages' },
];

const channelItems = [
    { href: '/feed?channel=mindset', icon: Hash, label: 'mindset' },
    { href: '/feed?channel=wins', icon: TrendingUp, label: 'wins' },
    { href: '/feed?channel=accountability', icon: CheckCircle, label: 'accountability' },
    { href: '/feed?channel=questions', icon: HelpCircle, label: 'questions' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { profile } = useAuth();

    return (
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-background-elevated">
            {/* Logo */}
            <div className="p-6">
                <Link href="/feed" className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center"
                    >
                        <span className="text-lg font-bold text-white">CC</span>
                    </motion.div>
                    <span className="text-xl font-semibold text-foreground">Mindset</span>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {mainNavItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200
                ${isActive
                                    ? 'bg-accent-primary/10 text-accent-primary'
                                    : 'text-foreground-muted hover:bg-background-hover hover:text-foreground'
                                }
              `}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="sidebarIndicator"
                                    className="ml-auto w-1.5 h-1.5 bg-accent-primary rounded-full"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}

                {/* Channels Section */}
                <div className="pt-6 pb-2">
                    <h3 className="px-4 text-xs font-semibold text-foreground-subtle uppercase tracking-wider">
                        Channels
                    </h3>
                </div>

                {channelItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-foreground-muted hover:bg-background-hover hover:text-foreground transition-all duration-200"
                        >
                            <Icon size={16} />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-border">
                {/* Streak Badge */}
                {profile && profile.streak > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 mb-3 bg-orange-500/10 rounded-xl">
                        <Flame size={18} className="text-orange-500" />
                        <span className="text-sm font-medium text-orange-500">
                            {profile.streak} day streak
                        </span>
                    </div>
                )}

                {/* Premium Badge */}
                {profile?.subscriptionTier === 'premium' && (
                    <div className="flex items-center gap-2 px-4 py-2 mb-3 bg-accent-primary/10 rounded-xl">
                        <Crown size={18} className="text-accent-primary" />
                        <span className="text-sm font-medium text-accent-primary">Premium</span>
                    </div>
                )}

                {/* User Profile Link */}
                <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-background-hover transition-colors"
                >
                    <Avatar src={profile?.avatarUrl} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                            {profile?.displayName || 'Set up profile'}
                        </p>
                        <p className="text-xs text-foreground-subtle truncate">
                            {profile?.email}
                        </p>
                    </div>
                    <Settings size={16} className="text-foreground-subtle" />
                </Link>
            </div>
        </aside>
    );
}
