'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Book, FileText, Zap, Settings, Mail, Code, Database, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DocumentationPage() {
  const router = useRouter();

  const sections = [
    {
      title: 'Getting Started',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      docs: [
        { title: 'Quick Start Guide', file: 'QUICK_START.md', description: 'Get up and running in 5 minutes' },
        { title: 'Setup Guide', file: 'SETUP.md', description: 'Complete installation instructions' },
        { title: 'Installation', file: 'INSTALL_EMAIL_FEATURE.md', description: 'Install and configure features' },
      ],
    },
    {
      title: 'Features',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      docs: [
        { title: 'Email Feature Guide', file: 'EMAIL_FEATURE_GUIDE.md', description: 'Send documents via email' },
        { title: 'AI Setup Guide', file: 'AI_SETUP_GUIDE.md', description: 'Configure AI features' },
        { title: 'Word Cloud Guide', file: 'WORD_CLOUD_GUIDE.md', description: 'Analyze your writing' },
        { title: 'Mermaid Guide', file: 'MERMAID_GUIDE.md', description: 'Create diagrams' },
      ],
    },
    {
      title: 'Authentication',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      docs: [
        { title: 'Auth Implementation', file: 'AUTH_IMPLEMENTATION_SUMMARY.md', description: 'Authentication system overview' },
        { title: 'Auth README', file: 'README_AUTH.md', description: 'Complete auth guide' },
        { title: 'Supabase Setup', file: 'SUPABASE_SETUP_GUIDE.md', description: 'Database configuration' },
      ],
    },
    {
      title: 'Database',
      icon: Database,
      color: 'from-orange-500 to-red-500',
      docs: [
        { title: 'Supabase Integration', file: 'SUPABASE_INTEGRATION.md', description: 'Database integration guide' },
        { title: 'Email History Schema', file: 'supabase/email_history_schema.sql', description: 'Email tracking table' },
        { title: 'Migration Guide', file: 'supabase/migration_remove_company_key.sql', description: 'Database migrations' },
      ],
    },
    {
      title: 'Development',
      icon: Code,
      color: 'from-indigo-500 to-purple-500',
      docs: [
        { title: 'Implementation Summary', file: 'IMPLEMENTATION_SUMMARY.md', description: 'Technical overview' },
        { title: 'Features List', file: 'FEATURES.md', description: 'All available features' },
        { title: 'Troubleshooting', file: 'TROUBLESHOOTING.md', description: 'Common issues and solutions' },
      ],
    },
    {
      title: 'Email Feature',
      icon: Mail,
      color: 'from-pink-500 to-rose-500',
      docs: [
        { title: 'Email Setup', file: 'EMAIL_SETUP_QUICK_START.md', description: '5-minute email setup' },
        { title: 'Email Installation', file: 'EMAIL_INSTALLATION.md', description: 'Technical installation' },
        { title: 'Email Diagrams', file: 'EMAIL_FEATURE_DIAGRAM.md', description: 'Visual architecture' },
        { title: 'Email Summary', file: 'EMAIL_FEATURE_SUMMARY.md', description: 'Complete overview' },
      ],
    },
  ];

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
              Documentation
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete guides and references for Scriptly
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/guides">
            <div className="p-6 border border-border/50 rounded-lg bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <Book className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Guides</h3>
              <p className="text-sm text-muted-foreground">Step-by-step tutorials</p>
            </div>
          </Link>

          <Link href="/changelog">
            <div className="p-6 border border-border/50 rounded-lg bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <FileText className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">Changelog</h3>
              <p className="text-sm text-muted-foreground">Latest updates</p>
            </div>
          </Link>

          <a href="https://github.com/akhilathuluri/Scriptly" target="_blank" rel="noopener noreferrer">
            <div className="p-6 border border-border/50 rounded-lg bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <Code className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold mb-2">GitHub</h3>
              <p className="text-sm text-muted-foreground">Source code</p>
            </div>
          </a>
        </div>

        {/* Documentation Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center`}>
                  <section.icon className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{section.title}</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.docs.map((doc, docIndex) => (
                  <div
                    key={docIndex}
                    className="p-4 border border-border/50 rounded-lg bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg group cursor-pointer"
                  >
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <FileText className="h-3 w-3 mr-1" />
                      {doc.file}
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
            <h3 className="text-xl font-bold">Need Help?</h3>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Check out these resources:
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <a href="https://github.com/akhilathuluri/Scriptly/issues" target="_blank" rel="noopener noreferrer">
                  Report an Issue
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/akhilathuluri/Scriptly/discussions" target="_blank" rel="noopener noreferrer">
                  Join Discussions
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/guides">
                  View Guides
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
