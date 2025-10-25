'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Tag, Sparkles, Bug, Zap, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ChangelogPage() {
  const router = useRouter();

  const releases = [
    {
      version: '2.0.0',
      date: 'October 5, 2025',
      title: 'Major Update - Scriptly Rebranding',
      type: 'major',
      changes: [
        { type: 'feature', text: 'Rebranded to Scriptly - Open Source Edition' },
        { type: 'feature', text: 'Email sending feature with SMTP support' },
        { type: 'feature', text: 'Send documents via email with attachments (.md, .html)' },
        { type: 'feature', text: 'Email history tracking in Supabase' },
        { type: 'improvement', text: 'Simplified API key management (user keys only)' },
        { type: 'improvement', text: 'GitHub integration with repository links' },
        { type: 'improvement', text: 'Enhanced open source branding' },
        { type: 'fix', text: 'Removed company API key dependency' },
      ],
    },
    {
      version: '1.5.0',
      date: 'September 28, 2025',
      title: 'AI Auto-Complete & Performance',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'AI-powered auto-complete suggestions' },
        { type: 'feature', text: 'Real-time writing assistance' },
        { type: 'improvement', text: 'Faster markdown rendering' },
        { type: 'improvement', text: 'Optimized AI response times' },
        { type: 'fix', text: 'Fixed auto-save conflicts' },
      ],
    },
    {
      version: '1.4.0',
      date: 'September 15, 2025',
      title: 'Document Chatbot',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'AI chatbot for document assistance' },
        { type: 'feature', text: 'Context-aware suggestions' },
        { type: 'feature', text: 'Chat history persistence' },
        { type: 'improvement', text: 'Better AI prompt engineering' },
      ],
    },
    {
      version: '1.3.0',
      date: 'September 1, 2025',
      title: 'Visualization Features',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'Word cloud visualization' },
        { type: 'feature', text: 'Mermaid diagram support (10+ types)' },
        { type: 'feature', text: 'Math equation rendering with KaTeX' },
        { type: 'improvement', text: 'Enhanced export options' },
      ],
    },
    {
      version: '1.2.0',
      date: 'August 20, 2025',
      title: 'Authentication & Storage',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'User authentication with Supabase' },
        { type: 'feature', text: 'Cloud document storage' },
        { type: 'feature', text: 'Folder organization' },
        { type: 'feature', text: 'Document versioning' },
        { type: 'security', text: 'Row Level Security (RLS) policies' },
      ],
    },
    {
      version: '1.1.0',
      date: 'August 5, 2025',
      title: 'AI Writing Assistant',
      type: 'minor',
      changes: [
        { type: 'feature', text: 'AI-powered writing improvements' },
        { type: 'feature', text: 'Text summarization' },
        { type: 'feature', text: 'Grammar correction' },
        { type: 'feature', text: 'Tone adjustment' },
        { type: 'feature', text: 'Multi-language translation' },
      ],
    },
    {
      version: '1.0.0',
      date: 'July 15, 2025',
      title: 'Initial Release',
      type: 'major',
      changes: [
        { type: 'feature', text: 'Real-time markdown preview' },
        { type: 'feature', text: 'Split-pane editor' },
        { type: 'feature', text: 'Syntax highlighting' },
        { type: 'feature', text: 'Export to HTML and PDF' },
        { type: 'feature', text: 'Dark mode support' },
        { type: 'feature', text: 'Responsive design' },
      ],
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'feature':
        return <Sparkles className="h-4 w-4 text-green-600" />;
      case 'improvement':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'fix':
        return <Bug className="h-4 w-4 text-orange-600" />;
      case 'security':
        return <Shield className="h-4 w-4 text-purple-600" />;
      default:
        return <Tag className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      major: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      minor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      patch: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return colors[type as keyof typeof colors] || colors.minor;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/landing')}
            className="hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Changelog
            </h1>
            <p className="text-lg text-muted-foreground">
              Track all updates, new features, and improvements to Scriptly
            </p>
          </div>
        </div>

        {/* Releases */}
        <div className="space-y-8">
          {releases.map((release, index) => (
            <div
              key={release.version}
              className="border border-border/50 rounded-lg p-6 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
            >
              {/* Release Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">v{release.version}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(release.type)}`}>
                      {release.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-foreground">{release.title}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {release.date}
                  </div>
                </div>
              </div>

              {/* Changes */}
              <div className="space-y-2">
                {release.changes.map((change, changeIndex) => (
                  <div key={changeIndex} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                    {getTypeIcon(change.type)}
                    <span className="text-sm text-muted-foreground flex-1">{change.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Want to contribute? Check out our{' '}
            <a
              href="https://github.com/akhilathuluri/Scriptly"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              GitHub repository
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
