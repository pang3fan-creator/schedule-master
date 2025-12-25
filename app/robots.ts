import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com'

  return {
    rules: [
      // 1. Block known AI crawlers
      {
        userAgent: [
          'Amazonbot',
          'Applebot-Extended',
          'Bytespider',
          'CCBot',
          'ClaudeBot',
          'Google-Extended',
          'GPTBot',
          'meta-externalagent',
        ],
        allow: [],
        disallow: '/',
      },
      // 2. General rules for all other crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api',
          '/portal',
          '/sso-callback',
          '/checkout',
          '/dashboard',
          '/sign-in',
          '/sign-up',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}



