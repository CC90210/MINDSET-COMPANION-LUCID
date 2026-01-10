'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, MessageCircle, Users, TrendingUp, Target, Brain, Zap } from 'lucide-react';
import AssessmentFlow from '@/components/assessment/AssessmentFlow';
import { useAuth } from '@/contexts/AuthContext';
import { AssessmentResult } from '@/lib/assessment';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    // Check for stored assessment result
    const stored = localStorage.getItem('lucid_assessment');
    if (stored) {
      setAssessmentResult(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/feed');
    }
  }, [user, loading, router]);

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessmentResult(result);
    localStorage.setItem('lucid_assessment', JSON.stringify(result));
    setShowAssessment(false);
    // Redirect to signup with assessment data
    router.push('/auth?from=assessment');
  };

  if (showAssessment) {
    return (
      <AssessmentFlow
        onComplete={handleAssessmentComplete}
        onSkip={() => setShowAssessment(false)}
      />
    );
  }

  const features = [
    {
      icon: Brain,
      title: 'Know Your Mind',
      description: 'Take the Lucid Assessment. Get a clear score across 5 mental dimensions. See yourself without the stories.',
    },
    {
      icon: MessageCircle,
      title: 'Talk to CC',
      description: "An AI that doesn't coddle you. Sharp insight. Real talk. The friend who tells you what you need to hear.",
    },
    {
      icon: Users,
      title: 'Real Community',
      description: 'Not toxic positivity. Not pessimistic realism. People who are actually doing the work, together.',
    },
    {
      icon: TrendingUp,
      title: 'Track Growth',
      description: 'XP, levels, streaks. Watch yourself level up. Retake assessments. See the change over time.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 via-transparent to-transparent" />

        <motion.div
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[100px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-accent-secondary/10 rounded-full blur-[100px]"
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <span className="text-5xl font-bold gradient-text">LUCID</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
          >
            Most people have no idea where they actually stand mentally.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-foreground-secondary mb-10 max-w-xl mx-auto"
          >
            Let's find out.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => setShowAssessment(true)}
              className="btn btn-primary btn-lg group"
            >
              <Sparkles size={20} className="mr-2" />
              Get Lucid
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => router.push('/auth')}
              className="btn btn-ghost text-foreground-secondary"
            >
              I have an account
            </button>
          </motion.div>

          {/* Assessment Result Teaser */}
          {assessmentResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 inline-flex items-center gap-3 px-6 py-3 bg-background-secondary border border-border rounded-full"
            >
              <span className="text-2xl font-bold gradient-text">{assessmentResult.scores.overall}</span>
              <span className="text-foreground-secondary">Your Lucid Score</span>
              <span className="text-foreground-tertiary">•</span>
              <span className="text-foreground">{assessmentResult.archetype}</span>
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border border-foreground-tertiary flex items-start justify-center p-2">
            <motion.div
              className="w-1 h-2 bg-foreground-tertiary rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* The Problem */}
      <section className="py-24 px-6 bg-background-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-foreground-secondary text-lg mb-8"
          >
            Here's the thing.
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-6"
          >
            The only thing between you and the life you want is the story you keep telling yourself.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-foreground-secondary max-w-2xl mx-auto"
          >
            Lucid helps you see that story clearly. And then write a new one.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-accent-primary font-medium mb-4">How it works</p>
            <h2 className="text-3xl font-bold text-foreground">
              Four pillars of transformation
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card card-interactive p-8"
                >
                  <div className="w-12 h-12 mb-6 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                    <Icon size={24} className="text-accent-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Assessment CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative p-12 rounded-3xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20" />
            <div className="absolute inset-0 backdrop-blur-xl" />

            {/* Border */}
            <div className="absolute inset-0 rounded-3xl border border-accent-primary/30" />

            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-background/80 rounded-full text-sm text-foreground-secondary"
              >
                <Target size={16} className="text-accent-primary" />
                Free • 2 minutes • No signup required
              </motion.div>

              <h2 className="text-3xl font-bold text-foreground mb-4">
                What's your Lucid score?
              </h2>
              <p className="text-foreground-secondary mb-8 max-w-xl mx-auto">
                Take the assessment. Get scored across 5 mental dimensions. Find out your archetype. Share with friends.
              </p>

              <button
                onClick={() => setShowAssessment(true)}
                className="btn btn-primary btn-lg animate-glow"
              >
                <Sparkles size={20} className="mr-2" />
                Take the Assessment
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof Placeholder */}
      <section className="py-16 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { number: '12,000+', label: 'Assessments taken' },
              { number: '67', label: 'Average starting score' },
              { number: '+8', label: 'Avg improvement in 30 days' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl font-bold gradient-text">{stat.number}</p>
                <p className="text-sm text-foreground-tertiary mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Get lucid. Or stay lost.
          </h2>
          <p className="text-foreground-secondary mb-8">
            Your call.
          </p>
          <button
            onClick={() => setShowAssessment(true)}
            className="btn btn-primary btn-lg"
          >
            Get Lucid
            <ArrowRight size={20} className="ml-2" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">LUCID</span>
            <span className="text-foreground-tertiary">© 2024</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-foreground-tertiary">
            <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
