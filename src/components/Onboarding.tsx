'use client';

import { useState } from 'react';

const onboardingSteps = [
    {
        title: "Welcome to Lucid",
        description: "This is your space to get clarity on your mind and become who you're meant to be.",
        icon: "✨"
    },
    {
        title: "Your Lucid Score",
        description: "You've been scored across 10 mental dimensions. Track your progress over time.",
        icon: "📊"
    },
    {
        title: "Chat with Lucid",
        description: "Talk through what's on your mind. Lucid will help you see clearly.",
        icon: "💬"
    },
    {
        title: "Join the Community",
        description: "Connect with others on the same path. Share wins, struggles, and growth.",
        icon: "👥"
    }
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-[#141418] rounded-2xl p-8 max-w-md text-center border border-gray-800 shadow-2xl">
                <div className="text-5xl mb-6">{onboardingSteps[step].icon}</div>
                <h2 className="text-2xl font-semibold text-white mb-3">
                    {onboardingSteps[step].title}
                </h2>
                <p className="text-gray-400 mb-8 min-h-[48px]">
                    {onboardingSteps[step].description}
                </p>

                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-8">
                    {onboardingSteps.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'bg-indigo-500 w-4' : 'bg-gray-700'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => {
                        if (step < onboardingSteps.length - 1) {
                            setStep(step + 1);
                        } else {
                            onComplete();
                        }
                    }}
                    className="w-full px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all"
                >
                    {step < onboardingSteps.length - 1 ? 'Next' : 'Get Started'}
                </button>
            </div>
        </div>
    );
}
