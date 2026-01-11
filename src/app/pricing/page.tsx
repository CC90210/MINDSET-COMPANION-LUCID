'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, MessageCircle, Users, Sparkles, Clock, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const plans = [
    {
        id: 'free',
        name: 'Free',
        price: '$0',
        period: 'forever',
        description: 'Get started on your journey',
        features: [
            { text: '5 AI messages per day', included: true },
            { text: 'Browse community feed', included: true },
            { text: 'Basic profile', included: true },
            { text: 'Post to community', included: false },
            { text: 'Direct messages', included: false },
            { text: 'Conversation history', included: false },
            { text: 'Deep Dive mode', included: false },
        ],
        cta: 'Current Plan',
        highlighted: false,
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '$12',
        period: '/month',
        description: 'Unlock your full potential',
        features: [
            { text: 'Unlimited AI messages', included: true },
            { text: 'Full community access', included: true },
            { text: 'Post, comment, and like', included: true },
            { text: 'Direct messages', included: true },
            { text: 'Full conversation history', included: true },
            { text: 'Deep Dive mode', included: true },
            { text: 'Premium profile badge', included: true },
        ],
        cta: 'Start Premium',
        highlighted: true,
    },
];

const coaching = {
    name: '1:1 Coaching',
    price: '$497',
    period: 'one-time',
    description: 'Transform with personalized guidance',
    features: [
        'Everything in Premium',
        '60-minute call with Lucid',
        'Personalized action plan',
        'Follow-up support',
        'Priority community access',
    ],
};

export default function PricingPage() {
    const { user, profile } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const currentPlan = profile?.subscriptionTier || 'free';

    const handleSubscribe = async (planId: string) => {
        if (planId === 'free') return;

        if (!user) {
            router.push('/auth');
            return;
        }

        setIsLoading(planId);

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    email: user.email,
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Subscription error:', error);
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Invest in your transformation
                    </h1>
                    <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
                        The version of you that figures this out? They're worth every penny.
                    </p>
                </motion.div>

                {/* Plans */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`
                relative p-8 rounded-2xl border
                ${plan.highlighted
                                    ? 'bg-gradient-to-b from-accent-primary/10 to-transparent border-accent-primary/30'
                                    : 'bg-background-elevated border-border'
                                }
              `}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-primary text-white text-sm font-medium rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                                    <span className="text-foreground-muted">{plan.period}</span>
                                </div>
                                <p className="text-foreground-muted mt-2">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <div className={`
                      w-5 h-5 rounded-full flex items-center justify-center
                      ${feature.included
                                                ? 'bg-success/20 text-success'
                                                : 'bg-border text-foreground-subtle'
                                            }
                    `}>
                                            <Check size={12} />
                                        </div>
                                        <span className={feature.included ? 'text-foreground' : 'text-foreground-subtle'}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                className="w-full"
                                variant={plan.highlighted ? 'primary' : 'secondary'}
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={currentPlan === plan.id || isLoading === plan.id}
                                isLoading={isLoading === plan.id}
                            >
                                {currentPlan === plan.id ? 'Current Plan' : plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Coaching */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 border border-border"
                >
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <Crown size={20} className="text-accent-primary" />
                                <span className="text-sm font-medium text-accent-primary uppercase tracking-wide">
                                    Go Deeper
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-2">
                                {coaching.name}
                            </h3>
                            <p className="text-foreground-muted mb-4">{coaching.description}</p>
                            <ul className="space-y-2">
                                {coaching.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-foreground">
                                        <Check size={16} className="text-success" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="text-center md:text-right">
                            <div className="flex items-baseline justify-center md:justify-end gap-1 mb-4">
                                <span className="text-4xl font-bold text-foreground">{coaching.price}</span>
                                <span className="text-foreground-muted">{coaching.period}</span>
                            </div>
                            <Button
                                size="lg"
                                onClick={() => window.open('https://calendly.com', '_blank')}
                            >
                                Book a Call
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Trust Signals */}
                <div className="mt-16 grid sm:grid-cols-3 gap-6">
                    {[
                        { icon: Shield, title: 'Secure Payments', text: 'Powered by Stripe' },
                        { icon: Clock, title: 'Cancel Anytime', text: 'No long-term commitment' },
                        { icon: MessageCircle, title: 'Support', text: 'We respond to everyone' },
                    ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <div key={i} className="text-center p-6">
                                <Icon size={24} className="mx-auto mb-3 text-foreground-muted" />
                                <h4 className="font-medium text-foreground">{item.title}</h4>
                                <p className="text-sm text-foreground-muted">{item.text}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
