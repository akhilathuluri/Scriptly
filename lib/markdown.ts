// Modular markdown parser with lazy loading and performance optimizations
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { processMathInMarkdown } from './math-renderer';

// Configuration for markdown parsing
const markdownConfig = {
  breaks: true,
  gfm: true,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true,
};

// Configure marked
marked.setOptions(markdownConfig);

// Performance-optimized markdown parser with lazy loading
class MarkdownParser {
  private parseCache = new Map<string, string>();
  private maxCacheSize = 50;
  private isParsing = false;
  private parseQueue: Array<{ content: string; resolve: (html: string) => void; reject: (error: Error) => void }> = [];

  // Debounced parsing to prevent excessive parsing
  private parseTimeout: NodeJS.Timeout | null = null;

  private async processQueue(): Promise<void> {
    if (this.isParsing || this.parseQueue.length === 0) return;
    
    this.isParsing = true;
    
    while (this.parseQueue.length > 0) {
      const { content, resolve, reject } = this.parseQueue.shift()!;
      
      try {
        const html = await this.parseMarkdownInternal(content);
        resolve(html);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Parse error'));
      }
    }
    
    this.isParsing = false;
  }

  private async parseMarkdownInternal(content: string): Promise<string> {
    if (typeof window === 'undefined') return '';
    
    // Check cache first
    const cacheKey = this.getCacheKey(content);
    if (this.parseCache.has(cacheKey)) {
      return this.parseCache.get(cacheKey)!;
    }

    try {
      // Process math equations first
      const contentWithMath = processMathInMarkdown(content);
      
      // Parse markdown
      const rawHtml = marked(contentWithMath) as string;
      
      // Sanitize HTML (allow SVG for Mermaid diagrams)
      const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: [
          'target', 'rel', 'class', 'style', 'id', 'viewBox', 'xmlns', 'xmlns:xlink',
          'width', 'height', 'fill', 'stroke', 'stroke-width', 'stroke-dasharray',
          'd', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry',
          'transform', 'text-anchor', 'dominant-baseline', 'alignment-baseline',
          'font-size', 'font-family', 'font-weight', 'font-style',
          'opacity', 'points', 'marker-start', 'marker-end', 'marker-mid',
          'dx', 'dy', 'lengthAdjust', 'textLength'
        ],
        ADD_TAGS: [
          'details', 'summary', 'span', 'div', 
          'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 
          'text', 'tspan', 'defs', 'marker', 'foreignObject', 'clipPath', 'use', 'symbol',
          'title', 'desc', 'style'
        ],
        ALLOW_DATA_ATTR: true,
        ALLOW_UNKNOWN_PROTOCOLS: true,
      });

      // Cache the result
      this.cacheResult(cacheKey, sanitizedHtml);
      
      return sanitizedHtml;
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return '<p class="markdown-error">Error parsing markdown content.</p>';
    }
  }

  private getCacheKey(content: string): string {
    // Simple hash function for cache key
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private cacheResult(key: string, html: string): void {
    // Limit cache size
    if (this.parseCache.size >= this.maxCacheSize) {
      const firstKey = this.parseCache.keys().next().value;
      if (firstKey) {
        this.parseCache.delete(firstKey);
      }
    }
    
    this.parseCache.set(key, html);
  }

  // Public method for parsing markdown with lazy loading
  async parseMarkdown(content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.parseQueue.push({ content, resolve, reject });
      
      // Debounce parsing to batch multiple requests
      if (this.parseTimeout) {
        clearTimeout(this.parseTimeout);
      }
      
      this.parseTimeout = setTimeout(() => {
        this.processQueue();
      }, 16); // ~60fps
    });
  }

  // Synchronous parsing for immediate results (use sparingly)
  parseMarkdownSync(content: string): string {
    if (typeof window === 'undefined') return '';
    
    const cacheKey = this.getCacheKey(content);
    if (this.parseCache.has(cacheKey)) {
      return this.parseCache.get(cacheKey)!;
    }

    try {
      // Process math equations first
      const contentWithMath = processMathInMarkdown(content);
      
      const rawHtml = marked(contentWithMath) as string;
      const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
        ADD_ATTR: [
          'target', 'rel', 'class', 'style', 'id', 'viewBox', 'xmlns', 'xmlns:xlink',
          'width', 'height', 'fill', 'stroke', 'stroke-width', 'stroke-dasharray',
          'd', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'cx', 'cy', 'r', 'rx', 'ry',
          'transform', 'text-anchor', 'dominant-baseline', 'alignment-baseline',
          'font-size', 'font-family', 'font-weight', 'font-style',
          'opacity', 'points', 'marker-start', 'marker-end', 'marker-mid',
          'dx', 'dy', 'lengthAdjust', 'textLength'
        ],
        ADD_TAGS: [
          'details', 'summary', 'span', 'div', 
          'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 
          'text', 'tspan', 'defs', 'marker', 'foreignObject', 'clipPath', 'use', 'symbol',
          'title', 'desc', 'style'
        ],
        ALLOW_DATA_ATTR: true,
        ALLOW_UNKNOWN_PROTOCOLS: true,
      });
      
      this.cacheResult(cacheKey, sanitizedHtml);
      return sanitizedHtml;
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return '<p class="markdown-error">Error parsing markdown content.</p>';
    }
  }

  // Clear cache to free memory
  clearCache(): void {
    this.parseCache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; maxSize: number } {
    return {
      size: this.parseCache.size,
      maxSize: this.maxCacheSize,
    };
  }
}

// Create singleton instance
const markdownParser = new MarkdownParser();

// Export the parser interface
export const parseMarkdown = (content: string): string => {
  return markdownParser.parseMarkdownSync(content);
};

export const parseMarkdownAsync = (content: string): Promise<string> => {
  return markdownParser.parseMarkdown(content);
};

// Export parser instance for advanced usage
export const markdownParserInstance = markdownParser;

// Download functions
export const downloadMarkdown = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadHTML = (content: string, filename: string): void => {
  const html = parseMarkdown(content);
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      max-width: 800px; 
      margin: 40px auto; 
      padding: 0 20px; 
      line-height: 1.6; 
      color: #333;
    }
    .markdown-list { 
      padding-left: 1.5rem; 
      margin: 1rem 0; 
    }
    .markdown-list li { 
      margin: 0.5rem 0; 
    }
    .markdown-task-item { 
      list-style: none; 
      margin-left: -1.5rem; 
    }
    .markdown-code-block { 
      background: #f4f4f4; 
      padding: 16px; 
      border-radius: 6px; 
      overflow-x: auto; 
      margin: 1rem 0;
    }
    .markdown-inline-code { 
      background: #f4f4f4; 
      padding: 2px 6px; 
      border-radius: 3px; 
    }
    .markdown-blockquote { 
      border-left: 4px solid #ddd; 
      margin: 0; 
      padding-left: 16px; 
      color: #666; 
      font-style: italic;
    }
    .markdown-table-wrapper { 
      overflow-x: auto; 
      margin: 1rem 0; 
    }
    .markdown-table { 
      border-collapse: collapse; 
      width: 100%; 
    }
    .markdown-table th, 
    .markdown-table td { 
      border: 1px solid #ddd; 
      padding: 8px 12px; 
      text-align: left; 
    }
    .markdown-table th { 
      background: #f4f4f4; 
      font-weight: 600;
    }
    .markdown-image { 
      max-width: 100%; 
      height: auto; 
      border-radius: 6px;
    }
    .markdown-link { 
      color: #0066cc; 
      text-decoration: none; 
    }
    .markdown-link:hover { 
      text-decoration: underline; 
    }
    .markdown-heading { 
      margin-top: 2rem; 
      margin-bottom: 1rem; 
      font-weight: 600;
    }
    .markdown-h1 { font-size: 2rem; }
    .markdown-h2 { font-size: 1.5rem; }
    .markdown-h3 { font-size: 1.25rem; }
    .markdown-h4 { font-size: 1.125rem; }
    .markdown-h5 { font-size: 1rem; }
    .markdown-h6 { font-size: 0.875rem; }
    .markdown-paragraph { 
      margin: 1rem 0; 
    }
    .markdown-hr { 
      border: none; 
      border-top: 1px solid #ddd; 
      margin: 2rem 0; 
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};