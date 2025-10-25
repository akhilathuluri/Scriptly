'use client';

import { useState, useEffect, useMemo } from 'react';
import { marked } from 'marked';

const markdownText = `# Welcome to Markdown Pro

Write **beautiful** content with ease.

## Features

- Real-time preview
- AI assistance
- Math equations
- Diagrams

> "The best markdown editor I've ever used!"

\`\`\`javascript
const editor = new MarkdownPro();
editor.start();
\`\`\``;

export function TypewriterDemo() {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (currentIndex < markdownText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(markdownText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30); // Typing speed

      return () => clearTimeout(timeout);
    } else {
      // Pause at the end, then restart
      const restartTimeout = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayedText('');
      }, 3000);

      return () => clearTimeout(restartTimeout);
    }
  }, [currentIndex, mounted]);

  const renderedHTML = useMemo(() => {
    if (!mounted || !displayedText) return '';
    try {
      const rawHTML = marked(displayedText) as string;
      return rawHTML;
    } catch (error) {
      return '';
    }
  }, [displayedText, mounted]);

  if (!mounted) {
    return (
      <div className="grid lg:grid-cols-2 gap-6 w-full">
        <div className="relative bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl min-h-[400px]" />
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xl min-h-[400px]" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 w-full">
      {/* Editor Side */}
      <div className="relative bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
        {/* Window Controls */}
        <div className="flex items-center space-x-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-xs text-slate-400 font-mono">document.md</span>
        </div>

        {/* Line Numbers */}
        <div className="absolute left-0 top-[52px] bottom-0 w-12 bg-slate-800/50 border-r border-slate-700 pt-6 text-xs text-slate-500 font-mono">
          {displayedText.split('\n').map((_, i) => (
            <div key={i} className="h-6 leading-6 text-center">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editor Content */}
        <div className="p-6 pl-16 font-mono text-sm min-h-[400px] relative">
          <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">
            {displayedText}
            <span className="inline-block w-0.5 h-5 bg-blue-400 animate-pulse ml-0.5 align-middle" />
          </pre>
        </div>
      </div>

      {/* Preview Side */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xl">
        {/* Window Controls */}
        <div className="flex items-center space-x-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
          <span className="ml-4 text-xs text-slate-500 dark:text-slate-400 font-mono">Preview</span>
        </div>

        {/* Preview Content */}
        <div 
          className="p-6 prose prose-slate dark:prose-invert max-w-none min-h-[400px] overflow-auto"
          dangerouslySetInnerHTML={{ __html: renderedHTML }}
        />
      </div>
    </div>
  );
}
