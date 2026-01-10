'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import { LucidScores, MindsetArchetype, formatDimensionName, getScoreLevel } from '@/lib/assessment';

interface ShareCardProps {
    scores: LucidScores;
    archetype: MindsetArchetype;
    userName?: string;
}

export default function ShareCard({ scores, archetype, userName }: ShareCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    const dimensions = [
        { key: 'selfAwareness' as const, emoji: '🧠' },
        { key: 'resilience' as const, emoji: '💪' },
        { key: 'growthOrientation' as const, emoji: '📈' },
    ];

    const handleShare = async () => {
        try {
            await navigator.share({
                title: 'My Lucid Score',
                text: `I scored ${scores.overall} — "${archetype}". What's yours?`,
                url: 'https://getlucid.app',
            });
        } catch (error) {
            // Fallback: copy to clipboard
            const text = `My Lucid Score: ${scores.overall}\n"${archetype}"\n\nWhat's yours?\nhttps://getlucid.app`;
            navigator.clipboard.writeText(text);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* The Share Card */}
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="share-card w-full"
            >
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-primary to-accent-secondary" />
                    <span className="text-foreground font-semibold">LUCID</span>
                </div>

                {/* Score */}
                <div className="text-center mb-6">
                    <p className="text-foreground-tertiary text-xs mb-1 uppercase tracking-wider">
                        My Mindset Score
                    </p>
                    <span className="text-5xl font-bold gradient-text">{scores.overall}</span>
                    <div className="w-24 h-0.5 mx-auto mt-3 bg-gradient-to-r from-transparent via-foreground-tertiary to-transparent" />
                </div>

                {/* Archetype */}
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-foreground">"{archetype}"</h3>
                </div>

                {/* Top 3 Dimensions */}
                <div className="space-y-2 mb-6">
                    {dimensions.map(({ key, emoji }) => {
                        const score = scores[key];
                        return (
                            <div key={key} className="flex items-center gap-3">
                                <span className="text-sm">{emoji}</span>
                                <span className="text-xs text-foreground-secondary flex-1">
                                    {formatDimensionName(key)}:
                                </span>
                                <span className="text-sm font-semibold text-foreground">{score}</span>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center pt-4 border-t border-border">
                    <p className="text-foreground-secondary text-sm">What's yours?</p>
                    <p className="text-accent-primary text-sm font-medium">getlucid.app</p>
                </div>
            </motion.div>

            {/* Share Button */}
            <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-full font-medium hover:bg-accent-primary-hover transition-colors"
            >
                <Share2 size={18} />
                Share Results
            </button>
        </div>
    );
}
