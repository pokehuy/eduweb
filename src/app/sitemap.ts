import { MetadataRoute } from 'next'
import { getSiteConfig, getPublishedCourses, getPublishedPosts } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig()
  const baseUrl = site.url
  const courses = getPublishedCourses()
  const posts = getPublishedPosts()
  const now = new Date()

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/courses`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...courses.map(c => ({
      url: `${baseUrl}/courses/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...posts.map(p => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
