'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MobileNav from '@/components/navigation/MobileNav';
import Sidebar from '@/components/navigation/Sidebar';
import CreatePostModal from '@/components/feed/CreatePostModal';
import { useAuth } from '@/contexts/AuthContext';
import { FullPageLoader } from '@/components/ui/Loading';

export default function AppLayout({ children }: { children: ReactNode }) {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth');
        }
    }, [user, loading, router]);

    if (loading) {
        return <FullPageLoader />;
    }

    if (!user) {
        return <FullPageLoader message="Redirecting..." />;
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 pb-20 lg:pb-0">
                {children}
            </main>

            {/* Mobile Navigation */}
            <MobileNav />

            {/* Create Post Modal */}
            <CreatePostModal />
        </div>
    );
}
