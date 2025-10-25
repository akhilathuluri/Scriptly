// Word count utility module
export interface WordCountStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: number; // in minutes
}

export const calculateWordCount = (text: string): WordCountStats => {
  if (!text || text.trim().length === 0) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      readingTime: 0,
    };
  }

  // Remove markdown syntax for accurate counting
  const cleanText = text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/[#*_~`]/g, '') // Remove markdown symbols
    .replace(/^\s*[-*+]\s/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s/gm, ''); // Remove numbered list markers

  // Count words
  const words = cleanText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;

  // Count characters
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Count sentences (approximate)
  const sentences = cleanText
    .split(/[.!?]+/)
    .filter(sentence => sentence.trim().length > 0).length;

  // Count paragraphs
  const paragraphs = text
    .split(/\n\n+/)
    .filter(para => para.trim().length > 0).length;

  // Calculate reading time (average 200 words per minute)
  const readingTime = Math.ceil(words / 200);

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTime,
  };
};

export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return 'Less than 1 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
};
