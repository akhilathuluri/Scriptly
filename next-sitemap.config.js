/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://scriptly-md.vercel.app/',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/editor',
    '/profile',
    '/settings',
    '/api/*',
    '/auth/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/editor', '/profile', '/settings', '/api/', '/auth/'],
      },
    ],
    additionalSitemaps: [
      'https://scriptly-md.vercel.app/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom priority and changefreq for different pages
    const customConfig = {
      '/': { priority: 1.0, changefreq: 'weekly' },
      '/landing': { priority: 1.0, changefreq: 'weekly' },
      '/documentation': { priority: 0.9, changefreq: 'weekly' },
      '/guides': { priority: 0.9, changefreq: 'weekly' },
      '/changelog': { priority: 0.7, changefreq: 'monthly' },
      '/privacy': { priority: 0.5, changefreq: 'monthly' },
    };

    const config_for_path = customConfig[path] || { priority: 0.7, changefreq: 'monthly' };

    return {
      loc: path,
      changefreq: config_for_path.changefreq,
      priority: config_for_path.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
