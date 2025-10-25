'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SignInDialog } from './sign-in-dialog';
import { SignUpDialog } from './sign-up-dialog';
import { UserMenu } from './user-menu';
import { useAuth } from '@/contexts/auth-context';
import { LogIn, UserPlus } from 'lucide-react';

export function AuthButtons() {
  const { user, loading } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-10 w-20 bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  if (user) {
    return <UserMenu />;
  }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          onClick={() => setShowSignIn(true)}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
        <Button
          onClick={() => setShowSignUp(true)}
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Button>
      </div>

      <SignInDialog
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onSwitchToSignUp={() => {
          setShowSignIn(false);
          setShowSignUp(true);
        }}
      />

      <SignUpDialog
        open={showSignUp}
        onOpenChange={setShowSignUp}
        onSwitchToSignIn={() => {
          setShowSignUp(false);
          setShowSignIn(true);
        }}
      />
    </>
  );
}
