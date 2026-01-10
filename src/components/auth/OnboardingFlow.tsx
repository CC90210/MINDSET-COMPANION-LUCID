'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const struggles = [
    { id: 'overthinking', label: 'Stop overthinking', emoji: '🧠' },
    { id: 'discipline', label: 'Build discipline', emoji: '💪' },
    { id: 'emotions', label: 'Handle emotions better', emoji: '🧘' },
    { id: 'confidence', label: 'Believe in myself', emoji: '✨' },
    { id: 'comparison', label: 'Stop comparing myself', emoji: '👁️' },
    { id: 'all', label: 'All of the above', emoji: '🔥' },
];

export default function OnboardingFlow() {
    const { profile, completeOnboarding, updateProfile } = useAuth();
    const router = useRouter();

    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [selectedStruggle, setSelectedStruggle] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [assessmentData, setAssessmentData] = useState<any>(null);

    useEffect(() => {
        // Check for assessment data from landing page
        const stored = localStorage.getItem('lucid_assessment');
        if (stored) {
            setAssessmentData(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        if (profile?.name) {
            setName(profile.name);
        }
    }, [profile]);

    const handleComplete = async () => {
        setIsLoading(true);

        try {
            // Build the profile update
            const updateData: any = {
                name,
                onboarding: {
                    currentStruggle: struggles.find(s => s.id === selectedStruggle)?.label,
                    completedAt: new Date().toISOString(),
                },
            };

            // Add assessment data if available
            if (assessmentData) {
                updateData.lucidScores = assessmentData.scores;
                updateData.archetype = assessmentData.archetype;
                updateData.assessmentHistory = [{
                    date: new Date().toISOString(),
                    scores: assessmentData.scores,
                    archetype: assessmentData.archetype,
                }];
                // Award XP for completing assessment
                updateData.xp = (profile?.xp || 0) + 100;

                // Clear localStorage
                localStorage.removeItem('lucid_assessment');
            }

            await completeOnboarding({
                name,
                currentStruggle: struggles.find(s => s.id === selectedStruggle)?.label || '',
            });
            await updateProfile(updateData);

            router.push('/home');
        } catch (error) {
            console.error('Onboarding error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const canProceed = () => {
        if (step === 0) return name.trim().length >= 2;
        if (step === 1) return selectedStruggle !== '';
        return true;
    };

    const nextStep = () => {
        if (step === 1) {
            handleComplete();
        } else {
            setStep(step + 1);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Progress */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-background-tertiary z-50">
                <motion.div
                    className="h-full bg-accent-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / 2) * 100}%` }}
                />
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="name"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-md"
                        >
                            <div className="text-center mb-8">
                                <span className="text-3xl font-bold gradient-text">LUCID</span>
                            </div>

                            {assessmentData && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-4 bg-accent-primary/10 border border-accent-primary/20 rounded-xl text-center"
                                >
                                    <p className="text-foreground-secondary mb-2">Your Lucid Score</p>
                                    <span className="text-4xl font-bold gradient-text">{assessmentData.scores.overall}</span>
                                    <p className="text-foreground mt-1">{assessmentData.archetype}</p>
                                </motion.div>
                            )}

                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Before we go further...
                            </h2>
                            <p className="text-foreground-secondary mb-8">
                                What should I call you?
                            </p>

                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your first name"
                                autoFocus
                                className="text-lg"
                            />

                            <div className="mt-8">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    rightIcon={<ArrowRight size={20} />}
                                >
                                    Continue
                                </Button>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="struggle"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full max-w-md"
                        >
                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                Hey {name}.
                            </h2>
                            <p className="text-foreground-secondary mb-8">
                                What's the one thing you want to change most?
                            </p>

                            <div className="space-y-3">
                                {struggles.map((struggle, index) => (
                                    <motion.button
                                        key={struggle.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedStruggle(struggle.id)}
                                        className={`
                      w-full flex items-center gap-4 p-4 rounded-xl border transition-all
                      ${selectedStruggle === struggle.id
                                                ? 'border-accent-primary bg-accent-primary/10'
                                                : 'border-border hover:border-border-hover bg-background-secondary'
                                            }
                    `}
                                    >
                                        <span className="text-2xl">{struggle.emoji}</span>
                                        <span className={`text-left flex-1 ${selectedStruggle === struggle.id
                                            ? 'text-foreground'
                                            : 'text-foreground-secondary'
                                            }`}>
                                            {struggle.label}
                                        </span>
                                        {selectedStruggle === struggle.id && (
                                            <Check size={20} className="text-accent-primary" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="mt-8">
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={nextStep}
                                    disabled={!canProceed()}
                                    isLoading={isLoading}
                                    rightIcon={<Sparkles size={20} />}
                                >
                                    Let's Go
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
