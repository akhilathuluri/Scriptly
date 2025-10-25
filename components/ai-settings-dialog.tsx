'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Key, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  saveAPIKey,
  getAPIKey,
  removeAPIKey,
  setAutoCompleteEnabled,
  getAutoCompleteEnabled,
  aiAssistant,
} from '@/lib/ai-assistant';
import { useToast } from '@/hooks/use-toast';

interface AISettingsDialogProps {
  children: React.ReactNode;
}

export function AISettingsDialog({ children }: AISettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [autoCompleteEnabled, setAutoCompleteEnabledState] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      const savedKey = getAPIKey();
      const autoComplete = getAutoCompleteEnabled();
      setApiKey(savedKey || '');
      setAutoCompleteEnabledState(autoComplete);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key.',
        variant: 'destructive',
      });
      return;
    }
    
    saveAPIKey(apiKey);
    
    toast({
      title: 'Settings saved',
      description: 'Your API key has been saved securely.',
    });
    
    // Save auto-complete preference
    setAutoCompleteEnabled(autoCompleteEnabled);
    
    setIsOpen(false);
  };

  const handleRemove = () => {
    removeAPIKey();
    setApiKey('');
    toast({
      title: 'API key removed',
      description: 'Your API key has been removed.',
    });
  };

  const isConfigured = aiAssistant.isInitialized();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>AI Assistant Settings</span>
          </DialogTitle>
          <DialogDescription>
            Configure your Google Gemini API key to use AI features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status */}
          <div className={`flex items-center space-x-2 p-3 rounded-lg ${
            isConfigured ? 'bg-green-50 dark:bg-green-950' : 'bg-yellow-50 dark:bg-yellow-950'
          }`}>
            {isConfigured ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  AI Assistant is configured and ready
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                  AI Assistant requires configuration
                </span>
              </>
            )}
          </div>

          {/* Auto-Complete Option */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-purple-600/5">
            <div className="space-y-1">
              <Label className="text-base flex items-center space-x-2">
                <span>AI Auto-Complete</span>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-normal">NEW</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Get AI-powered suggestions as you type (requires API key)
              </p>
            </div>
            <Switch
              checked={autoCompleteEnabled}
              onCheckedChange={setAutoCompleteEnabledState}
              disabled={!isConfigured}
            />
          </div>

          {/* API Key */}
          <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">Your Google Gemini API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="api-key"
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers
                </p>
              </div>

              {/* Get API Key Instructions */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">How to get your API key:</span>
                </div>
                <ol className="text-sm text-muted-foreground space-y-2 ml-6 list-decimal">
                  <li>Visit Google AI Studio</li>
                  <li>Sign in with your Google account</li>
                  <li>Click "Get API Key" in the top right</li>
                  <li>Create a new API key or use an existing one</li>
                  <li>Copy and paste it above</li>
                </ol>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Open Google AI Studio
                </Button>
              </div>
            </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {apiKey && (
                <Button variant="destructive" onClick={handleRemove}>
                  Remove API Key
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
