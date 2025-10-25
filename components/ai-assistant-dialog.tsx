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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  Wand2,
  FileText,
  Zap,
  Languages,
  CheckCircle2,
  AlertCircle,
  Copy,
  Replace,
  LogIn,
} from 'lucide-react';
import { aiAssistant, AIAction } from '@/lib/ai-assistant';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AIAssistantDialogProps {
  selectedText: string;
  fullContent: string;
  onApply: (text: string) => void;
  children: React.ReactNode;
}

export function AIAssistantDialog({ selectedText, fullContent, onApply, children }: AIAssistantDialogProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState<AIAction>('improve');
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'formal'>('professional');
  const [language, setLanguage] = useState('Spanish');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Update input text when dialog opens
  useEffect(() => {
    if (isOpen) {
      setInputText(selectedText || fullContent);
      setResult('');
      setError('');
    }
  }, [isOpen, selectedText, fullContent]);

  const handleProcess = async () => {
    if (!aiAssistant.isInitialized()) {
      setError('Please configure your API key in settings first');
      return;
    }

    if (!inputText.trim()) {
      setError('Please enter some text to process');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult('');

    try {
      const response = await aiAssistant.processRequest({
        action,
        text: inputText,
        options: {
          tone,
          language,
        },
      });

      if (response.success && response.result) {
        setResult(response.result);
      } else {
        setError(response.error || 'Failed to process request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      setIsOpen(false);
      toast({
        title: 'Applied successfully',
        description: 'The AI-generated text has been applied to your document.',
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: 'Copied to clipboard',
      description: 'The text has been copied to your clipboard.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>AI Writing Assistant</span>
          </DialogTitle>
          <DialogDescription>
            Use AI to improve, summarize, or transform your text
          </DialogDescription>
        </DialogHeader>

        {/* Sign In Required Message */}
        {!user ? (
          <div className="space-y-6 py-8">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Sign In Required</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  AI features require an account. Sign in to use AI-powered writing assistance, auto-complete, and document chat.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/landing');
                  }}
                  className="bg-gradient-to-r from-primary to-purple-600"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In / Sign Up
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Continue Without AI
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
          {/* Action Selection */}
          <Tabs value={action} onValueChange={(v) => setAction(v as AIAction)}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="improve" className="text-xs">
                <Wand2 className="h-3 w-3 mr-1" />
                Improve
              </TabsTrigger>
              <TabsTrigger value="summarize" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Summarize
              </TabsTrigger>
              <TabsTrigger value="fix-grammar" className="text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Fix Grammar
              </TabsTrigger>
              <TabsTrigger value="translate" className="text-xs">
                <Languages className="h-3 w-3 mr-1" />
                Translate
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-4 gap-2 mt-2">
              <Button
                variant={action === 'expand' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAction('expand')}
                className="text-xs"
              >
                <Zap className="h-3 w-3 mr-1" />
                Expand
              </Button>
              <Button
                variant={action === 'simplify' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAction('simplify')}
                className="text-xs"
              >
                Simplify
              </Button>
              <Button
                variant={action === 'change-tone' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAction('change-tone')}
                className="text-xs"
              >
                Change Tone
              </Button>
              <Button
                variant={action === 'complete' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAction('complete')}
                className="text-xs"
              >
                Complete
              </Button>
            </div>
          </Tabs>

          {/* Options */}
          {action === 'change-tone' && (
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {action === 'translate' && (
            <div className="space-y-2">
              <Label>Target Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Portuguese">Portuguese</SelectItem>
                  <SelectItem value="Chinese">Chinese</SelectItem>
                  <SelectItem value="Japanese">Japanese</SelectItem>
                  <SelectItem value="Korean">Korean</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Input Text */}
          <div className="space-y-2">
            <Label>{selectedText ? 'Selected Text' : 'Document Content'}</Label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              className="resize-none"
              placeholder="Enter text to process with AI..."
            />
            {!selectedText && (
              <p className="text-xs text-muted-foreground">
                No text selected. Editing full document content.
              </p>
            )}
          </div>

          {/* Process Button */}
          <Button
            onClick={handleProcess}
            disabled={isProcessing || !inputText.trim()}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </>
            )}
          </Button>

          {/* Error */}
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-2">
              <Label>AI Result</Label>
              <Textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <div className="flex space-x-2">
                <Button onClick={handleApply} className="flex-1">
                  <Replace className="h-4 w-4 mr-2" />
                  {selectedText ? 'Replace Selection' : 'Insert into Document'}
                </Button>
                <Button onClick={handleCopy} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
