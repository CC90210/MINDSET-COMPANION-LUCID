'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Crown,
    Flame,
    LogOut,
    Camera,
    Edit2,
    Check,
    X,
    ChevronRight,
    Moon,
    Bell,
    Shield,
    CreditCard
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { useUIStore } from '@/lib/store';
import { uploadImage, getFollowerCount, getFollowingCount } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, profile, logout, updateProfile } = useAuth();
    const { theme, setTheme } = useUIStore();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);

    const [editData, setEditData] = useState({
        displayName: profile?.displayName || '',
        bio: profile?.bio || '',
    });

    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            loadFollowCounts();
        }
    }, [user]);

    useEffect(() => {
        if (profile) {
            setEditData({
                displayName: profile.displayName || profile.name,
                bio: profile.bio || '',
            });
        }
    }, [profile]);

    const loadFollowCounts = async () => {
        if (!user) return;
        const [followerCount, followingCount] = await Promise.all([
            getFollowerCount(user.uid),
            getFollowingCount(user.uid),
        ]);
        setFollowers(followerCount);
        setFollowing(followingCount);
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        try {
            const path = `avatars/${user.uid}/${Date.now()}_${file.name}`;
            const url = await uploadImage(file, path);
            await updateProfile({ avatarUrl: url });
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await updateProfile({
                displayName: editData.displayName,
                bio: editData.bio,
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-foreground">Profile</h1>
                    <button
                        onClick={() => setShowSettings(true)}
                        className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-hover transition-colors"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background-elevated border border-border rounded-2xl p-6 mb-6"
                >
                    {/* Avatar and Edit */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="relative">
                            <Avatar
                                src={profile?.avatarUrl}
                                size="xl"
                                className={isUploading ? 'opacity-50' : ''}
                            />
                            <label className="absolute bottom-0 right-0 p-1.5 bg-accent-primary rounded-full cursor-pointer hover:bg-accent-primary-hover transition-colors">
                                <Camera size={14} className="text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {isEditing ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 rounded-lg text-foreground-muted hover:bg-background-hover"
                                >
                                    <X size={18} />
                                </button>
                                <Button
                                    size="sm"
                                    onClick={handleSaveProfile}
                                    isLoading={isSaving}
                                    leftIcon={<Check size={16} />}
                                >
                                    Save
                                </Button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground-muted hover:text-foreground hover:border-border-hover transition-colors"
                            >
                                <Edit2 size={16} />
                                Edit
                            </button>
                        )}
                    </div>

                    {/* Name and Bio */}
                    {isEditing ? (
                        <div className="space-y-4">
                            <Input
                                label="Display Name"
                                value={editData.displayName}
                                onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                                placeholder="Your display name"
                            />
                            <Textarea
                                label="Bio"
                                value={editData.bio}
                                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                placeholder="Tell people about yourself..."
                                rows={3}
                            />
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-foreground mb-1">
                                {profile?.displayName || profile?.name || 'Set your name'}
                            </h2>
                            <p className="text-foreground-muted mb-4">
                                {profile?.bio || 'No bio yet'}
                            </p>
                        </>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 pt-4 border-t border-border mt-4">
                        <div className="text-center">
                            <p className="text-xl font-semibold text-foreground">{followers}</p>
                            <p className="text-sm text-foreground-muted">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-semibold text-foreground">{following}</p>
                            <p className="text-sm text-foreground-muted">Following</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                                <Flame size={18} className="text-orange-500" />
                                <p className="text-xl font-semibold text-foreground">{profile?.streak || 0}</p>
                            </div>
                            <p className="text-sm text-foreground-muted">Day streak</p>
                        </div>
                    </div>

                    {/* Premium Badge */}
                    {profile?.subscriptionTier === 'premium' && (
                        <div className="flex items-center gap-2 mt-4 p-3 bg-accent-primary/10 rounded-xl">
                            <Crown size={18} className="text-accent-primary" />
                            <span className="text-sm font-medium text-accent-primary">Premium Member</span>
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <div className="space-y-2">
                    {profile?.subscriptionTier !== 'premium' && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => router.push('/pricing')}
                            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 rounded-xl hover:border-accent-primary/40 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Crown size={20} className="text-accent-primary" />
                                <div className="text-left">
                                    <p className="font-medium text-foreground">Upgrade to Premium</p>
                                    <p className="text-sm text-foreground-muted">Unlimited messages, full community access</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className="text-foreground-muted" />
                        </motion.button>
                    )}

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-4 rounded-xl text-error hover:bg-error/10 transition-colors"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Settings Modal */}
            <Modal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                title="Settings"
                size="md"
            >
                <div className="p-4 space-y-2">
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-background-hover transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <Moon size={20} className="text-foreground-muted" />
                            <span className="text-foreground">Dark Mode</span>
                        </div>
                        <div className={`w-10 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-accent-primary' : 'bg-border'}`}>
                            <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform ${theme === 'dark' ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                        </div>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-background-hover transition-colors">
                        <div className="flex items-center gap-3">
                            <Bell size={20} className="text-foreground-muted" />
                            <span className="text-foreground">Notifications</span>
                        </div>
                        <ChevronRight size={18} className="text-foreground-muted" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-background-hover transition-colors">
                        <div className="flex items-center gap-3">
                            <Shield size={20} className="text-foreground-muted" />
                            <span className="text-foreground">Privacy</span>
                        </div>
                        <ChevronRight size={18} className="text-foreground-muted" />
                    </button>

                    {profile?.subscriptionTier === 'premium' && (
                        <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-background-hover transition-colors">
                            <div className="flex items-center gap-3">
                                <CreditCard size={20} className="text-foreground-muted" />
                                <span className="text-foreground">Manage Subscription</span>
                            </div>
                            <ChevronRight size={18} className="text-foreground-muted" />
                        </button>
                    )}
                </div>
            </Modal>
        </div>
    );
}
