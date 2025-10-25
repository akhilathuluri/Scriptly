'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from '@/lib/database';
import { ArrowLeft, User, Mail, Calendar, Save, Loader2, Upload } from 'lucide-react';

export default function ProfilePage() {
    const { user, profile, loading, refreshProfile } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [fullName, setFullName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/landing');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
        }
    }, [profile]);

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            await updateProfile(user.id, { full_name: fullName });
            await refreshProfile();

            toast({
                title: 'Profile updated',
                description: 'Your profile has been updated successfully.',
            });
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update profile',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || !profile) {
        return null;
    }

    const initials = profile.full_name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || user.email?.[0].toUpperCase() || 'U';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="hover:bg-accent"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Profile</h1>
                        <p className="text-muted-foreground">Manage your account information</p>
                    </div>
                </div>

                {/* Profile Card */}
                <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your profile details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center space-x-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'User'} />
                                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-2xl">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <h3 className="font-semibold">Profile Picture</h3>
                                <p className="text-sm text-muted-foreground">
                                    Upload a new profile picture (coming soon)
                                </p>
                                <Button variant="outline" size="sm" disabled>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Photo
                                </Button>
                            </div>
                        </div>

                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={user.email || ''}
                                    className="pl-10 bg-muted"
                                    disabled
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Email cannot be changed
                            </p>
                        </div>

                        {/* Save Button */}
                        <Button
                            onClick={handleSave}
                            disabled={saving || fullName === profile.full_name}
                            className="w-full sm:w-auto"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Account Information */}
                <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Your account details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-border/50">
                            <div className="flex items-center space-x-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Member Since</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(profile.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-border/50">
                            <div className="flex items-center space-x-3">
                                <User className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">User ID</p>
                                    <p className="text-sm text-muted-foreground font-mono">
                                        {user.id.slice(0, 8)}...
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Email Verified</p>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email_confirmed_at ? 'Yes' : 'No'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/50 shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                        <CardDescription>Irreversible actions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Delete Account</p>
                                <p className="text-sm text-muted-foreground">
                                    Permanently delete your account and all data
                                </p>
                            </div>
                            <Button variant="destructive" disabled>
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
