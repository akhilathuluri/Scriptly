'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getUserSettings, updateUserSettings } from '@/lib/database';
import {
  saveAPIKey,
  getAPIKey,
  removeAPIKey,
  setAutoCompleteEnabled,
  getAutoCompleteEnabled,
  aiAssistant,
} from '@/lib/ai-assistant';
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Key,
  Sparkles,
  Palette,
  Save,
  Loader2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // AI Settings
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [autoCompleteEnabled, setAutoCompleteEnabledState] = useState(false);

  // Editor Settings
  const [autoSave, setAutoSave] = useState(true);
  const [showPreview, setShowPreviewState] = useState(true);
  const [editorFontSize, setEditorFontSize] = useState(14);
  const [editorLineHeight, setEditorLineHeight] = useState(1.6);

  const [saving, setSaving] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/landing');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;

    try {
      // Load AI settings
      const savedKey = getAPIKey();
      const autoComplete = getAutoCompleteEnabled();
      
      setApiKey(savedKey || '');
      setAutoCompleteEnabledState(autoComplete);

      // Load user settings from database
      const settings = await getUserSettings(user.id);
      if (settings) {
        setAutoSave(settings.auto_save);
        setShowPreviewState(settings.show_preview);
        setEditorFontSize(settings.editor_font_size);
        setEditorLineHeight(settings.editor_line_height);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSaveAISettings = async () => {
    setSaving(true);
    try {
      if (!apiKey.trim()) {
        toast({
          title: 'Error',
          description: 'Please enter a valid API key.',
          variant: 'destructive',
        });
        setSaving(false);
        return;
      }
      
      saveAPIKey(apiKey);
      setAutoCompleteEnabled(autoCompleteEnabled);

      toast({
        title: 'Settings saved',
        description: 'Your AI settings have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEditorSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await updateUserSettings(user.id, {
        auto_save: autoSave,
        show_preview: showPreview,
        editor_font_size: editorFontSize,
        editor_line_height: editorLineHeight,
      });

      toast({
        title: 'Settings saved',
        description: 'Your editor settings have been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveAPIKey = () => {
    removeAPIKey();
    setApiKey('');
    toast({
      title: 'API key removed',
      description: 'Your API key has been removed.',
    });
  };

  if (loading || loadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isConfigured = aiAssistant.isInitialized();

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
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your preferences</p>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="ai" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Settings
            </TabsTrigger>
            <TabsTrigger value="editor">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* AI Settings Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>AI Assistant Configuration</CardTitle>
                <CardDescription>
                  Configure your Google Gemini API key for AI features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                )}

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

                {/* Save Button */}
                <div className="flex justify-between pt-4 border-t">
                  <div>
                    {apiKey && (
                      <Button variant="destructive" onClick={handleRemoveAPIKey}>
                        Remove API Key
                      </Button>
                    )}
                  </div>
                  <Button onClick={handleSaveAISettings} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save AI Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Editor Settings Tab */}
          <TabsContent value="editor" className="space-y-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Editor Preferences</CardTitle>
                <CardDescription>
                  Customize your editing experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto Save */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base">Auto Save</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save your documents as you type
                    </p>
                  </div>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                  />
                </div>

                {/* Show Preview */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base">Show Preview by Default</Label>
                    <p className="text-sm text-muted-foreground">
                      Display the preview pane when opening documents
                    </p>
                  </div>
                  <Switch
                    checked={showPreview}
                    onCheckedChange={setShowPreviewState}
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <Label htmlFor="fontSize">Editor Font Size</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="fontSize"
                      type="number"
                      min="10"
                      max="24"
                      value={editorFontSize}
                      onChange={(e) => setEditorFontSize(parseInt(e.target.value))}
                      className="w-24"
                    />
                    <span className="text-sm text-muted-foreground">px</span>
                  </div>
                </div>

                {/* Line Height */}
                <div className="space-y-2">
                  <Label htmlFor="lineHeight">Editor Line Height</Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id="lineHeight"
                      type="number"
                      min="1.0"
                      max="2.5"
                      step="0.1"
                      value={editorLineHeight}
                      onChange={(e) => setEditorLineHeight(parseFloat(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleSaveEditorSettings} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Editor Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Selection */}
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                        theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-sm font-medium">Light</span>
                    </button>

                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                        theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-sm font-medium">Dark</span>
                    </button>

                    <button
                      onClick={() => setTheme('system')}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                        theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Monitor className="h-6 w-6" />
                      <span className="text-sm font-medium">System</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
