// Word cloud generation and analysis module

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface WordCloudOptions {
  maxWords?: number;
  minWordLength?: number;
  excludeCommonWords?: boolean;
  caseSensitive?: boolean;
}

// Common English stop words to exclude
const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'is', 'was', 'are', 'been', 'has', 'had', 'were', 'said', 'did', 'having',
  'may', 'should', 'am', 'being', 'does', 'done', 'doing', 'very', 'much', 'more',
]);

// Clean markdown text for word analysis
const cleanMarkdownText = (text: string): string => {
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]+`/g, '')
    // Remove images
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown symbols
    .replace(/[#*_~`]/g, '')
    // Remove list markers
    .replace(/^\s*[-*+]\s/gm, '')
    .replace(/^\s*\d+\.\s/gm, '')
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, '')
    // Remove email addresses
    .replace(/[\w.-]+@[\w.-]+\.\w+/g, '')
    // Remove numbers
    .replace(/\b\d+\b/g, '')
    // Remove punctuation but keep apostrophes in words
    .replace(/[^\w\s'-]/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

// Generate word frequency map
export const generateWordFrequencies = (
  text: string,
  options: WordCloudOptions = {}
): WordFrequency[] => {
  const {
    maxWords = 50,
    minWordLength = 3,
    excludeCommonWords = true,
    caseSensitive = false,
  } = options;

  if (!text || text.trim().length === 0) {
    return [];
  }

  // Clean the text
  const cleanedText = cleanMarkdownText(text);

  // Split into words
  const words = cleanedText
    .split(/\s+/)
    .filter(word => word.length >= minWordLength)
    .map(word => caseSensitive ? word : word.toLowerCase())
    .filter(word => {
      // Filter out stop words if enabled
      if (excludeCommonWords && STOP_WORDS.has(word.toLowerCase())) {
        return false;
      }
      // Filter out words that are just punctuation
      return /[a-zA-Z]/.test(word);
    });

  // Count word frequencies
  const frequencyMap = new Map<string, number>();
  words.forEach(word => {
    frequencyMap.set(word, (frequencyMap.get(word) || 0) + 1);
  });

  // Calculate total words for percentage
  const totalWords = words.length;

  // Convert to array and sort by frequency
  const frequencies: WordFrequency[] = Array.from(frequencyMap.entries())
    .map(([word, count]) => ({
      word,
      count,
      percentage: (count / totalWords) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxWords);

  return frequencies;
};

// Get word cloud data with size scaling
export const getWordCloudData = (
  text: string,
  options: WordCloudOptions = {}
): Array<WordFrequency & { size: number }> => {
  const frequencies = generateWordFrequencies(text, options);

  if (frequencies.length === 0) {
    return [];
  }

  // Find min and max frequencies for scaling
  const maxCount = frequencies[0].count;
  const minCount = frequencies[frequencies.length - 1].count;
  const range = maxCount - minCount || 1;

  // Scale sizes from 12 to 48 (font sizes)
  return frequencies.map(freq => ({
    ...freq,
    size: 12 + ((freq.count - minCount) / range) * 36,
  }));
};

// Get top N words
export const getTopWords = (
  text: string,
  n: number = 10,
  options: WordCloudOptions = {}
): WordFrequency[] => {
  return generateWordFrequencies(text, { ...options, maxWords: n });
};

// Get word statistics
export interface WordStatistics {
  totalWords: number;
  uniqueWords: number;
  averageWordLength: number;
  longestWord: string;
  mostFrequentWord: WordFrequency | null;
  vocabularyRichness: number; // unique words / total words
}

export const getWordStatistics = (
  text: string,
  options: WordCloudOptions = {}
): WordStatistics => {
  const cleanedText = cleanMarkdownText(text);
  const words = cleanedText.split(/\s+/).filter(w => w.length > 0);
  const frequencies = generateWordFrequencies(text, options);

  const totalWords = words.length;
  const uniqueWords = frequencies.length;
  const averageWordLength = totalWords > 0
    ? words.reduce((sum, word) => sum + word.length, 0) / totalWords
    : 0;
  const longestWord = words.reduce((longest, word) => 
    word.length > longest.length ? word : longest, ''
  );
  const mostFrequentWord = frequencies.length > 0 ? frequencies[0] : null;
  const vocabularyRichness = totalWords > 0 ? uniqueWords / totalWords : 0;

  return {
    totalWords,
    uniqueWords,
    averageWordLength: Math.round(averageWordLength * 10) / 10,
    longestWord,
    mostFrequentWord,
    vocabularyRichness: Math.round(vocabularyRichness * 1000) / 1000,
  };
};

// Generate color for word based on frequency
export const getWordColor = (frequency: number, maxFrequency: number): string => {
  const intensity = frequency / maxFrequency;
  
  if (intensity > 0.7) return 'hsl(221, 83%, 53%)'; // Primary blue
  if (intensity > 0.5) return 'hsl(221, 83%, 60%)'; // Lighter blue
  if (intensity > 0.3) return 'hsl(221, 83%, 70%)'; // Even lighter
  return 'hsl(221, 50%, 75%)'; // Lightest
};

// Export word cloud as text
export const exportWordCloudAsText = (frequencies: WordFrequency[]): string => {
  let output = 'Word Cloud Data\n';
  output += '='.repeat(50) + '\n\n';
  
  frequencies.forEach((freq, index) => {
    output += `${index + 1}. ${freq.word.padEnd(20)} ${freq.count} times (${freq.percentage.toFixed(2)}%)\n`;
  });
  
  return output;
};
