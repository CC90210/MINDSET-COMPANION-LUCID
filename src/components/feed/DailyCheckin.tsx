'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sunrise } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { submitDailyCheckin } from '@/lib/firebase';

const prompts = [
    "How are you showing up today?",
    "What's one thing you're committed to today?",
    "What energy are you bringing into this day?",
    "What's your intention for today?",
    "How are you feeling right now?",
];

export default function DailyCheckin() {
    const { user, profile } = useAuth();
    const [response, setResponse] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get today's prompt based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const todaysPrompt = prompts[dayOfYear % prompts.length];

    const handleSubmit = async () => {
        if (!response.trim() || !user) return;

        setIsSubmitting(true);
        try {
            await submitDailyCheckin(user.uid, response.trim());
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting check-in:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-2xl"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center">
                        <Sunrise size={20} className="text-accent-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">Checked in ✓</h3>
                        <p className="text-sm text-foreground-muted">
                            {profile?.streak ? `${profile.streak} day streak 🔥` : 'Keep showing up!'}
                        </p>
                    </div>
                </div>
                <p className="text-foreground-muted text-sm mt-3">
                    "{response}"
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-background-elevated border border-border rounded-2xl"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-yellow-500/20 flex items-center justify-center">
                    <Sunrise size={20} className="text-orange-500" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground">Daily Check-in</h3>
                    <p className="text-sm text-foreground-muted">Start your day with intention</p>
                </div>
            </div>

            <p className="text-lg font-medium text-foreground mb-4">
                {todaysPrompt}
            </p>

            <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Your response..."
                className="w-full p-4 bg-background-hover text-foreground rounded-xl placeholder:text-foreground-subtle resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary/20 min-h-[100px] mb-4"
            />

            <div className="flex justify-end">
                <Button
                    onClick={handleSubmit}
                    disabled={!response.trim() || isSubmitting}
                    isLoading={isSubmitting}
                >
                    Check In
                </Button>
            </div>
        </motion.div>
    );
}
