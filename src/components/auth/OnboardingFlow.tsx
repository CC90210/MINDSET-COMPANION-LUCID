'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const steps = [
    {
        id: 'name',
        title: "What should I call you?",
        subtitle: "Just your first name is perfect.",
        required: true,
    },
    {
        id: 'struggle',
        title: "What's weighing on you lately?",
        subtitle: "This helps me understand where you're at. Be honest — no judgment here.",
        required: false,
    },
    {
        id: 'outcome',
        title: "What do you want to become?",
        subtitle: "Not what you want to do — who do you want to be?",
        required: false,
    },
];

export default function OnboardingFlow() {
    const { completeOnboarding } = useAuth();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(0);
    const [data, setData] = useState({
        name: '',
        currentStruggle: '',
        desiredOutcome: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    const canProceed = step.required ? data.name.trim().length > 0 : true;

    const handleNext = async () => {
        if (isLastStep) {
            setIsSubmitting(true);
            try {
                await completeOnboarding({
                    name: data.name.trim(),
                    currentStruggle: data.currentStruggle.trim() || undefined,
                    desiredOutcome: data.desiredOutcome.trim() || undefined,
                });
                router.push('/chat');
            } catch (error) {
                console.error('Onboarding error:', error);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        if (!step.required) {
            if (isLastStep) {
                handleNext();
            } else {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
            <div className="w-full max-w-md">
                {/* Progress */}
                <div className="flex items-center gap-2 mb-8">
                    {steps.map((_, index) => (
                        <motion.div
                            key={index}
                            className={`h-1 flex-1 rounded-full transition-colors ${index <= currentStep ? 'bg-accent-primary' : 'bg-border'
                                }`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: index <= currentStep ? 1 : 0.3 }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>

                {/* Step content */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        {step.title}
                    </h2>
                    <p className="text-foreground-muted mb-8">
                        {step.subtitle}
                    </p>

                    {step.id === 'name' && (
                        <Input
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                            placeholder="Your first name"
                            autoFocus
                            className="text-lg"
                        />
                    )}

                    {step.id === 'struggle' && (
                        <Textarea
                            value={data.currentStruggle}
                            onChange={(e) => setData({ ...data, currentStruggle: e.target.value })}
                            placeholder="What's been on your mind? What patterns are you trying to break?"
                            rows={4}
                            autoResize
                            autoFocus
                        />
                    )}

                    {step.id === 'outcome' && (
                        <Textarea
                            value={data.desiredOutcome}
                            onChange={(e) => setData({ ...data, desiredOutcome: e.target.value })}
                            placeholder="The version of yourself you're working toward..."
                            rows={4}
                            autoResize
                            autoFocus
                        />
                    )}
                </motion.div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                    <div>
                        {currentStep > 0 && (
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                leftIcon={<ArrowLeft size={18} />}
                            >
                                Back
                            </Button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {!step.required && (
                            <Button variant="ghost" onClick={handleSkip}>
                                Skip
                            </Button>
                        )}

                        <Button
                            onClick={handleNext}
                            disabled={!canProceed || isSubmitting}
                            isLoading={isSubmitting}
                            rightIcon={isLastStep ? <Sparkles size={18} /> : <ArrowRight size={18} />}
                        >
                            {isLastStep ? "Let's go" : 'Continue'}
                        </Button>
                    </div>
                </div>

                {/* Skip onboarding entirely */}
                {currentStep === 0 && (
                    <p className="text-center text-sm text-foreground-subtle mt-8">
                        Want to explore first?{' '}
                        <button
                            onClick={() => router.push('/feed')}
                            className="text-accent-primary hover:underline"
                        >
                            Skip for now
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
}
