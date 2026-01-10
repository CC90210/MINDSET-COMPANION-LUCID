'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Users, Sparkles, Shield, Zap, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/feed');
    }
  }, [user, loading, router]);

  const features = [
    {
      icon: MessageCircle,
      title: 'Talk to CC',
      description: 'Get sharp, personal insight from an AI that actually gets it. No fluff. No generic advice.',
    },
    {
      icon: Users,
      title: 'Connect with Others',
      description: 'Join a community of people who are leveling up. Share wins. Get accountability.',
    },
    {
      icon: Sparkles,
      title: 'Transform',
      description: "This isn't about motivation. It's about becoming the person you know you can be.",
    },
  ];

  const testimonials = [
    {
      quote: "CC said one thing and it shifted years of stuck thinking. I'm not exaggerating.",
      author: "Alex M.",
    },
    {
      quote: "Finally a community that's not toxic positivity or pessimistic realism. It's real.",
      author: "Jordan K.",
    },
    {
      quote: "The daily check-ins have changed how I show up. Simple but powerful.",
      author: "Sam T.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/5 via-transparent to-transparent" />

        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent-secondary/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center"
            style={{
              boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
            }}
          >
            <span className="text-3xl font-bold text-white">CC</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
          >
            The only thing between you and the life you want is the
            <span className="text-gradient"> story you keep telling yourself.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl text-foreground-muted mb-10 max-w-2xl mx-auto"
          >
            Meet CC — your AI mindset companion. Get the truth you need to hear.
            Connect with others on the same journey. Become who you're meant to be.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => router.push('/auth')}
              rightIcon={<ArrowRight size={20} />}
              className="w-full sm:w-auto"
            >
              Start Your Journey
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/auth')}
              className="w-full sm:w-auto"
            >
              I Already Have an Account
            </Button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-foreground-subtle flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-foreground-muted rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              This isn't a chatbot. This isn't a forum.
            </h2>
            <p className="text-xl text-foreground-muted">
              It's a third space — where transformation happens.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 bg-background-elevated border border-border rounded-2xl hover:border-accent-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 mb-6 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                    <Icon size={24} className="text-accent-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-foreground-muted">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How CC is Different */}
      <section className="py-24 px-6 bg-background-elevated/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              CC isn't like other AI
            </h2>
            <p className="text-xl text-foreground-muted">
              Built different. Speaks different. Changes things different.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Zap, title: 'Radical brevity', text: 'Says more with less. Every word earns its place.' },
              { icon: Heart, title: 'Earned directness', text: 'Challenges you because it cares. Not to sound smart.' },
              { icon: Sparkles, title: 'Real insight', text: "Sees patterns you can't see. Names what you can't name." },
              { icon: Shield, title: 'Genuinely safe', text: "Crisis-aware. Resource-equipped. Never abandons you." },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-4 p-6 bg-background border border-border rounded-xl"
                >
                  <Icon size={24} className="text-accent-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-foreground-muted text-sm">{item.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-background-elevated border border-border rounded-2xl"
              >
                <p className="text-foreground mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <p className="text-sm text-foreground-muted">— {testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center p-12 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-3xl"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">
            One conversation can change everything.
          </h2>
          <p className="text-foreground-muted mb-8">
            Start for free. No credit card required.
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/auth')}
            rightIcon={<ArrowRight size={20} />}
          >
            Talk to CC
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="text-sm font-bold text-white">CC</span>
            </div>
            <span className="text-foreground-muted">© 2024 CC Mindset</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-foreground-muted">
            <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
