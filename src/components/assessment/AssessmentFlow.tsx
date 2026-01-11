'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Lock, Share2, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
    assessmentQuestions,
    generateAssessmentResult,
    AssessmentResult,
    LucidScores,
    getScoreLevel,
    formatDimensionName,
    getDimensionEmoji,
    getArchetypeDetails
} from '@/lib/assessment';
import Button from '@/components/ui/Button';

interface AssessmentFlowProps {
    onComplete: (result: AssessmentResult) => void;
    onSkip?: () => void;
}

export default function AssessmentFlow({ onComplete, onSkip }: AssessmentFlowProps) {
    const router = useRouter();
    const [stage, setStage] = useState<'intro' | 'questions' | 'calculating' | 'results'>('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const totalQuestions = assessmentQuestions.length;
    const progress = ((currentQuestion + 1) / totalQuestions) * 100;

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers, answerIndex];
        setAnswers(newAnswers);

        if (currentQuestion < totalQuestions - 1) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
            }, 300);
        } else {
            // Complete assessment
            setStage('calculating');

            setTimeout(() => {
                const assessmentResult = generateAssessmentResult(newAnswers);
                setResult(assessmentResult);
                setStage('results');
            }, 2000); // 2s calculating delay
        }
    };

    const handleUnlock = () => {
        if (result) {
            // Store result in local storage so auth page can pick it up
            localStorage.setItem('lucid_assessment', JSON.stringify(result));
            // Redirect to pricing or auth with intent to upgrade
            router.push('/pricing?from=assessment');
        }
    };

    const handleMaybeLater = () => {
        if (result) {
            onComplete(result);
        }
    };

    // Intro Screen
    if (stage === 'intro') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-background">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md text-center"
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <span className="text-4xl font-bold gradient-text">LUCID</span>
                    </motion.div>

                    {/* Hook */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold text-foreground mb-4 leading-tight"
                    >
                        Most people have no idea where they actually stand mentally.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-foreground-secondary mb-8 text-lg"
                    >
                        Let's find out.
                    </motion.p>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-4"
                    >
                        <Button
                            size="lg"
                            className="w-full btn-lg h-14 text-lg"
                            onClick={() => setStage('questions')}
                            rightIcon={<Sparkles size={20} />}
                        >
                            Get Lucid
                        </Button>

                        {onSkip && (
                            <button
                                onClick={onSkip}
                                className="text-foreground-tertiary text-sm hover:text-foreground-secondary transition-colors"
                            >
                                I already have an account
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // Questions
    if (stage === 'questions') {
        const question = assessmentQuestions[currentQuestion];

        return (
            <div className="min-h-screen flex flex-col bg-background">
                {/* Progress bar */}
                <div className="fixed top-0 left-0 right-0 h-1 bg-background-tertiary z-50">
                    <motion.div
                        className="h-full bg-accent-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>

                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full max-w-lg">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Question number */}
                                <p className="text-foreground-tertiary text-sm mb-6 font-medium">
                                    {currentQuestion + 1} <span className="text-foreground-muted">/ {totalQuestions}</span>
                                </p>

                                {/* Question - Typing effect simulation implicitly via fadeIn */}
                                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-10 leading-snug">
                                    {question.question}
                                </h2>

                                {/* Options */}
                                <div className="space-y-3">
                                    {question.options.map((option, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 + 0.2 }}
                                            onClick={() => handleAnswer(index)}
                                            className="w-full p-4 md:p-5 text-left bg-background-elevated border border-border rounded-xl hover:border-accent-primary/50 hover:bg-accent-primary/5 transition-all duration-200 text-foreground-secondary hover:text-foreground text-lg"
                                        >
                                            {option.text}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        );
    }

    // Calculating / Analyzing
    if (stage === 'calculating') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-background">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-16 h-16 mx-auto mb-8 rounded-full border-2 border-accent-primary border-t-transparent"
                    />
                    <motion.h2
                        className="text-2xl font-bold text-foreground mb-2"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Calculating your clear score...
                    </motion.h2>
                    <p className="text-foreground-secondary">Analyzing 10 mental dimensions</p>
                </motion.div>
            </div>
        );
    }

    // Results (Paywall Moment)
    if (stage === 'results' && result) {
        return (
            <div className="min-h-screen bg-background py-8 px-4 overflow-y-auto">
                <div className="max-w-md mx-auto">
                    {/* Header Card */}
                    <div className="relative mb-8 pt-8 pb-12 px-8 bg-background-elevated border border-border rounded-3xl text-center overflow-hidden">
                        {/* Background effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-accent-primary/5 blur-3xl rounded-full" />

                        <p className="text-foreground-tertiary text-sm mb-6 uppercase tracking-widest font-medium">
                            Your Lucid Score
                        </p>

                        <div className="relative inline-block mb-6">
                            <span className="text-7xl font-bold gradient-text tracking-tighter">
                                {result.scores.overall}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-foreground">
                                "{result.archetype}"
                            </h2>
                            <p className="text-foreground-secondary italic text-lg leading-relaxed">
                                {result.insight}
                            </p>
                        </div>
                    </div>

                    {/* Paywall / Blurred Section */}
                    <div className="relative mb-8">
                        {/* Blurred Content Preview */}
                        <div className="opacity-50 blur-[2px] pointer-events-none select-none">
                            <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                                <Lock size={16} /> Full Lucid Profile
                            </h3>
                            <div className="space-y-4">
                                {['Self-Awareness', 'Resilience', 'Growth Orientation', 'Emotional Regulation'].map((dim, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-foreground-secondary">{dim}</span>
                                            <span className="text-foreground-muted">??</span>
                                        </div>
                                        <div className="h-2 bg-background-tertiary rounded-full overflow-hidden">
                                            <div className="h-full bg-accent-primary/30 w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Paywall Overlay Card */}
                        <div className="absolute inset-0 -top-4 -bottom-4 flex flex-col items-center justify-center text-center p-6 bg-background/60 backdrop-blur-md border border-accent-primary/20 rounded-2xl shadow-2xl">
                            <div className="w-12 h-12 bg-accent-primary/20 rounded-full flex items-center justify-center mb-4 text-accent-primary">
                                <Lock size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Unlock Your Full Profile
                            </h3>
                            <p className="text-foreground-secondary text-sm mb-6 max-w-xs">
                                See your scores across all 10 dimensions, get your personalized growth roadmap, and start working with Lucid AI.
                            </p>

                            <Button
                                size="lg"
                                className="w-full mb-3 animate-pulse-soft"
                                onClick={handleUnlock}
                            >
                                Unlock Full Results — $12/mo
                            </Button>
                        </div>
                    </div>

                    {/* Secondary Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'My Lucid Score',
                                        text: `I scored ${result.scores.overall} — "${result.archetype}". What's yours?`,
                                        url: 'https://getlucid.app',
                                    }).catch(() => { });
                                }
                            }}
                            className="w-full py-3 flex items-center justify-center gap-2 text-foreground-secondary hover:text-foreground transition-colors border border-border rounded-xl"
                        >
                            <Share2 size={18} />
                            Share Score
                        </button>

                        <button
                            onClick={handleMaybeLater}
                            className="w-full py-3 text-foreground-tertiary text-sm hover:text-foreground-secondary transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
