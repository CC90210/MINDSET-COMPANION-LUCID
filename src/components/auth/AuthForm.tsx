'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { LucidIcon } from '@/components/ui/LucidIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
    onSuccess?: () => void;
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
    const { signInGoogle, signInEmail, signUpEmail, error } = useAuth();

    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (mode === 'signup' && password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            if (mode === 'signup') {
                await signUpEmail(email, password);
            } else {
                await signInEmail(email, password);
            }
            onSuccess?.();
        } catch (err) {
            console.error('Auth error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        try {
            await signInGoogle();
            onSuccess?.();
        } catch (err) {
            console.error('Google auth error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Logo */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <motion.div
                    className="mx-auto mb-4"
                    whileHover={{ scale: 1.05 }}
                >
                    <LucidIcon size={64} className="mx-auto" />
                </motion.div>
                <h1 className="text-2xl font-bold text-foreground">
                    {mode === 'signin' ? 'Welcome back' : 'Join the journey'}
                </h1>
                <p className="text-foreground-muted mt-1">
                    {mode === 'signin'
                        ? 'Ready to keep leveling up?'
                        : 'Start your transformation today'
                    }
                </p>
            </motion.div>

            {/* Error message */}
            {(error || localError) && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 mb-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm"
                >
                    <AlertCircle size={18} />
                    {localError || error}
                </motion.div>
            )}

            {/* Google Sign In */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-4 bg-white text-gray-800 rounded-xl font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                </svg>
                Continue with Google
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-foreground-subtle">or</span>
                <div className="flex-1 h-px bg-border" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
                <Input
                    type="email"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    leftIcon={<Mail size={18} />}
                    required
                />

                <Input
                    type="password"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    leftIcon={<Lock size={18} />}
                    required
                />

                {mode === 'signup' && (
                    <Input
                        type="password"
                        label="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        leftIcon={<Lock size={18} />}
                        required
                    />
                )}

                <Button
                    type="submit"
                    className="w-full"
                    isLoading={isLoading}
                    rightIcon={<ArrowRight size={18} />}
                >
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                </Button>
            </form>

            {/* Toggle mode */}
            <p className="text-center text-sm text-foreground-muted mt-6">
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <button
                    onClick={() => {
                        setMode(mode === 'signin' ? 'signup' : 'signin');
                        setLocalError(null);
                    }}
                    className="text-accent-primary hover:underline font-medium"
                >
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
            </p>
        </div>
    );
}
