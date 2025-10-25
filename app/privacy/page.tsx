'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Database, Cookie, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();

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
            <div className="flex items-center gap-3">
              <Shield className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <p className="text-muted-foreground">
              Last updated: October 5, 2024
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <p className="text-sm leading-relaxed">
              At Scriptly, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our open-source markdown editor.
            </p>
          </div>

          {/* Information We Collect */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">Information We Collect</h2>
            </div>
            
            <div className="space-y-4 pl-9">
              <div>
                <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                <p className="text-muted-foreground">
                  When you create an account, we collect:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Email address</li>
                  <li>Full name (optional)</li>
                  <li>Profile picture (optional)</li>
                  <li>Password (encrypted)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Document Data</h3>
                <p className="text-muted-foreground">
                  We store your documents and related information:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Document content (markdown text)</li>
                  <li>Document titles and metadata</li>
                  <li>Folder organization</li>
                  <li>Tags and favorites</li>
                  <li>Creation and modification timestamps</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Usage Data</h3>
                <p className="text-muted-foreground">
                  We may collect information about how you use Scriptly:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Feature usage patterns</li>
                  <li>Error logs and diagnostics</li>
                  <li>Performance metrics</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">How We Use Your Information</h2>
            </div>
            
            <div className="space-y-3 pl-9">
              <p className="text-muted-foreground">We use your information to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Provide and maintain the Scriptly service</li>
                <li>Authenticate your account and ensure security</li>
                <li>Store and sync your documents across devices</li>
                <li>Send you important service updates</li>
                <li>Improve our features and user experience</li>
                <li>Respond to your support requests</li>
              </ul>
            </div>
          </section>

          {/* Data Storage and Security */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">Data Storage and Security</h2>
            </div>
            
            <div className="space-y-4 pl-9">
              <div>
                <h3 className="text-lg font-semibold mb-2">Where We Store Data</h3>
                <p className="text-muted-foreground">
                  Your data is stored securely using Supabase (PostgreSQL database) with the following protections:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Row Level Security (RLS) - You can only access your own data</li>
                  <li>Encrypted connections (HTTPS/TLS)</li>
                  <li>Regular security updates and patches</li>
                  <li>Automatic backups</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Local Storage</h3>
                <p className="text-muted-foreground">
                  Some data is stored locally in your browser:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>AI API keys (never sent to our servers)</li>
                  <li>User preferences and settings</li>
                  <li>Session tokens</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">Third-Party Services</h2>
            </div>
            
            <div className="space-y-3 pl-9">
              <p className="text-muted-foreground">Scriptly integrates with the following third-party services:</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Supabase</h3>
                  <p className="text-muted-foreground">
                    Database and authentication provider. Your data is stored on Supabase servers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Google Gemini AI</h3>
                  <p className="text-muted-foreground">
                    AI features use Google's Gemini API. When you use AI features, your selected text is sent to Google for processing. You provide your own API key, which is stored locally in your browser.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Email Service (SMTP)</h3>
                  <p className="text-muted-foreground">
                    When you send documents via email, we use SMTP servers (e.g., Gmail) to deliver emails. Email content is transmitted securely.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <Cookie className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold m-0">Cookies and Tracking</h2>
            </div>
            
            <div className="space-y-3 pl-9">
              <p className="text-muted-foreground">
                We use minimal cookies and local storage for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>Authentication (session management)</li>
                <li>User preferences (theme, settings)</li>
                <li>Feature functionality</li>
              </ul>
              <p className="text-muted-foreground">
                We do not use tracking cookies or analytics that identify individual users.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Your Rights</h2>
            
            <div className="space-y-3">
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Access:</strong> View all your personal data</li>
                <li><strong>Export:</strong> Download your documents and data</li>
                <li><strong>Delete:</strong> Remove your account and all associated data</li>
                <li><strong>Modify:</strong> Update your profile information</li>
                <li><strong>Opt-out:</strong> Disable optional features</li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Data Retention</h2>
            
            <div className="space-y-3">
              <p className="text-muted-foreground">
                We retain your data as long as your account is active. When you delete your account:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                <li>All documents are permanently deleted</li>
                <li>Personal information is removed</li>
                <li>Backups are purged within 30 days</li>
              </ul>
            </div>
          </section>

          {/* Open Source */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Open Source Transparency</h2>
            
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Scriptly is open source. You can review our code on GitHub to see exactly how we handle your data. We believe in transparency and welcome community audits.
              </p>
              <Button variant="outline" asChild>
                <a href="https://github.com/yourusername/Scriptly" target="_blank" rel="noopener noreferrer">
                  View Source Code
                </a>
              </Button>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Children's Privacy</h2>
            
            <p className="text-muted-foreground">
              Scriptly is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected such information, please contact us.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Changes to This Policy</h2>
            
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Contact Us</h2>
            
            <div className="space-y-3">
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or your data, please contact us:
              </p>
              <ul className="list-none space-y-2 text-muted-foreground">
                <li>• Email: privacy@Scriptly.com</li>
                <li>• GitHub: <a href="https://github.com/yourusername/Scriptly/issues" className="text-primary hover:underline">Open an issue</a></li>
              </ul>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 pt-8">
          <p className="text-sm text-muted-foreground text-center">
            By using Scriptly, you agree to this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
