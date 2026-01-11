'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F1A] to-[#0A0A0A]">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Lucid Logo/Wordmark */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            LUCID
          </h1>
          <p className="text-gray-400 mt-2 text-lg">See yourself clearly.</p>
        </div>

        {/* Hook Statement */}
        <h2 className="text-2xl md:text-4xl font-medium text-white max-w-2xl mb-6">
          Most people have no idea where they actually stand mentally.
        </h2>

        <p className="text-gray-400 text-lg mb-10 max-w-xl">
          Take the Lucid Assessment. Get your score. Understand your patterns. Start becoming who you're meant to be.
        </p>

        {/* Primary CTA */}
        <Link href="/assessment">
          <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl text-lg transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25">
            Get Lucid
          </button>
        </Link>

        {/* Secondary CTA */}
        <Link href="/auth" className="mt-4 text-gray-400 hover:text-white transition">
          Already have an account? Sign in
        </Link>

        {/* Social Proof (optional, add later) */}
        <div className="mt-16 text-gray-500 text-sm">
          Join 10,000+ people working on their mindset
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <h3 className="text-2xl font-semibold text-white text-center mb-12">How Lucid Works</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">

          <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
              1
            </div>
            <h4 className="text-white font-medium mb-2 text-xl">Take the Assessment</h4>
            <p className="text-gray-400 text-sm">Answer 10 questions honestly. No right or wrong answers.</p>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
              2
            </div>
            <h4 className="text-white font-medium mb-2 text-xl">Get Your Score</h4>
            <p className="text-gray-400 text-sm">See where you stand across 10 mental dimensions.</p>
          </div>

          <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
              3
            </div>
            <h4 className="text-white font-medium mb-2 text-xl">Start Growing</h4>
            <p className="text-gray-400 text-sm">Work with Lucid AI to build the mindset you want.</p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-800">
        <p>© 2026 Lucid. All rights reserved.</p>
      </footer>
    </div>
  );
}
