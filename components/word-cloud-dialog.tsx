'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Cloud, BarChart3, Download, TrendingUp } from 'lucide-react';
import {
  getWordCloudData,
  getTopWords,
  getWordStatistics,
  getWordColor,
  exportWordCloudAsText,
  WordCloudOptions,
} from '@/lib/word-cloud';

interface WordCloudDialogProps {
  content: string;
  children: React.ReactNode;
}

export function WordCloudDialog({ content, children }: WordCloudDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<WordCloudOptions>({
    maxWords: 50,
    minWordLength: 3,
    excludeCommonWords: true,
    caseSensitive: false,
  });

  const wordCloudData = useMemo(() => 
    getWordCloudData(content, options), 
    [content, options]
  );

  const topWords = useMemo(() => 
    getTopWords(content, 20, options), 
    [content, options]
  );

  const statistics = useMemo(() => 
    getWordStatistics(content, options), 
    [content, options]
  );

  const handleExport = () => {
    const text = exportWordCloudAsText(topWords);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'word-cloud.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!content || content.trim().length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Cloud className="h-5 w-5 text-primary" />
            <span>Word Cloud & Analysis</span>
          </DialogTitle>
          <DialogDescription>
            Visualize and analyze the most frequently used words in your document
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="cloud" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cloud">
              <Cloud className="h-4 w-4 mr-2" />
              Word Cloud
            </TabsTrigger>
            <TabsTrigger value="chart">
              <BarChart3 className="h-4 w-4 mr-2" />
              Top Words
            </TabsTrigger>
            <TabsTrigger value="stats">
              <TrendingUp className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          {/* Word Cloud View */}
          <TabsContent value="cloud" className="space-y-4">
            <div className="flex flex-wrap gap-2 p-6 bg-muted/30 rounded-lg min-h-[300px] items-center justify-center">
              {wordCloudData.length === 0 ? (
                <p className="text-muted-foreground">No words to display. Try adjusting the filters.</p>
              ) : (
                wordCloudData.map((word, index) => (
                  <span
                    key={`${word.word}-${index}`}
                    className="inline-block px-2 py-1 hover:scale-110 transition-transform cursor-default"
                    style={{
                      fontSize: `${word.size}px`,
                      color: getWordColor(word.count, wordCloudData[0].count),
                      fontWeight: word.count > wordCloudData[0].count * 0.5 ? 600 : 400,
                    }}
                    title={`${word.word}: ${word.count} times (${word.percentage.toFixed(2)}%)`}
                  >
                    {word.word}
                  </span>
                ))
              )}
            </div>

            {/* Options */}
            <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
              <h4 className="font-semibold text-sm">Display Options</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-words">
                    Max Words: {options.maxWords}
                  </Label>
                  <Slider
                    id="max-words"
                    min={10}
                    max={100}
                    step={10}
                    value={[options.maxWords || 50]}
                    onValueChange={([value]) => setOptions({ ...options, maxWords: value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-length">
                    Min Word Length: {options.minWordLength}
                  </Label>
                  <Slider
                    id="min-length"
                    min={1}
                    max={10}
                    step={1}
                    value={[options.minWordLength || 3]}
                    onValueChange={([value]) => setOptions({ ...options, minWordLength: value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="exclude-common">Exclude Common Words</Label>
                <Switch
                  id="exclude-common"
                  checked={options.excludeCommonWords}
                  onCheckedChange={(checked) => setOptions({ ...options, excludeCommonWords: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="case-sensitive">Case Sensitive</Label>
                <Switch
                  id="case-sensitive"
                  checked={options.caseSensitive}
                  onCheckedChange={(checked) => setOptions({ ...options, caseSensitive: checked })}
                />
              </div>
            </div>
          </TabsContent>

          {/* Top Words Chart */}
          <TabsContent value="chart" className="space-y-4">
            <div className="space-y-2">
              {topWords.map((word, index) => (
                <div key={word.word} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-muted-foreground w-8">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{word.word}</span>
                      <span className="text-sm text-muted-foreground">
                        {word.count} times ({word.percentage.toFixed(2)}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(word.count / topWords[0].count) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleExport} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export as Text
            </Button>
          </TabsContent>

          {/* Statistics */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard
                label="Total Words"
                value={statistics.totalWords.toLocaleString()}
                icon="📝"
              />
              <StatCard
                label="Unique Words"
                value={statistics.uniqueWords.toLocaleString()}
                icon="✨"
              />
              <StatCard
                label="Avg Word Length"
                value={`${statistics.averageWordLength} chars`}
                icon="📏"
              />
              <StatCard
                label="Vocabulary Richness"
                value={`${(statistics.vocabularyRichness * 100).toFixed(1)}%`}
                icon="🎯"
              />
            </div>

            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">Longest Word</Label>
                <p className="text-lg font-semibold">{statistics.longestWord || 'N/A'}</p>
              </div>

              {statistics.mostFrequentWord && (
                <div>
                  <Label className="text-sm text-muted-foreground">Most Frequent Word</Label>
                  <p className="text-lg font-semibold">
                    {statistics.mostFrequentWord.word}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({statistics.mostFrequentWord.count} times)
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <h4 className="font-semibold mb-2">What is Vocabulary Richness?</h4>
              <p className="text-sm text-muted-foreground">
                Vocabulary richness measures the diversity of words used in your document. 
                A higher percentage indicates more varied vocabulary. 
                Typical values range from 30-60% for most documents.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="p-4 bg-muted/30 rounded-lg">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <Label className="text-sm text-muted-foreground">{label}</Label>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
