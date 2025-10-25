'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Eye,
  EyeOff,
  Download,
  FileText,
  Code,
  Maximize2,
  Minimize2,
  List,
  ListOrdered,
  Bold,
  Italic,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote,
  SquareCode,
  Heading1,
  Heading2,
  Strikethrough,
  Zap,
  Sparkles,
  Mail,
} from 'lucide-react';
import { downloadMarkdown } from '@/lib/markdown';
import { ExportDialog } from '@/components/export-dialog';
import { SendEmailDialog } from '@/components/send-email-dialog';
import { MathToolbar } from '@/components/math-toolbar';
import { MermaidToolbar } from '@/components/mermaid-toolbar';
import { AIAssistantDialog } from '@/components/ai-assistant-dialog';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';

interface EditorToolbarProps {
  onInsertText: (before: string, after?: string, placeholder?: string) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  content: string;
  title: string;
  selectedText?: string;
  onReplaceSelection?: (text: string) => void;
  documentId?: string;
}

export function EditorToolbar({
  onInsertText,
  showPreview,
  onTogglePreview,
  isFullscreen,
  onToggleFullscreen,
  content,
  title,
  selectedText = '',
  onReplaceSelection,
  documentId,
}: EditorToolbarProps) {
  const { user } = useAuth();

  const handleEmailClick = (e: Event) => {
    if (!user) {
      e.preventDefault();
      toast.error('Please sign in to send emails', {
        description: 'You need to be signed in to use the email feature',
      });
    }
  };

  const handleInsertMath = (latex: string, inline: boolean = false) => {
    if (inline) {
      onInsertText('$', '$', latex);
    } else {
      onInsertText('\n$$\n', '\n$$\n', latex);
    }
  };

  const handleInsertDiagram = (code: string) => {
    onInsertText('\n```mermaid\n', '\n```\n', code);
  };

  const handleAIReplace = (text: string) => {
    if (onReplaceSelection) {
      onReplaceSelection(text);
    }
  };
  const toolbar = [
    { icon: Heading1, label: 'Heading 1', action: () => onInsertText('# ', '', 'Heading') },
    { icon: Heading2, label: 'Heading 2', action: () => onInsertText('## ', '', 'Heading') },
    { icon: Bold, label: 'Bold', action: () => onInsertText('**', '**', 'bold text') },
    { icon: Italic, label: 'Italic', action: () => onInsertText('*', '*', 'italic text') },
    { icon: Strikethrough, label: 'Strikethrough', action: () => onInsertText('~~', '~~', 'text') },
    { icon: Quote, label: 'Quote', action: () => onInsertText('> ', '', 'quote') },
    { icon: SquareCode, label: 'Inline Code', action: () => onInsertText('`', '`', 'code') },
    { icon: Code, label: 'Code Block', action: () => onInsertText('```\n', '\n```', 'code') },
    { icon: LinkIcon, label: 'Link', action: () => onInsertText('[', '](url)', 'link text') },
    { icon: ImageIcon, label: 'Image', action: () => onInsertText('![', '](url)', 'alt text') },
    { icon: List, label: 'Bullet List', action: () => onInsertText('- ', '', 'item') },
    { icon: ListOrdered, label: 'Numbered List', action: () => onInsertText('1. ', '', 'item') },
  ];

  return (
    <div className="flex items-center gap-2 p-4 border-b bg-gradient-to-r from-background to-muted/20 backdrop-blur-sm flex-wrap shadow-premium">
      <div className="flex items-center gap-1 overflow-x-auto pb-1 flex-1">
        
        {toolbar.map((item, idx) => (
          <Button
            key={idx}
            variant="ghost"
            size="sm"
            onClick={item.action}
            className="h-9 w-9 p-0 shrink-0 hover:bg-accent/50 transition-all duration-200 hover:scale-105 shadow-premium"
            title={item.label}
          >
            <item.icon className="h-4 w-4" />
          </Button>
        ))}
        
        {/* Math Toolbar */}
        <MathToolbar onInsertMath={handleInsertMath} />
        
        {/* Mermaid Toolbar */}
        <MermaidToolbar onInsertDiagram={handleInsertDiagram} />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* AI Assistant */}
        <AIAssistantDialog 
          selectedText={selectedText}
          fullContent={content}
          onApply={handleAIReplace}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-4 hover:bg-accent/50 transition-all duration-200 hover:scale-105"
            title={!user ? "Sign in to use AI features" : "AI Writing Assistant"}
          >
            <Sparkles className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline font-medium">AI</span>
            {!user && <span className="ml-1 text-xs opacity-60">🔒</span>}
          </Button>
        </AIAssistantDialog>

        <Button
          variant="ghost"
          size="sm"
          onClick={onTogglePreview}
          className="h-9 px-4 hover:bg-accent/50 transition-all duration-200 hover:scale-105"
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="ml-2 hidden sm:inline font-medium">{showPreview ? 'Hide' : 'Show'} Preview</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 px-4 hover:bg-accent/50 transition-all duration-200 hover:scale-105"
            >
              <Download className="h-4 w-4" />
              <span className="ml-2 hidden sm:inline font-medium">Export</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-sm border-border/50 shadow-premium-lg">
            <DropdownMenuItem 
              onClick={() => downloadMarkdown(content, title)}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Download Markdown
            </DropdownMenuItem>
            <ExportDialog content={content} title={title}>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onSelect={(e) => e.preventDefault()}
              >
                <Code className="h-4 w-4 mr-2" />
                Enhanced Export...
              </DropdownMenuItem>
            </ExportDialog>
            {user ? (
              <SendEmailDialog content={content} title={title} documentId={documentId}>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send via Email
                </DropdownMenuItem>
              </SendEmailDialog>
            ) : (
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-accent/50 transition-colors opacity-60"
                onSelect={handleEmailClick}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send via Email 🔒
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFullscreen}
          className="h-9 w-9 p-0 hover:bg-accent/50 transition-all duration-200 hover:scale-105"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}