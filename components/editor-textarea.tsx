'use client';

import { forwardRef, useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Palette, Sparkles } from 'lucide-react';
import { useAutoComplete } from '@/hooks/use-auto-complete';

interface EditorTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSelect?: () => void;
}

export const EditorTextarea = forwardRef<HTMLTextAreaElement, EditorTextareaProps>(
  ({ value, onChange, placeholder, onSelect }, ref) => {
    const [cursorPosition, setCursorPosition] = useState(0);
    const [showSuggestion, setShowSuggestion] = useState(true);

    const { suggestion, isLoading, acceptSuggestion, dismissSuggestion } = useAutoComplete({
      text: value,
      cursorPosition,
      enabled: showSuggestion,
    });

    // Update cursor position
    const handleTextareaChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      setCursorPosition(e.target.selectionStart);
    }, [onChange]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Accept suggestion with Tab key
      if (e.key === 'Tab' && suggestion) {
        e.preventDefault();
        const accepted = acceptSuggestion();
        if (accepted) {
          onChange(value + ' ' + accepted);
          // Update cursor position after accepting
          setTimeout(() => {
            const textarea = (ref as any)?.current;
            if (textarea) {
              const newPos = value.length + accepted.length + 1;
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
    }, [suggestion, acceptSuggestion, dismissSuggestion, value, onChange, ref]);

    const handleCursorChange = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement;
      setCursorPosition(target.selectionStart);
      onSelect?.();
    }, [onSelect]);

    return (
      <div className="h-full relative">
        <div className="h-full relative">
          <Textarea
            ref={ref}
            value={value}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            onSelect={handleCursorChange}
            onMouseUp={handleCursorChange}
            onKeyUp={handleCursorChange}
            placeholder={placeholder}
            className="h-full resize-none border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono text-sm leading-relaxed p-6 bg-background/50 backdrop-blur-sm placeholder:text-muted-foreground/50"
          />
          
          {/* Auto-complete suggestion overlay */}
          {suggestion && cursorPosition === value.length && (
            <div className="absolute inset-0 p-6 pointer-events-none overflow-hidden">
              <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {/* Invisible text to position suggestion */}
                <span className="invisible">{value}</span>
                {/* Visible suggestion */}
                <span className="text-muted-foreground/50 italic bg-muted-foreground/5 px-1 rounded">
                  {suggestion}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
          {isLoading && (
            <div className="flex items-center space-x-1 text-xs text-primary bg-primary/10 backdrop-blur-sm px-2 py-1 rounded-md border border-primary/20 animate-pulse">
              <Sparkles className="h-3 w-3" />
              <span>AI thinking...</span>
            </div>
          )}
          {suggestion && !isLoading && (
            <div className="flex items-center space-x-1 text-xs text-primary bg-primary/10 backdrop-blur-sm px-2 py-1 rounded-md border border-primary/20">
              <Sparkles className="h-3 w-3" />
              <span>Tab to accept • Esc to dismiss</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md border border-border/50">
            <Palette className="h-3 w-3" />
            <span>{value.length} chars</span>
          </div>
        </div>
      </div>
    );
  }
);

EditorTextarea.displayName = 'EditorTextarea';
