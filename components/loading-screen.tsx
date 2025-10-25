'use client';

import { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle, Database } from 'lucide-react';
import { storage } from '@/lib/storage';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [loadingText, setLoadingText] = useState('Loading your workspace');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingText('Initializing storage...');
        setProgress(20);

        // Check storage health
        const storageInfo = storage.getStorageInfo();
        if (storageInfo.percentage > 90) {
          console.warn('Storage nearly full:', storageInfo);
        }

        setLoadingText('Loading documents...');
        setProgress(40);

        // Load documents with timeout
        const documentsPromise = storage.getAllDocuments();
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Loading timeout')), 5000)
        );

        const documents = await Promise.race([documentsPromise, timeoutPromise]);
        
        setProgress(60);
        setLoadingText('Preparing editor...');

        // Simulate additional loading time for large datasets
        if (documents.length > 50) {
          setLoadingText('Processing large dataset...');
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        setProgress(80);
        setLoadingText('Finalizing setup...');

        // Small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 200));
        
        setProgress(100);
        setLoadingText('Ready!');
        
        // Complete loading
        setTimeout(onComplete, 300);
        
      } catch (err) {
        console.error('Loading error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoadingText('Error loading workspace');
        
        // Still complete after error to prevent infinite loading
        setTimeout(onComplete, 2000);
      }
    };

    loadData();
  }, [onComplete]);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="flex flex-col items-center space-y-4 animate-fade-in-up max-w-md text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-destructive to-destructive/60 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Loading Error</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <p className="text-xs text-muted-foreground/70">
              The application will continue with limited functionality.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex flex-col items-center space-y-6 animate-fade-in-up">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center animate-pulse-slow">
            <Database className="w-10 h-10 text-primary-foreground" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-primary animate-pulse" />
        </div>
        
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-foreground">{loadingText}</h2>
          <p className="text-sm text-muted-foreground">Preparing your markdown editor...</p>
        </div>

        {/* Progress bar */}
        <div className="w-64 bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-xs text-muted-foreground">
          {progress}% complete
        </div>
      </div>
    </div>
  );
}
