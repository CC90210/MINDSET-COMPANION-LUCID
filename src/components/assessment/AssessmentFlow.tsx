'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import {
    assessmentQuestions,
    generateAssessmentResult,
    AssessmentResult,
    LucidScores,
    getScoreLevel,
    formatDimensionName,
    getDimensionEmoji
} from '@/lib/assessment';
import Button from '@/components/ui/Button';

interface AssessmentFlowProps {
    onComplete: (result: AssessmentResult) => void;
    onSkip?: () => void;
}

export default function AssessmentFlow({ onComplete, onSkip }: AssessmentFlowProps) {
    const [stage, setStage] = useState<'intro' | 'questions' | 'calculating' | 'results'>('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [result, setResult] = useState<AssessmentResult | null>(null);
    const [animatedScores, setAnimatedScores] = useState<Partial<LucidScores>>({});

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

                // Animate scores one by one
                animateScores(assessmentResult.scores);
            }, 2000);
        }
    };

    const animateScores = (scores: LucidScores) => {
        const dimensions = ['selfAwareness', 'resilience', 'growthOrientation', 'emotionalRegulation', 'innerDialogue'] as const;

        dimensions.forEach((dim, index) => {
            setTimeout(() => {
                setAnimatedScores(prev => ({
                    ...prev,
                    [dim]: scores[dim],
                }));
            }, index * 200);
        });

        setTimeout(() => {
            setAnimatedScores(prev => ({
                ...prev,
                overall: scores.overall,
            }));
        }, dimensions.length * 200);
    };

    const handleComplete = () => {
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
                        className="text-2xl font-bold text-foreground mb-4 leading-snug"
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
                            className="w-full btn-lg"
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
                                Skip for now
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
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -30 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Question number */}
                                <p className="text-foreground-tertiary text-sm mb-4">
                                    {currentQuestion + 1} of {totalQuestions}
                                </p>

                                {/* Question */}
                                <h2 className="text-xl font-semibold text-foreground mb-8 leading-relaxed">
                                    {question.question}
                                </h2>

                                {/* Options */}
                                <div className="space-y-3">
                                    {question.options.map((option, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => handleAnswer(index)}
                                            className="assessment-option"
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

    // Calculating
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
                        className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-accent-primary border-t-transparent"
                    />
                    <p className="text-foreground-secondary">Analyzing your responses...</p>
                </motion.div>
            </div>
        );
    }

    // Results
    if (stage === 'results' && result) {
        const dimensions = ['selfAwareness', 'resilience', 'growthOrientation', 'emotionalRegulation', 'innerDialogue'] as const;

        return (
            <div className="min-h-screen bg-background py-8 px-4 overflow-y-auto">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <p className="text-foreground-tertiary text-sm mb-2 uppercase tracking-wider">
                            Your Lucid Score
                        </p>

                        {/* Overall Score */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            className="mb-4"
                        >
                            <span className="score-display">
                                {animatedScores.overall ?? 0}
                            </span>
                        </motion.div>

                        {/* Archetype */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                "{result.archetype}"
                            </h2>
                            <p className="text-foreground-secondary italic">
                                {result.insight}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* Dimension Scores */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="card mb-8"
                    >
                        <div className="space-y-4">
                            {dimensions.map((dim, index) => {
                                const score = animatedScores[dim] ?? 0;
                                const level = getScoreLevel(score);

                                return (
                                    <motion.div
                                        key={dim}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-foreground text-sm flex items-center gap-2">
                                                <span>{getDimensionEmoji(dim)}</span>
                                                {formatDimensionName(dim)}
                                            </span>
                                            <span className="text-foreground font-semibold">{score}</span>
                                        </div>
                                        <div className="score-bar">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${score}%` }}
                                                transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                                                className={`score-bar-fill score-${level}`}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Archetype Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="card mb-8"
                    >
                        <h3 className="text-foreground font-semibold mb-2">What this means</h3>
                        <p className="text-foreground-secondary text-sm leading-relaxed">
                            {result.archetypeDescription}
                        </p>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.7 }}
                        className="space-y-3"
                    >
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleComplete}
                            rightIcon={<ArrowRight size={20} />}
                        >
                            Get Lucid
                        </Button>

                        <button
                            onClick={() => {
                                // TODO: Implement share
                                navigator.share?.({
                                    title: 'My Lucid Score',
                                    text: `I scored ${result.scores.overall} — "${result.archetype}". What's yours?`,
                                    url: 'https://getlucid.app',
                                }).catch(() => { });
                            }}
                            className="w-full py-3 text-accent-primary text-sm font-medium hover:underline"
                        >
                            Share Your Results
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return null;
}
