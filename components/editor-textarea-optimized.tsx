'use client';

import { forwardRef, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Palette, Sparkles } from 'lucide-react';
import { useAutoComplete } from '@/hooks/use-auto-complete';

interface EditorTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelect?: () => void;
}

// Debounce utility for performance
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

// Throttle utility for scroll/selection events
function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

export const EditorTextareaOptimized = forwardRef<HTMLTextAreaElement, EditorTextareaProps>(
  ({ value, onChange, placeholder, onSelect }, ref) => {
    const [cursorPosition, setCursorPosition] = useState(0);
    const [showSuggestion, setShowSuggestion] = useState(true);
    const [localValue, setLocalValue] = useState(value);
    const updateTimeoutRef = useRef<NodeJS.Timeout>();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Debounce expensive operations
    const debouncedValue = useDebounce(localValue, 150);

    // Sync debounced value with parent
    useEffect(() => {
      if (debouncedValue !== value) {
        onChange(debouncedValue);
      }
    }, [debouncedValue]);

    // Sync external changes
    useEffect(() => {
      if (value !== localValue && value !== debouncedValue) {
        setLocalValue(value);
      }
    }, [value]);

    const { suggestion, isLoading, acceptSuggestion, dismissSuggestion } = useAutoComplete({
      text: debouncedValue,
      cursorPosition,
      enabled: showSuggestion && localValue.length < 50000, // Disable for very large docs
    });

    // Optimized change handler with immediate local update
    const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      setCursorPosition(e.target.selectionStart);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Accept suggestion with Tab key
      if (e.key === 'Tab' && suggestion) {
        e.preventDefault();
        const accepted = acceptSuggestion();
        if (accepted) {
          const newValue = localValue + ' ' + accepted;
          setLocalValue(newValue);
          onChange(newValue);
          
          setTimeout(() => {
            const textarea = textareaRef.current || (ref as any)?.current;
            if (textarea) {
              const newPos = newValue.length;
              textarea.setSelectionRange(newPos, newPos);
              setCursorPosition(newPos);
            }
          }, 0);
        }
      }
      // Dismiss suggestion with Escape
      else if (e.key === 'Escape' && suggestion) {
        e.preventDefault();
        dismissSuggestion();
      }
    }, [suggestion, acceptSuggestion, dismissSuggestion, localValue, onChange, ref]);

    // Throttled cursor position updates
    const handleCursorChange = useThrottle(
      useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        setCursorPosition(target.selectionStart);
        onSelect?.();
      }, [onSelect]),
      100
    );

    // Character count with memoization
    const charCount = useMemo(() => localValue.length, [localValue.length]);

    // Combine refs
    useEffect(() => {
      if (ref && typeof ref === 'object') {
        (ref as any).current = textareaRef.current;
      }
    }, [ref]);

    return (
      <div className="h-full relative">
        <div className="h-full relative">
          <Textarea
            ref={textareaRef}
            value={localValue}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onSelect={handleCursorChange}
            onMouseUp={handleCursorChange}
            onKeyUp={handleCursorChange}
            placeholder={placeholder}
            className="h-full resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm leading-relaxed p-6 bg-background/50 backdrop-blur-sm placeholder:text-muted-foreground/50"
            spellCheck={charCount < 10000} // Disable spellcheck for large docs
          />
          
          {/* Auto-complete suggestion overlay - only for small docs */}
          {suggestion && cursorPosition === localValue.length && charCount < 10000 && (
            <div className="absolute inset-0 p-6 pointer-events-none overflow-hidden">
              <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                <span className="invisible">{localValue}</span>
                <span className="text-muted-foreground/50 italic bg-muted-foreground/5 px-1 rounded">
                  {suggestion}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
          {isLoading && charCount < 50000 && (
            <div className="flex items-center space-x-1 text-xs text-primary bg-primary/10 backdrop-blur-sm px-2 py-1 rounded-md border border-primary/20 animate-pulse">
              <Sparkles className="h-3 w-3" />
              <span>AI thinking...</span>
            </div>
          )}
          {suggestion && !isLoading && charCount < 10000 && (
            <div className="flex items-center space-x-1 text-xs text-primary bg-primary/10 backdrop-blur-sm px-2 py-1 rounded-md border border-primary/20">
              <Sparkles className="h-3 w-3" />
              <span>Tab to accept • Esc to dismiss</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border/50">
            <Palette className="h-3 w-3" />
            <span>{charCount.toLocaleString()} chars</span>
          </div>
        </div>
      </div>
    );
  }
);

EditorTextareaOptimized.displayName = 'EditorTextareaOptimized';
