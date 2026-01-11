'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, MessageCircle, Plus, Users, User } from 'lucide-react';
import { useUIStore } from '@/lib/store';

const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/chat', icon: MessageCircle, label: 'Chat' },
    { href: '/post', icon: Plus, label: 'Post', isAction: true },
    { href: '/feed', icon: Users, label: 'Community' },
    { href: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNav() {
    const pathname = usePathname();
    const { openPostModal } = useUIStore();

    return (
        <nav className="mobile-nav lg:hidden">
            <div className="flex items-center justify-around h-full px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    // Action button (center plus)
                    if (item.isAction) {
                        return (
                            <button
                                key={item.href}
                                onClick={() => openPostModal()}
                                className="relative -mt-6"
                            >
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="w-14 h-14 rounded-full flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                                    }}
                                >
                                    <Plus size={28} className="text-white" />
                                </motion.div>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center py-2 px-3"
                        >
                            <motion.div
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-xl transition-colors ${isActive
                                    ? 'text-accent-primary'
                                    : 'text-foreground-tertiary'
                                    }`}
                            >
                                <Icon size={24} />
                            </motion.div>

                            {/* Active indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="nav-indicator"
                                    className="absolute bottom-1 w-1 h-1 bg-accent-primary rounded-full"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
