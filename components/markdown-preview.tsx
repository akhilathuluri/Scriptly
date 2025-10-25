'use client';

import { useState, useEffect } from 'react';
import { parseMarkdownAsync } from '@/lib/markdown';
import { processMermaidInMarkdown, loadMermaid } from '@/lib/mermaid-renderer';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const [html, setHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);

  // Load Mermaid on mount
  useEffect(() => {
    loadMermaid().then(setMermaidLoaded);
  }, []);

  useEffect(() => {
    if (!content.trim()) {
      setHtml('');
      return;
    }

    setIsLoading(true);
    
    // Parse markdown and process Mermaid diagrams
    const processContent = async () => {
      try {
        let processedContent = content;
        
        // First process Mermaid diagrams if loaded and present
        if (mermaidLoaded && content.includes('```mermaid')) {
          processedContent = await processMermaidInMarkdown(content);
        }
        
        // Then parse markdown
        const parsedHtml = await parseMarkdownAsync(processedContent);
        
        setHtml(parsedHtml);
        setIsLoading(false);
      } catch (error) {
        console.error('Content processing error:', error);
        setHtml('<p class="markdown-error">Error processing content.</p>');
        setIsLoading(false);
      }
    };

    processContent();
  }, [content, mermaidLoaded]);

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-background via-background to-muted/10">
      <div className="relative">
        <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border/50">
            <Sparkles className="h-3 w-3" />
            <span>{isLoading ? 'Parsing...' : 'Preview'}</span>
          </div>
        </div>
        <div
          className={cn(
            "prose prose-sm sm:prose max-w-none p-6 pt-12 prose-headings:font-semibold prose-a:text-primary prose-pre:bg-muted prose-pre:text-foreground prose-code:text-foreground animate-fade-in-up",
            className
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
