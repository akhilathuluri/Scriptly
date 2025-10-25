'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { parseMarkdownOptimizedAsync } from '@/lib/markdown-optimized';
import { processMermaidInMarkdown, loadMermaid } from '@/lib/mermaid-renderer';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

// Debounce hook for preview updates
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Virtual scrolling helper - only render visible content
function useVirtualScroll(containerRef: React.RefObject<HTMLDivElement>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    container.addEventListener('scroll', handleScroll, { passive: true });
    resizeObserver.observe(container);
    setContainerHeight(container.clientHeight);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return { scrollTop, containerHeight };
}

export function MarkdownPreviewOptimized({ content, className }: MarkdownPreviewProps) {
  const [html, setHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mermaidLoaded, setMermaidLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Adaptive debounce based on content size
  const debounceDelay = useMemo(() => {
    const length = content.length;
    if (length < 1000) return 150;
    if (length < 10000) return 300;
    if (length < 50000) return 500;
    return 800;
  }, [content.length]);

  const debouncedContent = useDebounce(content, debounceDelay);

  // Load Mermaid on mount
  useEffect(() => {
    loadMermaid().then(setMermaidLoaded);
  }, []);

  // Memoize whether content has mermaid
  const hasMermaid = useMemo(() => {
    return debouncedContent.includes('```mermaid');
  }, [debouncedContent]);

  // Process content with cancellation support
  useEffect(() => {
    if (!debouncedContent.trim()) {
      setHtml('');
      setIsLoading(false);
      setError(null);
      return;
    }

    // Cancel previous parsing
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const currentController = abortControllerRef.current;

    setIsLoading(true);
    setError(null);
    
    const processContent = async () => {
      try {
        let processedContent = debouncedContent;
        
        // Check if cancelled
        if (currentController.signal.aborted) return;
        
        // Process Mermaid diagrams if needed
        if (mermaidLoaded && hasMermaid) {
          processedContent = await processMermaidInMarkdown(debouncedContent);
        }
        
        // Check if cancelled
        if (currentController.signal.aborted) return;
        
        // Parse markdown with async processing (optimized)
        const parsedHtml = await parseMarkdownOptimizedAsync(processedContent);
        
        // Check if cancelled before updating state
        if (!currentController.signal.aborted) {
          setHtml(parsedHtml);
          setIsLoading(false);
        }
      } catch (err) {
        if (!currentController.signal.aborted) {
          console.error('Content processing error:', err);
          setError('Error processing content');
          setHtml('<p class="markdown-error">Error processing content. Please check your markdown syntax.</p>');
          setIsLoading(false);
        }
      }
    };

    // Use requestIdleCallback for non-blocking parsing
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => processContent(), { timeout: 1000 });
    } else {
      setTimeout(processContent, 0);
    }

    return () => {
      currentController.abort();
    };
  }, [debouncedContent, mermaidLoaded, hasMermaid]);

  // Optimize rendering with will-change hint
  const contentStyle = useMemo(() => ({
    willChange: isLoading ? 'contents' : 'auto',
  }), [isLoading]);

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-auto bg-gradient-to-br from-background via-background to-muted/10"
      style={{ contain: 'layout style paint' }} // CSS containment for performance
    >
      <div className="relative">
        <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
          <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border/50">
            <Sparkles className="h-3 w-3" />
            <span>
              {isLoading ? 'Parsing...' : error ? 'Error' : 'Preview'}
              {!isLoading && !error && debouncedContent.length > 10000 && (
                <span className="ml-1 text-primary">
                  ({Math.round(debouncedContent.length / 1000)}k)
                </span>
              )}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "prose prose-sm sm:prose max-w-none p-6 pt-12",
            "prose-headings:font-semibold prose-a:text-primary",
            "prose-pre:bg-muted prose-pre:text-foreground",
            "prose-code:text-foreground prose-img:rounded-lg",
            "prose-table:text-sm",
            isLoading && "opacity-70 transition-opacity",
            className
          )}
          style={contentStyle}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
