'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingFlow from '@/components/auth/OnboardingFlow';
import { useAuth } from '@/contexts/AuthContext';
import { FullPageLoader } from '@/components/ui/Loading';

export default function OnboardingPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/auth');
            } else if (profile?.name) {
                // User already onboarded
                router.push('/feed');
            }
        }
    }, [user, profile, loading, router]);

    if (loading) {
        return <FullPageLoader message="Loading..." />;
    }

    if (!user) {
        return <FullPageLoader message="Redirecting..." />;
    }

    return <OnboardingFlow />;
}
