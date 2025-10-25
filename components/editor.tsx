'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

export function Editor({ content, onChange, title, documentId }: EditorProps) {
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize AI Assistant, KaTeX, Mermaid, and Chatbot on mount
  useEffect(() => {
    initializeAIAssistant();
    loadKaTeX();
    loadMermaid();
    initializeChatbot();
  }, []);

  const insertText = useCallback((before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    const newText = content.substring(0, start) + before + textToInsert + after + content.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [content, onChange]);

  const handleReplaceSelection = useCallback((newText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updatedContent = content.substring(0, start) + newText + content.substring(end);

    onChange(updatedContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [content, onChange]);

  const handleTextSelection = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    setSelectedText(selected);
  }, [content]);

  const placeholder = `Start writing your markdown here...

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

> Start writing your thoughts and ideas!`;

  return (
    <div className={`flex flex-col h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
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
          <div className={`h-full border-r border-border/50 ${showPreview ? '' : 'md:col-span-2'}`}>
            <EditorTextareaOptimized
              ref={textareaRef}
              value={content}
              onChange={onChange}
              placeholder={placeholder}
              onSelect={handleTextSelection}
            />
          </div>

          {showPreview && (
            <MarkdownPreviewOptimized content={content} />
          )}
        </div>
      </div>
    </div>
  );
}
