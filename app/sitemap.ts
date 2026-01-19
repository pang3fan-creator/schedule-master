import { MetadataRoute } from 'next'
import { getAllTemplateSlugs } from '@/lib/templates'
import { getAllPosts } from '@/lib/posts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tryschedule.com'

  // Helper to create alternates object for multilingual pages
  // Includes x-default pointing to English version as per SEO best practices
  const createAlternates = (path: string) => ({
    languages: {
      en: `${baseUrl}${path}`,
      es: `${baseUrl}/es${path}`,
      'x-default': `${baseUrl}${path}`,
    }
  })



  // Multilingual pages with proper alternates (xhtml:link)
  const localizedPages = [
    // Homepage - English
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: createAlternates('/'),
    },
    // Homepage - Spanish
    {
      url: `${baseUrl}/es`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
      alternates: createAlternates('/'),
    },
    // Blog - English
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: createAlternates('/blog'),
    },
    // Blog - Spanish
    {
      url: `${baseUrl}/es/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: createAlternates('/blog'),
    },
    // Pricing - English
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: createAlternates('/pricing'),
    },
    // Pricing - Spanish
    {
      url: `${baseUrl}/es/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: createAlternates('/pricing'),
    },
    // Contact - English
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: createAlternates('/contact'),
    },
    // Contact - Spanish
    {
      url: `${baseUrl}/es/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: createAlternates('/contact'),
    },
    // Terms - English
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
      alternates: createAlternates('/terms'),
    },
    // Terms - Spanish
    {
      url: `${baseUrl}/es/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
      alternates: createAlternates('/terms'),
    },
    // Privacy - English
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
      alternates: createAlternates('/privacy'),
    },
    // Privacy - Spanish
    {
      url: `${baseUrl}/es/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
      alternates: createAlternates('/privacy'),
    },
  ]

  // Template list pages - with multilingual alternates
  const templateListPages = [
    // English
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: createAlternates('/templates'),
    },
    // Spanish
    {
      url: `${baseUrl}/es/templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: createAlternates('/templates'),
    },
  ]

  // Template detail pages - with multilingual alternates
  const templateSlugs = getAllTemplateSlugs()
  const templatePages = templateSlugs.flatMap((slug) => [
    // English version
    {
      url: `${baseUrl}/templates/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: createAlternates(`/templates/${slug}`),
    },
    // Spanish version
    {
      url: `${baseUrl}/es/templates/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: createAlternates(`/templates/${slug}`),
    },
  ])

  // Blog post pages - with multilingual alternates
  const allPosts = getAllPosts('en')  // Get slugs from English posts
  const blogArticlePages = allPosts.flatMap((post) => [
    // English version
    {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: createAlternates(`/blog/${post.slug}`),
    },
    // Spanish version
    {
      url: `${baseUrl}/es/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
      alternates: createAlternates(`/blog/${post.slug}`),
    },
  ])

  return [...localizedPages, ...templateListPages, ...templatePages, ...blogArticlePages]
}

