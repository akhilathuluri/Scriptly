'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageCircle,
  Send,
  Download,
  Sparkles,
  X,
  RotateCcw,
  LogIn,
} from 'lucide-react';
import {
  documentChatbot,
  ChatMessage,
  generateSuggestedQuestions,
} from '@/lib/document-chatbot';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

// Format bot message with markdown-like formatting
const formatBotMessage = (content: string): string => {
  let formatted = content;

  // Convert **bold** to <strong>
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Convert *italic* to <em>
  formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Convert `code` to <code>
  formatted = formatted.replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-primary/10 rounded text-xs">$1</code>');

  // Convert bullet points (*, -, •) to proper list items
  const lines = formatted.split('\n');
  let inList = false;
  const processedLines: string[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check if line is a bullet point
    if (trimmed.match(/^[\*\-•]\s+/)) {
      if (!inList) {
        processedLines.push('<ul class="list-disc pl-5 space-y-1 my-2">');
        inList = true;
      }
      const content = trimmed.replace(/^[\*\-•]\s+/, '');
      processedLines.push(`<li>${content}</li>`);
    }
    // Check if line is a numbered list
    else if (trimmed.match(/^\d+\.\s+/)) {
      if (!inList) {
        processedLines.push('<ol class="list-decimal pl-5 space-y-1 my-2">');
        inList = true;
      }
      const content = trimmed.replace(/^\d+\.\s+/, '');
      processedLines.push(`<li>${content}</li>`);
    }
    // Regular line
    else {
      if (inList) {
        // Check if previous list was ul or ol
        const lastListTag = processedLines[processedLines.length - 1].includes('<li>') ?
          (processedLines.find(l => l.includes('<ul')) ? '</ul>' : '</ol>') : '';
        if (lastListTag) processedLines.push(lastListTag);
        inList = false;
      }

      // Add line breaks for non-empty lines
      if (trimmed) {
        processedLines.push(`<p class="my-2">${line}</p>`);
      } else if (processedLines.length > 0) {
        processedLines.push('<br/>');
      }
    }
  });

  // Close any open list
  if (inList) {
    const lastListTag = processedLines.find(l => l.includes('<ul')) ? '</ul>' : '</ol>';
    processedLines.push(lastListTag);
  }

  formatted = processedLines.join('\n');

  // Convert headings (### Heading)
  formatted = formatted.replace(/^###\s+(.+)$/gm, '<h3 class="font-semibold text-base mt-3 mb-2">$1</h3>');
  formatted = formatted.replace(/^##\s+(.+)$/gm, '<h2 class="font-semibold text-lg mt-3 mb-2">$1</h2>');
  formatted = formatted.replace(/^#\s+(.+)$/gm, '<h1 class="font-bold text-xl mt-3 mb-2">$1</h1>');

  // Convert links [text](url)
  formatted = formatted.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Convert code blocks ```code```
  formatted = formatted.replace(/```(\w+)?\n([\s\S]+?)```/g,
    '<pre class="bg-primary/5 p-3 rounded my-2 overflow-x-auto"><code class="text-xs">$2</code></pre>');

  return formatted;
};

interface DocumentChatbotPanelProps {
  documentId: string;
  documentContent: string;
  documentTitle: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function DocumentChatbotPanel({
  documentId,
  documentContent,
  documentTitle,
  isOpen,
  onToggle,
}: DocumentChatbotPanelProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history when document changes
  useEffect(() => {
    const history = documentChatbot.getChatHistory(documentId);
    setMessages(history);

    // Generate suggested questions if no history
    if (history.length === 0 && documentContent) {
      setSuggestedQuestions(generateSuggestedQuestions(documentContent));
    } else {
      setSuggestedQuestions([]);
    }
  }, [documentId, documentContent]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (message?: string) => {
    const messageToSend = message || input.trim();

    if (!messageToSend || isLoading) return;

    if (!documentChatbot.isInitialized()) {
      setError('Please configure your API key in settings first');
      return;
    }

    setInput('');
    setError('');
    setIsLoading(true);
    setSuggestedQuestions([]);

    try {
      const response = await documentChatbot.sendMessage(
        documentId,
        documentContent,
        messageToSend
      );

      const updatedHistory = documentChatbot.getChatHistory(documentId);
      setMessages(updatedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear all chat history for this document?')) {
      documentChatbot.clearSession(documentId);
      setMessages([]);
      setSuggestedQuestions(generateSuggestedQuestions(documentContent));
    }
  };

  const handleExportChat = () => {
    const chatHistory = documentChatbot.exportChatHistory(documentId);
    const blob = new Blob([chatHistory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${documentTitle}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        title="Open Document Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-background border border-border rounded-lg shadow-2xl flex flex-col z-50 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Document Chat</h3>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
              {documentTitle}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {messages.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportChat}
                className="h-8 w-8 p-0"
                title="Export Chat"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="h-8 w-8 p-0"
                title="Clear Chat"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
            title="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {!user ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sign In Required</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Document chat requires an account. Sign in to ask questions about your documents using AI.
              </p>
            </div>
            <Button
              onClick={() => {
                onToggle();
                router.push('/landing');
              }}
              className="bg-gradient-to-r from-primary to-purple-600"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In / Sign Up
            </Button>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Start a conversation</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Ask me anything about your document!
              </p>
            </div>

            {/* Suggested Questions */}
            {suggestedQuestions.length > 0 && (
              <div className="w-full space-y-2">
                <p className="text-xs text-muted-foreground">Suggested questions:</p>
                {suggestedQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(question)}
                    className="w-full text-left p-3 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  ) : (
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-headings:my-2"
                      dangerouslySetInnerHTML={{ __html: formatBotMessage(message.content) }}
                    />
                  )}
                  <p className="text-xs opacity-70 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 text-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* Input */}
      {user && (
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about this document..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
}
