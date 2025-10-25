import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/lib/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://scriptly-md.vercel.app'),
  title: {
    default: 'Online Markdown Editor - Free & Open Source | Scriptly',
    template: '%s | Scriptly - Online Markdown Editor'
  },
  description: 'Best free online markdown editor with AI writing assistant, real-time preview, and export options. Write, edit, and format markdown documents online instantly. No installation required.',
  keywords: [
    'online markdown editor',
    'markdown editor online',
    'free online markdown editor',
    'online editor',
    'markdown editor',
    'best markdown editor',
    'web markdown editor',
    'browser markdown editor',
    'markdown editor with preview',
    'real-time markdown editor',
    'AI markdown editor',
    'markdown editor free',
    'open source markdown editor',
    'markdown to html online',
    'markdown to pdf online',
    'online text editor',
    'markdown writing tool',
    'technical writing editor',
    'documentation editor online',
    'note taking app online',
    'collaborative markdown editor',
    'cloud markdown editor',
    'markdown editor with AI',
    'scriptly',
    'mermaid diagram editor',
    'latex editor online',
    'code editor online',
    'writing tool online',
    'content creation tool',
    'developer markdown editor'
  ],
  authors: [
    { name: 'Scriptly Team', url: 'https://github.com/yourusername/scriptly' }
  ],
  creator: 'Scriptly Team',
  publisher: 'Scriptly',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://scriptly-md.vercel.app',
    title: 'Online Markdown Editor - Free & Open Source | Scriptly',
    description: 'Best free online markdown editor with AI writing assistant, real-time preview, and export options. Write and edit markdown documents online instantly.',
    siteName: 'Scriptly - Online Markdown Editor',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Scriptly - Open Source Markdown Editor',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Online Markdown Editor - Free & Open Source | Scriptly',
    description: 'Best free online markdown editor with AI writing assistant, real-time preview, and export options. Write markdown online instantly.',
    images: ['/og-image.png'],
    creator: '@scriptly',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  category: 'technology',
  alternates: {
    canonical: 'https://scriptly-md.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <div className="relative min-h-screen bg-background">
              {children}
              <Toaster />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
