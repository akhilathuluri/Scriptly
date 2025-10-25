// Structured Data (JSON-LD) for SEO
// Add this to your pages for rich snippets in Google Search

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Scriptly',
  url: 'https://scriptly-md.vercel.app/',
  logo: 'https://scriptly-md.vercel.app/logo.png',
  description: 'Open source markdown editor with AI assistance',
  sameAs: [
    'https://github.com/akhilathuluri/Scriptly',
    'https://x.com/akhilathuluri1',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    email: 'athuluriakhil@gmail.com',
  },
};

export const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Scriptly',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '1250',
    bestRating: '5',
    worstRating: '1',
  },
  description: 'Free, open-source markdown editor with AI writing assistant, real-time preview, and advanced features for modern content creators.',
  screenshot: 'https://scriptly-md.vercel.app/screenshot.png',
  softwareVersion: '2.0.0',
  datePublished: '2024-07-15',
  dateModified: '2024-10-05',
  author: {
    '@type': 'Organization',
    name: 'Scriptly Team',
  },
  downloadUrl: 'https://github.com/yourusername/Scriptly',
  featureList: [
    'Real-time markdown preview',
    'AI writing assistant',
    'AI auto-complete',
    'Document chatbot',
    'Email sharing',
    'Word cloud visualization',
    'Mermaid diagrams',
    'Math equations',
    'Cloud storage',
    'Dark mode',
  ],
  keywords: 'markdown editor, AI writing, open source, documentation, technical writing',
};

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Scriptly',
  url: 'https://scriptly-md.vercel.app/',
  description: 'Open source markdown editor with AI assistance and real-time preview',
  applicationCategory: 'Productivity',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  screenshot: {
    '@type': 'ImageObject',
    url: 'https://scriptly-md.vercel.app/screenshot.png',
    caption: 'Scriptly Editor Interface',
  },
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const articleSchema = (article: {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  datePublished: article.datePublished,
  dateModified: article.dateModified,
  author: {
    '@type': 'Person',
    name: article.author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Scriptly',
    logo: {
      '@type': 'ImageObject',
      url: 'https://scriptly-md.vercel.app/logo.png',
    },
  },
});

export const howToSchema = (steps: { name: string; text: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to use Scriptly',
  description: 'Step-by-step guide to using Scriptly markdown editor',
  step: steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
  })),
});
