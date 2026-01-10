'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Target, ChevronRight, TrendingUp, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getLevelFromXP, getStreakBadge, formatXP, SAMPLE_CHALLENGES } from '@/lib/gamification';
import { formatDimensionName, getDimensionEmoji, getScoreLevel } from '@/lib/assessment';
import DailyCheckin from '@/components/feed/DailyCheckin';
import Link from 'next/link';

export default function DashboardPage() {
    const { profile } = useAuth();
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');
    }, []);

    if (!profile) return null;

    const levelInfo = getLevelFromXP(profile.xp || 0);
    const streakInfo = getStreakBadge(profile.streak || 0);
    const lucidScore = profile.lucidScores?.overall || 0;
    const archetype = profile.archetype || 'Unknown';

    // Get current challenge (first sample for now)
    const currentChallenge = SAMPLE_CHALLENGES[0];

    const dimensions = ['selfAwareness', 'resilience', 'growthOrientation', 'emotionalRegulation', 'innerDialogue'] as const;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-20 glass border-b border-border">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <span className="text-xl font-bold gradient-text">LUCID</span>
                    <button className="p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-background-tertiary transition-colors">
                        <Bell size={20} />
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6 has-nav">
                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-2xl font-bold text-foreground">
                        {greeting}, {profile.name || 'there'}.
                    </h1>
                </motion.div>

                {/* Lucid Score Card */}
                {lucidScore > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card mb-6 cursor-pointer hover:border-accent-primary/50 transition-colors"
                    >
                        <Link href="/profile#assessment" className="block">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-foreground-secondary text-sm font-medium uppercase tracking-wide">
                                    Lucid Score
                                </span>
                                <ChevronRight size={18} className="text-foreground-tertiary" />
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-center">
                                    <span className="text-5xl font-bold gradient-text">{lucidScore}</span>
                                </div>

                                <div className="flex-1 border-l border-border pl-6">
                                    <p className="text-foreground font-medium">{archetype}</p>
                                    <p className="text-foreground-tertiary text-sm">
                                        {profile.assessmentHistory?.length || 1} assessment{(profile.assessmentHistory?.length || 1) > 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Mini dimension bars */}
                            {profile.lucidScores && (
                                <div className="mt-4 pt-4 border-t border-border grid grid-cols-5 gap-2">
                                    {dimensions.map((dim) => {
                                        const score = profile.lucidScores?.[dim] || 0;
                                        const level = getScoreLevel(score);
                                        return (
                                            <div key={dim} className="text-center">
                                                <div className="score-bar h-1 mb-1">
                                                    <div
                                                        className={`score-bar-fill score-${level}`}
                                                        style={{ width: `${score}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-foreground-tertiary">
                                                    {getDimensionEmoji(dim)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Link>
                    </motion.div>
                )}

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 gap-3 mb-6"
                >
                    {/* Streak */}
                    <div className="card">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                                <Flame size={24} className="text-warning" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{profile.streak || 0}</p>
                                <p className="text-sm text-foreground-tertiary">Day streak</p>
                            </div>
                        </div>
                        {streakInfo.nextMilestone && (
                            <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-xs text-foreground-tertiary">
                                    {streakInfo.nextMilestone - (profile.streak || 0)} days to {streakInfo.emoji} badge
                                </p>
                            </div>
                        )}
                    </div>

                    {/* XP & Level */}
                    <div className="card">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                                <Zap size={24} className="text-accent-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-foreground">{formatXP(profile.xp || 0)}</p>
                                <p className="text-sm text-foreground-tertiary">Level {levelInfo.level}</p>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-border">
                            <div className="flex justify-between text-xs text-foreground-tertiary mb-1">
                                <span>{levelInfo.name}</span>
                                <span>{Math.round(levelInfo.progress)}%</span>
                            </div>
                            <div className="progress-bar h-1">
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${levelInfo.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Daily Check-in */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                >
                    <h2 className="text-sm font-medium text-foreground-secondary uppercase tracking-wide mb-3">
                        Daily Check-in
                    </h2>
                    <DailyCheckin />
                </motion.div>

                {/* Weekly Challenge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-sm font-medium text-foreground-secondary uppercase tracking-wide mb-3">
                        This Week's Challenge
                    </h2>
                    <div className="card">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-accent-secondary/10 flex items-center justify-center flex-shrink-0">
                                <Target size={20} className="text-accent-secondary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground mb-1">
                                    {currentChallenge.title}
                                </h3>
                                <p className="text-sm text-foreground-secondary leading-relaxed mb-3">
                                    {currentChallenge.description}
                                </p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-foreground-tertiary">
                                        Day 1/{currentChallenge.duration}
                                    </span>
                                    <span className="text-accent-primary font-medium">
                                        +{currentChallenge.xpReward} XP
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border">
                            <Link
                                href="/post?challenge=true"
                                className="btn btn-secondary w-full text-sm"
                            >
                                Share Update
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 grid grid-cols-2 gap-3"
                >
                    <Link href="/chat" className="card card-interactive p-4 text-center">
                        <span className="text-2xl mb-2 block">💬</span>
                        <span className="text-sm text-foreground">Talk to CC</span>
                    </Link>
                    <Link href="/feed" className="card card-interactive p-4 text-center">
                        <span className="text-2xl mb-2 block">👥</span>
                        <span className="text-sm text-foreground">Community</span>
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
