import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Zap, Cloud, Shield, Check, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Online Markdown Editor - Free, Fast & Feature-Rich',
  description: 'The best online markdown editor for 2025. Write, edit, and preview markdown in real-time with AI assistance. Free, open-source, and no installation required.',
  keywords: [
    'online markdown editor',
    'markdown editor online',
    'free online markdown editor',
    'best online markdown editor',
    'web markdown editor',
    'browser markdown editor',
    'markdown editor with preview',
    'real-time markdown editor'
  ],
  alternates: {
    canonical: 'https://scriptly-md.vercel.app/online-markdown-editor',
  },
  openGraph: {
    title: 'Online Markdown Editor - Free, Fast & Feature-Rich | Scriptly',
    description: 'The best online markdown editor for 2025. Write, edit, and preview markdown in real-time with AI assistance.',
    url: 'https://scriptly-md.vercel.app/online-markdown-editor',
  },
};

export default function OnlineMarkdownEditorPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center space-x-3 group cursor-pointer">
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
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/landing" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
              <Link href="/documentation" className="text-sm font-medium hover:text-primary transition-colors">Docs</Link>
              <Link href="/guides" className="text-sm font-medium hover:text-primary transition-colors">Guides</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/editor">
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                  Launch Editor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Online Markdown Editor
            </span>
            <br />
            <span className="text-3xl md:text-4xl text-muted-foreground">
              Free, Fast & Feature-Rich
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Scriptly is the best <strong>online markdown editor</strong> for developers, writers, and content creators. 
            Write, edit, and preview markdown documents in real-time with AI-powered assistance. 
            No installation required - start writing in seconds!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/editor">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 text-lg px-8">
                Start Writing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/landing">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-12">
          <article className="prose prose-lg max-w-none">
            <h2 className="text-4xl font-bold mb-6">What is an Online Markdown Editor?</h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              An <strong>online markdown editor</strong> is a web-based tool that allows you to write and edit markdown documents 
              directly in your browser without installing any software. Unlike traditional text editors, an online markdown editor 
              provides real-time preview, syntax highlighting, and cloud storage - making it perfect for modern content creation.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Scriptly takes the concept of a <strong>markdown editor online</strong> to the next level by integrating AI-powered 
              writing assistance, advanced formatting options, and seamless collaboration features. Whether you're writing technical 
              documentation, blog posts, or taking notes, our online editor provides everything you need in one place.
            </p>

            <h2 className="text-4xl font-bold mt-12 mb-6">Why Choose Scriptly as Your Online Markdown Editor?</h2>

            <div className="grid md:grid-cols-2 gap-6 not-prose my-8">
              <div className="p-6 rounded-xl border bg-background">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                    <p className="text-muted-foreground">
                      Real-time preview with zero lag. See your markdown rendered instantly as you type.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border bg-background">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
                    <p className="text-muted-foreground">
                      Improve your writing with AI suggestions, auto-complete, and content transformation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border bg-background">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Cloud className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Cloud Storage</h3>
                    <p className="text-muted-foreground">
                      Your documents are automatically saved and synced across all your devices.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border bg-background">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">100% Free</h3>
                    <p className="text-muted-foreground">
                      Open source and free forever. No hidden costs, no premium tiers, no subscriptions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold mt-12 mb-6">Key Features of Our Online Markdown Editor</h2>

            <ul className="space-y-4 my-8">
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Real-Time Preview:</strong>
                  <span className="text-muted-foreground"> Split-pane editor with instant markdown rendering</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">AI Writing Assistant:</strong>
                  <span className="text-muted-foreground"> Improve, summarize, expand, and translate your content with AI</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Advanced Formatting:</strong>
                  <span className="text-muted-foreground"> Support for tables, task lists, footnotes, and more</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Mermaid Diagrams:</strong>
                  <span className="text-muted-foreground"> Create flowcharts, sequence diagrams, and more</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">LaTeX Math:</strong>
                  <span className="text-muted-foreground"> Beautiful mathematical equations with KaTeX</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Export Options:</strong>
                  <span className="text-muted-foreground"> Download as PDF, HTML, or markdown files</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">Dark Mode:</strong>
                  <span className="text-muted-foreground"> Easy on the eyes with beautiful dark theme</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-foreground">No Installation:</strong>
                  <span className="text-muted-foreground"> Works entirely in your browser - start writing immediately</span>
                </div>
              </li>
            </ul>

            <h2 className="text-4xl font-bold mt-12 mb-6">How to Use Our Online Markdown Editor</h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Getting started with Scriptly's <strong>online markdown editor</strong> is incredibly simple:
            </p>

            <ol className="space-y-4 my-8 list-decimal list-inside text-lg text-muted-foreground">
              <li><strong className="text-foreground">Sign Up Free:</strong> Create your account in seconds - no credit card required</li>
              <li><strong className="text-foreground">Open the Editor:</strong> Click "Launch Editor" to access the online markdown editor</li>
              <li><strong className="text-foreground">Start Writing:</strong> Type your content using markdown syntax</li>
              <li><strong className="text-foreground">See Live Preview:</strong> Watch your content render in real-time</li>
              <li><strong className="text-foreground">Use AI Features:</strong> Enhance your writing with AI assistance</li>
              <li><strong className="text-foreground">Save & Export:</strong> Your work is auto-saved, export when ready</li>
            </ol>

            <h2 className="text-4xl font-bold mt-12 mb-6">Who Should Use an Online Markdown Editor?</h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Our <strong>markdown editor online</strong> is perfect for:
            </p>

            <ul className="space-y-3 my-8 text-lg text-muted-foreground">
              <li><strong className="text-foreground">Developers:</strong> Write README files, technical documentation, and code documentation</li>
              <li><strong className="text-foreground">Technical Writers:</strong> Create clear, well-formatted documentation with diagrams</li>
              <li><strong className="text-foreground">Bloggers:</strong> Draft blog posts with proper formatting and preview</li>
              <li><strong className="text-foreground">Students:</strong> Take notes, write essays, and create study materials</li>
              <li><strong className="text-foreground">Content Creators:</strong> Plan and write content with AI assistance</li>
              <li><strong className="text-foreground">Project Managers:</strong> Document processes and create project wikis</li>
            </ul>

            <h2 className="text-4xl font-bold mt-12 mb-6">Online Markdown Editor vs Desktop Editors</h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              While desktop markdown editors like Typora or Obsidian are powerful, an <strong>online markdown editor</strong> offers unique advantages:
            </p>

            <div className="my-8 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-bold">Feature</th>
                    <th className="text-left p-4 font-bold">Online Editor</th>
                    <th className="text-left p-4 font-bold">Desktop Editor</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="p-4">Installation</td>
                    <td className="p-4 text-green-600">✓ No installation</td>
                    <td className="p-4 text-red-600">✗ Requires download</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Access Anywhere</td>
                    <td className="p-4 text-green-600">✓ Any device, any browser</td>
                    <td className="p-4 text-red-600">✗ Specific device only</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Auto-Save</td>
                    <td className="p-4 text-green-600">✓ Cloud sync</td>
                    <td className="p-4 text-yellow-600">~ Local only</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Updates</td>
                    <td className="p-4 text-green-600">✓ Always latest</td>
                    <td className="p-4 text-red-600">✗ Manual updates</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4">Collaboration</td>
                    <td className="p-4 text-green-600">✓ Easy sharing</td>
                    <td className="p-4 text-red-600">✗ File-based</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-4xl font-bold mt-12 mb-6">Frequently Asked Questions</h2>

            <div className="space-y-6 my-8">
              <div className="p-6 rounded-xl border bg-background">
                <h3 className="text-xl font-bold mb-2">Is this online markdown editor free?</h3>
                <p className="text-muted-foreground">
                  Yes! Scriptly is 100% free and open source. There are no hidden costs, premium features, or subscriptions. 
                  All features are available to everyone for free, forever.
                </p>
              </div>

              <div className="p-6 rounded-xl border bg-background">
                <h3 className="text-xl font-bold mb-2">Do I need to create an account?</h3>
                <p className="text-muted-foreground">
                  Yes, you need a free account to save your documents and access cloud features. Sign up takes less than 30 seconds 
                  and requires no credit card.
                </p>
              </div>

              <div className="p-6 rounded-xl border bg-background">
                <h3 className="text-xl font-bold mb-2">Can I use it offline?</h3>
                <p className="text-muted-foreground">
                  While Scriptly is primarily an online markdown editor, your documents are cached locally for quick access. 
                  We're working on full offline support in future updates.
                </p>
              </div>

              <div className="p-6 rounded-xl border bg-background">
                <h3 className="text-xl font-bold mb-2">What browsers are supported?</h3>
                <p className="text-muted-foreground">
                  Our online markdown editor works on all modern browsers including Chrome, Firefox, Safari, and Edge. 
                  For the best experience, we recommend using the latest version of your browser.
                </p>
              </div>

              <div className="p-6 rounded-xl border bg-background">
                <h3 className="text-xl font-bold mb-2">Is my data secure?</h3>
                <p className="text-muted-foreground">
                  Absolutely. Your documents are stored securely with industry-standard encryption. We never access your private data, 
                  and you maintain full control over your content.
                </p>
              </div>

              <div className="p-6 rounded-xl border bg-background">
                <h3 className="text-xl font-bold mb-2">Can I export my documents?</h3>
                <p className="text-muted-foreground">
                  Yes! You can export your markdown documents as PDF, HTML, or download the raw .md files. 
                  Your content is never locked in - you own your data.
                </p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mt-12 mb-6">Start Using the Best Online Markdown Editor Today</h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Ready to experience the power of a modern <strong>online markdown editor</strong>? Join thousands of developers, 
              writers, and content creators who trust Scriptly for their markdown editing needs. Sign up free and start writing 
              in seconds - no installation, no credit card, no hassle.
            </p>
          </article>

          {/* CTA */}
          <div className="text-center py-12">
            <Link href="/editor">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 text-lg px-12 py-6">
                Launch Online Markdown Editor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <Link href="/landing" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">Scriptly</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                The best free online markdown editor with AI assistance
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/landing" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/editor" className="hover:text-primary transition-colors">Editor</Link></li>
                <li><Link href="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/documentation" className="hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="/guides" className="hover:text-primary transition-colors">Guides</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">SEO Pages</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/online-markdown-editor" className="hover:text-primary transition-colors">Online Markdown Editor</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>© 2024 Scriptly. Open source and free forever.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
