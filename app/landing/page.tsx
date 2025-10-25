'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TypewriterDemo } from '@/components/typewriter-demo';
import { AuthButtons } from '@/components/auth/auth-buttons';
import { AuthCheck } from '@/components/auth/auth-check';
import { StructuredData } from '@/components/structured-data';
import {
  organizationSchema,
  softwareApplicationSchema,
  webApplicationSchema,
  faqSchema,
  howToSchema,
} from '@/app/structured-data';
import {
  FileText,
  Sparkles,
  Cloud,
  MessageCircle,
  Zap,
  TrendingUp,
  Code,
  Download,
  Eye,
  Sigma,
  Network,
  ChevronRight,
  Check,
  ArrowRight,
  Github,
  Twitter,
  Star,
  Users,
  Rocket,
  Shield,
  Palette,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: FileText,
      title: 'Real-time Preview',
      description: 'See your markdown rendered instantly as you type',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Sparkles,
      title: 'AI Writing Assistant',
      description: 'Improve, summarize, auto-complete and transform your text with AI',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Sigma,
      title: 'Math Equations',
      description: 'Beautiful LaTeX math rendering with KaTeX',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Network,
      title: 'Mermaid Diagrams',
      description: '10+ diagram types for visual documentation',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Cloud,
      title: 'Word Cloud',
      description: 'Analyze and visualize your writing patterns',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: MessageCircle,
      title: 'Document Chat',
      description: 'AI chatbot that understands your documents',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: FileText, value: '100K+', label: 'Documents Created' },
    { icon: Star, value: '4.9/5', label: 'User Rating' },
    { icon: Rocket, value: '99.9%', label: 'Uptime' },
  ];

  // FAQ structured data
  const faqData = faqSchema([
    {
      question: 'Is this online markdown editor really free?',
      answer: 'Yes! Scriptly is 100% free and open source. There are no hidden costs, premium tiers, or subscriptions. You get all features for free, forever.',
    },
    {
      question: 'Do I need to install anything?',
      answer: 'No installation required! Our markdown editor works entirely in your web browser. Just sign up and start writing immediately.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. Your documents are stored securely in your own Supabase instance with industry-standard encryption. We never access your private data.',
    },
    {
      question: 'Can I use it offline?',
      answer: "While Scriptly is primarily an online markdown editor, we're working on offline support. Your documents are cached locally for quick access.",
    },
    {
      question: 'What markdown features are supported?',
      answer: 'We support all standard markdown syntax plus advanced features like tables, task lists, footnotes, Mermaid diagrams, LaTeX math, and code syntax highlighting.',
    },
    {
      question: 'Can I export my documents?',
      answer: 'Yes! You can export your markdown documents as PDF, HTML, or download the raw .md files. Your content is never locked in - you own your data.',
    },
  ]);

  // How-to structured data
  const howToData = howToSchema([
    { name: 'Sign Up Free', text: 'Create your free account in seconds with email or social login' },
    { name: 'Start Writing', text: 'Open the editor and start writing in markdown' },
    { name: 'See Live Preview', text: 'Watch your content render in real-time as you type' },
    { name: 'Use AI Features', text: 'Enhance your writing with AI assistance and auto-complete' },
    { name: 'Organize Documents', text: 'Create folders and organize your markdown files' },
    { name: 'Export & Share', text: 'Export to PDF, HTML, or share via email' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Structured Data for Rich Results */}
      <StructuredData
        data={[
          organizationSchema,
          softwareApplicationSchema,
          webApplicationSchema,
          faqData,
          howToData,
        ]}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div
          className="absolute top-0 -left-4 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div
          className="absolute top-0 -right-4 w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div
          className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Scriptly
                </span>
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                  Open Source
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#about" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            </div>

            <div className="flex items-center space-x-4">
              <AuthButtons />
              <Button
                onClick={() => router.push('/editor')}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Launch Editor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 perspective-container">
        <div className="max-w-7xl mx-auto">
          <div
            className="text-center space-y-8 animate-fade-in-up parallax-layer"
            style={{
              transform: `translateX(${mousePosition.x * 0.5}px) translateY(${mousePosition.y * 0.5}px)`,
            }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 animate-slide-in-right">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Open Source • AI-Powered</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Online Markdown Editor
              </span>
              <br />
              <span className="text-foreground">Free & Open Source</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The best free online markdown editor with AI writing assistant, real-time preview,
              and advanced features. Write, edit, and export markdown documents online instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => router.push('/editor')}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-primary/50 group"
              >
                Get Started Free
                <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-2 hover:border-primary hover:bg-primary/5 transform hover:scale-105 transition-all duration-300"
              >
                <Eye className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center space-y-2 animate-fade-in-up card-3d-float transform-gpu hover:scale-110 transition-transform duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationDuration: `${4 + index}s`
                  }}
                >
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center transform-gpu hover:rotate-12 transition-transform duration-300">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section - Why Choose Us */}
      <section id="about" className="py-20 px-6 bg-gradient-to-br from-muted/30 via-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-6 mb-16 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Why Choose Scriptly</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold">
              The Best <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Online Markdown Editor</span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Scriptly is a powerful <strong>online markdown editor</strong> designed for developers, writers, and content creators.
              Fast, reliable, and packed with features you'll love.
            </p>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {[
              {
                icon: Shield,
                title: '100% Free & Open Source',
                description: 'No hidden costs, no subscriptions. Use our markdown editor online completely free forever.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Sparkles,
                title: 'AI Writing Assistant',
                description: 'Improve your writing with AI-powered suggestions, auto-complete, and content transformation.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Zap,
                title: 'Real-Time Preview',
                description: 'See your markdown rendered instantly as you type with our split-pane editor.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Cloud,
                title: 'Cloud Storage',
                description: 'Your documents are automatically saved and synced across all your devices.',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                icon: Code,
                title: 'Advanced Features',
                description: 'Support for Mermaid diagrams, LaTeX math equations, code syntax highlighting, and more.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: Download,
                title: 'Export Options',
                description: 'Export your markdown to PDF, HTML, or download as .md files with one click.',
                color: 'from-pink-500 to-rose-500'
              }
            ].map((benefit, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />

                <div className="relative space-y-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <benefit.icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {benefit.title}
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Use Cases Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Perfect for <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Every Use Case</span>
              </h3>
              <p className="text-lg text-muted-foreground">
                Trusted by thousands of users worldwide
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Code,
                  title: 'For Developers',
                  description: 'Write technical documentation, README files, and code documentation with syntax highlighting.',
                  gradient: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: FileText,
                  title: 'For Writers',
                  description: 'Create blog posts, articles, and content with AI assistance and distraction-free environment.',
                  gradient: 'from-purple-500 to-pink-500'
                },
                {
                  icon: Users,
                  title: 'For Students',
                  description: 'Take notes, write essays, and create study materials with math equation support.',
                  gradient: 'from-green-500 to-emerald-500'
                },
                {
                  icon: TrendingUp,
                  title: 'For Teams',
                  description: 'Collaborate on documentation and maintain consistent formatting across your organization.',
                  gradient: 'from-orange-500 to-red-500'
                }
              ].map((useCase, index) => (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />

                  <div className="relative space-y-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center transform group-hover:scale-110 transition-all duration-300`}>
                      <useCase.icon className="w-6 h-6 text-white" />
                    </div>

                    <h4 className="text-lg font-bold">{useCase.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                How to <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Get Started</span>
              </h3>
              <p className="text-lg text-muted-foreground">
                Start writing in seconds - no installation required
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: '01', title: 'Sign Up Free', description: 'Create your account in seconds - no credit card required', icon: Users },
                { step: '02', title: 'Start Writing', description: 'Open the editor and start typing in markdown syntax', icon: FileText },
                { step: '03', title: 'See Live Preview', description: 'Watch your content render in real-time in the preview pane', icon: Eye },
                { step: '04', title: 'Use AI Features', description: 'Enhance your writing with AI suggestions and auto-complete', icon: Sparkles },
                { step: '05', title: 'Organize Documents', description: 'Create folders, add tags, and keep your work organized', icon: Cloud },
                { step: '06', title: 'Export & Share', description: 'Download as PDF, HTML, or share via email when done', icon: Download }
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative group animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4 p-6 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-bold text-white">
                        {step.step}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < 5 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-purple-600/5">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12">
            <div className="text-center space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Lightning Fast</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold">
                Real-time Preview
                <br />
                <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  As You Type
                </span>
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                See your markdown rendered instantly with our blazing-fast preview engine.
                No delays, no lag - just pure productivity.
              </p>
            </div>

            {/* Typewriter Demo */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <TypewriterDemo />
            </div>

            {/* Features List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {[
                { icon: Eye, text: 'Split-pane editor with live preview' },
                { icon: Code, text: 'Syntax highlighting for code blocks' },
                { icon: Palette, text: 'Custom themes and styling' },
                { icon: Download, text: 'Export to PDF, HTML, and more' },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Questions</span>
              </h3>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about Scriptly
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  question: 'Is this online markdown editor really free?',
                  answer: 'Yes! Scriptly is 100% free and open source. There are no hidden costs, premium tiers, or subscriptions. You get all features for free, forever.',
                  icon: Shield
                },
                {
                  question: 'Do I need to install anything?',
                  answer: 'No installation required! Our markdown editor works entirely in your web browser. Just sign up and start writing immediately.',
                  icon: Zap
                },
                {
                  question: 'Is my data secure?',
                  answer: 'Absolutely. Your documents are stored securely in your own Supabase instance with industry-standard encryption. We never access your private data.',
                  icon: Shield
                },
                {
                  question: 'Can I use it offline?',
                  answer: "While Scriptly is primarily an online markdown editor, we're working on offline support. Your documents are cached locally for quick access.",
                  icon: Cloud
                },
                {
                  question: 'What markdown features are supported?',
                  answer: 'We support all standard markdown syntax plus advanced features like tables, task lists, footnotes, Mermaid diagrams, LaTeX math, and code syntax highlighting.',
                  icon: Code
                },
                {
                  question: 'Can I export my documents?',
                  answer: 'Yes! You can export your markdown documents as PDF, HTML, or download the raw .md files. Your content is never locked in - you own your data.',
                  icon: Download
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <faq.icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {faq.question}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-3xl blur-3xl opacity-20" />
            <div className="relative bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-12 md:p-16 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Transform Your Writing?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of writers, developers, and content creators using Scriptly
              </p>
              <Button
                size="lg"
                onClick={() => router.push('/editor')}
                className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Start Writing Now
                <Rocket className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">Scriptly</span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                    Open Source
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The ultimate open-source markdown editor for modern creators
              </p>
              <a
                href="https://github.com/akhilathuluri/Scriptly"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Star us on GitHub</span>
              </a>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="/changelog" className="hover:text-primary transition-colors">Changelog</a></li>
                <li><a href="https://github.com/akhilathuluri/Scriptly" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/documentation" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="/guides" className="hover:text-primary transition-colors">Guides</a></li>
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="https://github.com/akhilathuluri/Scriptly" className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://x.com/akhilathuluri1" className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 Scriptly. Open source and free forever.</p>
            <a
              href="https://github.com/akhilathuluri/Scriptly"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
              <Star className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* Auth Configuration Check */}
      <AuthCheck />
    </div>
  );
}
