import { useState, useEffect, useCallback, useRef } from 'react';
import { getAutoCompleteSuggestion, getAutoCompleteEnabled } from '@/lib/ai-assistant';
import { useAuth } from '@/contexts/auth-context';

interface UseAutoCompleteOptions {
  text: string;
  cursorPosition: number;
  enabled?: boolean;
  debounceMs?: number;
}

export function useAutoComplete({
  text,
  cursorPosition,
  enabled = true,
  debounceMs = 800,
}: UseAutoCompleteOptions) {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();
  const lastFetchTextRef = useRef<string>('');
  const cacheRef = useRef<Map<string, string>>(new Map());

  const fetchSuggestion = useCallback(async () => {
    // Check if user is authenticated
    if (!user) {
      setSuggestion(null);
      return;
    }

    // Check if auto-complete is enabled in settings
    const isEnabled = getAutoCompleteEnabled();
    if (!enabled || !isEnabled) {
      setSuggestion(null);
      return;
    }

    // Don't fetch if we just fetched for the same text
    if (lastFetchTextRef.current === text) {
      return;
    }

    // Check cache first for instant suggestions
    const cacheKey = text.slice(-100); // Cache based on last 100 chars
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      if (cached) {
        setSuggestion(cached);
        return;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    lastFetchTextRef.current = text;
    setIsLoading(true);

    try {
      const result = await getAutoCompleteSuggestion(text, cursorPosition);
      if (result) {
        setSuggestion(result);
        // Cache the result
        cacheRef.current.set(cacheKey, result);
        // Limit cache size
        if (cacheRef.current.size > 20) {
          const firstKey = cacheRef.current.keys().next().value;
          cacheRef.current.delete(firstKey);
        }
      } else {
        setSuggestion(null);
      }
    } catch (error) {
      console.error('Auto-complete error:', error);
      setSuggestion(null);
    } finally {
      setIsLoading(false);
    }
  }, [text, cursorPosition, enabled, user]);

  useEffect(() => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear suggestion immediately when typing
    setSuggestion(null);

    // Don't fetch if text is too short or cursor is not at end
    if (text.length < 10 || cursorPosition !== text.length) {
      return;
    }

    // Don't suggest if last character is punctuation that ends a thought
    const lastChar = text[text.length - 1];
    if (lastChar === '.' || lastChar === '!' || lastChar === '?') {
      return;
    }

    // Don't suggest right after a space (wait for next character)
    if (lastChar === ' ' && text.length > 10) {
      return;
    }

    // Debounce the suggestion fetch
    timeoutRef.current = setTimeout(() => {
      fetchSuggestion();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [text, cursorPosition, debounceMs, fetchSuggestion]);

  const acceptSuggestion = useCallback(() => {
    if (suggestion) {
      const accepted = suggestion;
      setSuggestion(null);
      return accepted;
    }
    return null;
  }, [suggestion]);

  const dismissSuggestion = useCallback(() => {
    setSuggestion(null);
  }, []);

  return {
    suggestion,
    isLoading,
    acceptSuggestion,
    dismissSuggestion,
  };
}
