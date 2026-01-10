'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    auth,
    onAuthStateChanged,
    User,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logOut,
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    UserProfile
} from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    signInGoogle: () => Promise<void>;
    signInEmail: (email: string, password: string) => Promise<void>;
    signUpEmail: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
    completeOnboarding: (data: {
        name: string;
        currentStruggle?: string;
        desiredOutcome?: string;
    }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user profile
                const userProfile = await getUserProfile(firebaseUser.uid);
                setProfile(userProfile);
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInGoogle = async () => {
        setError(null);
        try {
            const { user: googleUser, error: googleError } = await signInWithGoogle();

            if (googleError) {
                setError(googleError.message);
                return;
            }

            if (googleUser) {
                // Create/get profile
                const userProfile = await createUserProfile(googleUser);
                setProfile(userProfile);
            }
        } catch (err) {
            setError('Failed to sign in with Google');
            console.error(err);
        }
    };

    const signInEmail = async (email: string, password: string) => {
        setError(null);
        try {
            const { user: emailUser, error: emailError } = await signInWithEmail(email, password);

            if (emailError) {
                setError(emailError.message);
                return;
            }

            if (emailUser) {
                const userProfile = await getUserProfile(emailUser.uid);
                setProfile(userProfile);
            }
        } catch (err) {
            setError('Failed to sign in');
            console.error(err);
        }
    };

    const signUpEmail = async (email: string, password: string) => {
        setError(null);
        try {
            const { user: newUser, error: signUpError } = await signUpWithEmail(email, password);

            if (signUpError) {
                setError(signUpError.message);
                return;
            }

            if (newUser) {
                // Create initial profile
                const userProfile = await createUserProfile(newUser);
                setProfile(userProfile);
            }
        } catch (err) {
            setError('Failed to create account');
            console.error(err);
        }
    };

    const logout = async () => {
        setError(null);
        try {
            await logOut();
            setUser(null);
            setProfile(null);
        } catch (err) {
            setError('Failed to log out');
            console.error(err);
        }
    };

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!user) return;

        try {
            await updateUserProfile(user.uid, data);
            setProfile(prev => prev ? { ...prev, ...data } : null);
        } catch (err) {
            setError('Failed to update profile');
            console.error(err);
        }
    };

    const completeOnboarding = async (data: {
        name: string;
        currentStruggle?: string;
        desiredOutcome?: string;
    }) => {
        if (!user) return;

        const onboardingData = {
            name: data.name,
            displayName: data.name,
            onboarding: {
                currentStruggle: data.currentStruggle,
                desiredOutcome: data.desiredOutcome,
            },
        };

        await updateProfile(onboardingData);
    };

    const value = {
        user,
        profile,
        loading,
        error,
        signInGoogle,
        signInEmail,
        signUpEmail,
        logout,
        updateProfile,
        completeOnboarding,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
