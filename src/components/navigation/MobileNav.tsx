'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, MessageCircle, PlusCircle, Mail, User } from 'lucide-react';

const navItems = [
    { href: '/feed', icon: Home, label: 'Feed' },
    { href: '/chat', icon: MessageCircle, label: 'CC' },
    { href: '/post', icon: PlusCircle, label: 'Post', isAction: true },
    { href: '/messages', icon: Mail, label: 'DMs' },
    { href: '/profile', icon: User, label: 'Me' },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="mobile-nav">
            <div className="flex items-center justify-around h-full max-w-lg mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    if (item.isAction) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex items-center justify-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg"
                                    style={{
                                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                                    }}
                                >
                                    <Icon size={24} className="text-white" />
                                </motion.div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center py-2 px-4 group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative"
                            >
                                <Icon
                                    size={24}
                                    className={`transition-colors duration-200 ${isActive
                                            ? 'text-accent-primary'
                                            : 'text-foreground-muted group-hover:text-foreground'
                                        }`}
                                />

                                {isActive && (
                                    <motion.div
                                        layoutId="navIndicator"
                                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-primary rounded-full"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.div>

                            <span
                                className={`text-xs mt-1 transition-colors duration-200 ${isActive
                                        ? 'text-accent-primary'
                                        : 'text-foreground-subtle group-hover:text-foreground-muted'
                                    }`}
                            >
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
