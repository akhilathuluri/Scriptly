'use client';

import { useMemo } from 'react';
import { calculateWordCount, formatReadingTime, WordCountStats } from '@/lib/word-count';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FileText, Clock, Type, Hash } from 'lucide-react';

interface WordCountDisplayProps {
  content: string;
}

export function WordCountDisplay({ content }: WordCountDisplayProps) {
  const stats = useMemo(() => calculateWordCount(content), [content]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center space-x-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors">
          <FileText className="h-4 w-4" />
          <span className="font-medium">{stats.words} words</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-3">Document Statistics</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <StatItem
              icon={<Type className="h-4 w-4" />}
              label="Words"
              value={stats.words.toLocaleString()}
            />
            <StatItem
              icon={<Hash className="h-4 w-4" />}
              label="Characters"
              value={stats.characters.toLocaleString()}
            />
            <StatItem
              icon={<Hash className="h-4 w-4" />}
              label="No Spaces"
              value={stats.charactersNoSpaces.toLocaleString()}
            />
            <StatItem
              icon={<Clock className="h-4 w-4" />}
              label="Reading Time"
              value={formatReadingTime(stats.readingTime)}
            />
          </div>

          <div className="pt-3 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sentences</span>
              <span className="font-medium">{stats.sentences}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Paragraphs</span>
              <span className="font-medium">{stats.paragraphs}</span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="flex flex-col space-y-1 p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center space-x-2 text-muted-foreground">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
