'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Rocket, Mail, Sparkles, Database, Code, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GuidesPage() {
    const router = useRouter();

    const guides = [
        {
            category: 'Getting Started',
            icon: Rocket,
            color: 'from-blue-500 to-cyan-500',
            items: [
                {
                    title: 'Quick Start (5 minutes)',
                    description: 'Get Scriptly up and running in just 5 minutes',
                    difficulty: 'Beginner',
                    time: '5 min',
                    steps: [
                        'Clone the repository',
                        'Install dependencies with npm install',
                        'Copy .env.example to .env.local',
                        'Add your Supabase credentials',
                        'Run npm run dev',
                    ],
                },
                {
                    title: 'First Document',
                    description: 'Create and edit your first markdown document',
                    difficulty: 'Beginner',
                    time: '3 min',
                    steps: [
                        'Sign in to your account',
                        'Click "New Document"',
                        'Start typing in markdown',
                        'See live preview on the right',
                        'Document auto-saves',
                    ],
                },
            ],
        },
        {
            category: 'Email Feature',
            icon: Mail,
            color: 'from-purple-500 to-pink-500',
            items: [
                {
                    title: 'Setup Email Sending',
                    description: 'Configure SMTP to send documents via email',
                    difficulty: 'Intermediate',
                    time: '10 min',
                    steps: [
                        'Run email_history_schema.sql in Supabase',
                        'Get Gmail app password from Google',
                        'Add SMTP credentials to .env.local',
                        'Restart development server',
                        'Test by sending yourself an email',
                    ],
                },
                {
                    title: 'Send Your First Email',
                    description: 'Share documents with others via email',
                    difficulty: 'Beginner',
                    time: '2 min',
                    steps: [
                        'Open a document in the editor',
                        'Click Export → Send via Email',
                        'Enter recipient email address',
                        'Choose attachment format (optional)',
                        'Click Send Email',
                    ],
                },
            ],
        },
        {
            category: 'AI Features',
            icon: Sparkles,
            color: 'from-green-500 to-emerald-500',
            items: [
                {
                    title: 'Setup AI Assistant',
                    description: 'Configure Google Gemini API for AI features',
                    difficulty: 'Beginner',
                    time: '5 min',
                    steps: [
                        'Visit Google AI Studio',
                        'Sign in with Google account',
                        'Generate a free API key',
                        'Open AI Settings in Scriptly',
                        'Paste your API key and save',
                    ],
                },
                {
                    title: 'Using AI Writing Assistant',
                    description: 'Improve your writing with AI',
                    difficulty: 'Beginner',
                    time: '3 min',
                    steps: [
                        'Select text in your document',
                        'Click the AI button in toolbar',
                        'Choose an action (improve, summarize, etc.)',
                        'Review AI suggestions',
                        'Apply or modify as needed',
                    ],
                },
                {
                    title: 'Enable Auto-Complete',
                    description: 'Get AI suggestions as you type',
                    difficulty: 'Beginner',
                    time: '2 min',
                    steps: [
                        'Open AI Settings dialog',
                        'Toggle "AI Auto-Complete" on',
                        'Start typing in the editor',
                        'Press Tab to accept suggestions',
                        'Press Esc to dismiss',
                    ],
                },
            ],
        },
        {
            category: 'Database Setup',
            icon: Database,
            color: 'from-orange-500 to-red-500',
            items: [
                {
                    title: 'Supabase Configuration',
                    description: 'Set up your database and authentication',
                    difficulty: 'Intermediate',
                    time: '15 min',
                    steps: [
                        'Create a Supabase account',
                        'Create a new project',
                        'Run schema.sql in SQL Editor',
                        'Copy project URL and anon key',
                        'Add to .env.local file',
                    ],
                },
                {
                    title: 'Enable Authentication',
                    description: 'Set up user accounts and sign-in',
                    difficulty: 'Intermediate',
                    time: '10 min',
                    steps: [
                        'Ensure Supabase is configured',
                        'Run authentication schema',
                        'Test sign-up flow',
                        'Test sign-in flow',
                        'Verify user in Supabase dashboard',
                    ],
                },
            ],
        },
        {
            category: 'Advanced',
            icon: Code,
            color: 'from-indigo-500 to-purple-500',
            items: [
                {
                    title: 'Custom Themes',
                    description: 'Customize the editor appearance',
                    difficulty: 'Advanced',
                    time: '20 min',
                    steps: [
                        'Open tailwind.config.ts',
                        'Modify color variables',
                        'Update CSS custom properties',
                        'Test in light and dark modes',
                        'Save and restart server',
                    ],
                },
                {
                    title: 'Deploy to Production',
                    description: 'Deploy Scriptly to Vercel or Netlify',
                    difficulty: 'Advanced',
                    time: '30 min',
                    steps: [
                        'Push code to GitHub',
                        'Connect to Vercel/Netlify',
                        'Add environment variables',
                        'Configure build settings',
                        'Deploy and test',
                    ],
                },
            ],
        },
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Intermediate':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Advanced':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="max-w-6xl mx-auto p-6 space-y-8">
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
                            Guides
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Step-by-step tutorials to help you master Scriptly
                        </p>
                    </div>
                </div>

                {/* Quick Navigation */}
                <div className="flex flex-wrap gap-2">
                    {guides.map((guide, index) => (
                        <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const element = document.getElementById(guide.category.toLowerCase().replace(/\s+/g, '-'));
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <guide.icon className="h-4 w-4 mr-2" />
                            {guide.category}
                        </Button>
                    ))}
                </div>

                {/* Guides */}
                <div className="space-y-12">
                    {guides.map((guide, index) => (
                        <div key={index} id={guide.category.toLowerCase().replace(/\s+/g, '-')} className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center`}>
                                    <guide.icon className="h-6 w-6 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold">{guide.category}</h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {guide.items.map((item, itemIndex) => (
                                    <div
                                        key={itemIndex}
                                        className="border border-border/50 rounded-lg p-6 bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between">
                                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                                                    {item.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Settings className="h-3 w-3 mr-1" />
                                                {item.time}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">Steps:</p>
                                            <ol className="space-y-2">
                                                {item.steps.map((step, stepIndex) => (
                                                    <li key={stepIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                                                            {stepIndex + 1}
                                                        </span>
                                                        <span className="flex-1">{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Help Section */}
                <div className="border-t border-border/50 pt-8">
                    <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg p-6 space-y-4">
                        <h3 className="text-xl font-bold">Need More Help?</h3>
                        <p className="text-muted-foreground">
                            Check out our comprehensive documentation or join the community
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Button variant="outline" asChild>
                                <Link href="/documentation">
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Documentation
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <a href="https://github.com/yourusername/Scriptly/discussions" target="_blank" rel="noopener noreferrer">
                                    Join Community
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
