'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { EditorToolbar } from '@/components/editor-toolbar';
import { EditorTextareaOptimized } from '@/components/editor-textarea-optimized';
import { MarkdownPreviewOptimized } from '@/components/markdown-preview-optimized';
import { initializeAIAssistant } from '@/lib/ai-assistant';
import { loadKaTeX } from '@/lib/math-renderer';
import { loadMermaid } from '@/lib/mermaid-renderer';
import { initializeChatbot } from '@/lib/document-chatbot';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  title: string;
  documentId?: string;
}

export function EditorOptimized({ content, onChange, title, documentId }: EditorProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initRef = useRef(false);

  // Initialize heavy libraries only once
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // Use requestIdleCallback for non-critical initialization
    const initLibraries = () => {
      initializeAIAssistant();
      loadKaTeX();
      loadMermaid();
      initializeChatbot();
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(initLibraries, { timeout: 2000 });
    } else {
      setTimeout(initLibraries, 100);
    }
  }, []);

  // Memoize insert text function
  const insertText = useCallback(
    (before: string, after: string = '', placeholder: string = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const textToInsert = selectedText || placeholder;
      const newText =
        content.substring(0, start) +
        before +
        textToInsert +
        after +
        content.substring(end);

      onChange(newText);

      // Use requestAnimationFrame for smooth cursor positioning
      requestAnimationFrame(() => {
        textarea.focus();
        const newCursorPos = start + before.length + textToInsert.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
    },
    [content, onChange]
  );

  const handleReplaceSelection = useCallback(
    (newText: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const updatedContent =
        content.substring(0, start) + newText + content.substring(end);

      onChange(updatedContent);

      requestAnimationFrame(() => {
        textarea.focus();
        const newCursorPos = start + newText.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
    },
    [content, onChange]
  );

  // Throttled text selection handler
  const handleTextSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    
    // Only update if selection changed
    if (selected !== selectedText) {
      setSelectedText(selected);
    }
  }, [content, selectedText]);

  // Memoize placeholder
  const placeholder = useMemo(
    () => `Start writing your markdown here...

# Welcome to your markdown editor

This is a **powerful** and *beautiful* markdown editor with live preview.

## Features
- Live preview
- Export options
- Dark mode support
- Beautiful UI

### Lists
1. Numbered lists work perfectly
2. With proper indentation
3. And nested support

- Bullet lists also work
- With different markers
- And proper spacing

> Start writing your thoughts and ideas!`,
    []
  );

  // Adaptive preview toggle based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowPreview(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={`flex flex-col h-full ${
        isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''
      }`}
    >
      {/* Toolbar */}
      <EditorToolbar
        onInsertText={insertText}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        content={content}
        title={title}
        selectedText={selectedText}
        onReplaceSelection={handleReplaceSelection}
        documentId={documentId}
      />

      {/* Editor and Preview */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-0">
          <div
            className={`h-full border-r border-border/50 ${
              showPreview ? '' : 'md:col-span-2'
            }`}
          >
            <EditorTextareaOptimized
              ref={textareaRef}
              value={content}
              onChange={onChange}
              placeholder={placeholder}
              onSelect={handleTextSelection}
            />
          </div>

          {showPreview && <MarkdownPreviewOptimized content={content} />}
        </div>
      </div>
    </div>
  );
}
