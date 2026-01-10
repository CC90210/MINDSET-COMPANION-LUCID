'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function PostPage() {
    const { openPostModal } = useUIStore();
    const router = useRouter();

    useEffect(() => {
        openPostModal();
        // Redirect back to feed after opening modal
        router.push('/feed');
    }, [openPostModal, router]);

    return null;
}
