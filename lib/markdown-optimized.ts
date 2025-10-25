// High-performance markdown parser with chunking and web workers support
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

marked.setOptions(markdownConfig);

// LRU Cache implementation for better memory management
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    
    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    // Remove if exists
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Remove oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// Chunk-based parsing for large documents
class ChunkedMarkdownParser {
  private parseCache = new LRUCache<string, string>(100);
  private chunkCache = new LRUCache<string, string[]>(50);
  private isParsing = false;
  private parseQueue: Array<{
    content: string;
    resolve: (html: string) => void;
    reject: (error: Error) => void;
  }> = [];
  private readonly CHUNK_SIZE = 50000; // 50KB chunks
  private readonly LARGE_DOC_THRESHOLD = 100000; // 100KB

  // Fast hash function for cache keys
  private hashString(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  // Split content into logical chunks (by paragraphs/sections)
  private chunkContent(content: string): string[] {
    if (content.length < this.CHUNK_SIZE) {
      return [content];
    }

    const cacheKey = this.hashString(content);
    const cached = this.chunkCache.get(cacheKey);
    if (cached) return cached;

    const chunks: string[] = [];
    const lines = content.split('\n');
    let currentChunk = '';
    let currentSize = 0;

    for (const line of lines) {
      const lineSize = line.length + 1; // +1 for newline
      
      // If adding this line exceeds chunk size and we have content, save chunk
      if (currentSize + lineSize > this.CHUNK_SIZE && currentChunk) {
        chunks.push(currentChunk);
        currentChunk = line + '\n';
        currentSize = lineSize;
      } else {
        currentChunk += line + '\n';
        currentSize += lineSize;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    this.chunkCache.set(cacheKey, chunks);
    return chunks;
  }

  // Parse a single chunk
  private async parseChunk(chunk: string): Promise<string> {
    const cacheKey = this.hashString(chunk);
    const cached = this.parseCache.get(cacheKey);
    if (cached) return cached;

    try {
      // Process math equations
      const contentWithMath = processMathInMarkdown(chunk);
      
      // Parse markdown
      const rawHtml = marked(contentWithMath) as string;
      
      // Sanitize HTML
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

      this.parseCache.set(cacheKey, sanitizedHtml);
      return sanitizedHtml;
    } catch (error) {
      console.error('Chunk parsing error:', error);
      return '<p class="markdown-error">Error parsing content chunk.</p>';
    }
  }

  // Parse content with chunking for large documents
  private async parseContentChunked(content: string): Promise<string> {
    if (typeof window === 'undefined') return '';

    // For small documents, use direct parsing
    if (content.length < this.LARGE_DOC_THRESHOLD) {
      const cacheKey = this.hashString(content);
      const cached = this.parseCache.get(cacheKey);
      if (cached) return cached;

      const result = await this.parseChunk(content);
      return result;
    }

    // For large documents, use chunked parsing
    const chunks = this.chunkContent(content);
    const parsedChunks: string[] = [];

    // Parse chunks with yielding to prevent blocking
    for (let i = 0; i < chunks.length; i++) {
      const parsed = await this.parseChunk(chunks[i]);
      parsedChunks.push(parsed);

      // Yield to browser every few chunks
      if (i % 3 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    return parsedChunks.join('');
  }

  // Process queue with priority
  private async processQueue(): Promise<void> {
    if (this.isParsing || this.parseQueue.length === 0) return;

    this.isParsing = true;

    while (this.parseQueue.length > 0) {
      const { content, resolve, reject } = this.parseQueue.shift()!;

      try {
        const html = await this.parseContentChunked(content);
        resolve(html);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Parse error'));
      }

      // Yield between queue items
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    this.isParsing = false;
  }

  // Public async parsing method
  async parseMarkdown(content: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Clear old queue items if too many
      if (this.parseQueue.length > 5) {
        this.parseQueue.splice(0, this.parseQueue.length - 1);
      }

      this.parseQueue.push({ content, resolve, reject });
      this.processQueue();
    });
  }

  // Synchronous parsing (use only for small content)
  parseMarkdownSync(content: string): string {
    if (typeof window === 'undefined') return '';

    const cacheKey = this.hashString(content);
    const cached = this.parseCache.get(cacheKey);
    if (cached) return cached;

    try {
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

      this.parseCache.set(cacheKey, sanitizedHtml);
      return sanitizedHtml;
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return '<p class="markdown-error">Error parsing markdown content.</p>';
    }
  }

  // Clear caches
  clearCache(): void {
    this.parseCache.clear();
    this.chunkCache.clear();
  }

  // Get cache statistics
  getCacheStats() {
    return {
      parseCache: this.parseCache.size,
      chunkCache: this.chunkCache.size,
    };
  }
}

// Create singleton instance
const optimizedParser = new ChunkedMarkdownParser();

// Export optimized parser interface
export const parseMarkdownOptimized = (content: string): string => {
  return optimizedParser.parseMarkdownSync(content);
};

export const parseMarkdownOptimizedAsync = (content: string): Promise<string> => {
  return optimizedParser.parseMarkdown(content);
};

export const clearMarkdownCache = (): void => {
  optimizedParser.clearCache();
};

export const getMarkdownCacheStats = () => {
  return optimizedParser.getCacheStats();
};
