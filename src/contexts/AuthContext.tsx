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
    UserProfile,
    isFirebaseConfigured
} from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    isConfigured: boolean;
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

// Mock user for development
const MOCK_USER = {
    uid: 'mock-user-123',
    email: 'demo@lucid.app',
    displayName: 'Demo User',
    photoURL: null,
} as unknown as User;

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConfigured, setIsConfigured] = useState(true);

    // Listen to auth state changes
    useEffect(() => {
        setIsConfigured(isFirebaseConfigured);

        if (!isFirebaseConfigured || !auth) {
            console.warn('Firebase not configured - using demo mode');
            // Simulate delay to feel like loading
            setTimeout(async () => {
                setUser(MOCK_USER);
                // Also fetch/create profile for mock user
                const userProfile = await getUserProfile(MOCK_USER.uid);
                setProfile(userProfile);
                setLoading(false);
            }, 800);
            return;
        }

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
        if (!isFirebaseConfigured) {
            const { user: googleUser } = await signInWithGoogle();
            if (googleUser) {
                setUser(googleUser);
                const userProfile = await getUserProfile(googleUser.uid);
                setProfile(userProfile);
            }
            return;
        }

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
        if (!isFirebaseConfigured) {
            const { user: emailUser } = await signInWithEmail(email, password);
            if (emailUser) {
                setUser(emailUser);
                const userProfile = await getUserProfile(emailUser.uid);
                setProfile(userProfile);
            }
            return;
        }
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
        if (!isFirebaseConfigured) {
            const { user: newUser } = await signUpWithEmail(email, password);
            if (newUser) {
                setUser(newUser);
                const userProfile = await getUserProfile(newUser.uid);
                setProfile(userProfile);
            }
            return;
        }
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
        if (!isFirebaseConfigured) {
            setUser(null);
            setProfile(null);
            return;
        }
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
        isConfigured, // Exposed for UI to show "Demo Mode" badge if desired
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
