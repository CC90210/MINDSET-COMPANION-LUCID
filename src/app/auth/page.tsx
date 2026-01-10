'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { FullPageLoader } from '@/components/ui/Loading';

export default function AuthPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            // Check if user needs onboarding
            if (!profile?.name) {
                router.push('/onboarding');
            } else {
                router.push('/feed');
            }
        }
    }, [user, profile, loading, router]);

    if (loading) {
        return <FullPageLoader message="Checking authentication..." />;
    }

    if (user) {
        return <FullPageLoader message="Redirecting..." />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <AuthForm onSuccess={() => { }} />
        </div>
    );
}
