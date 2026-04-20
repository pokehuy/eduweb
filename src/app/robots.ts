import { MetadataRoute } from 'next'
import { getSiteConfig } from '@/lib/content'

export default function robots(): MetadataRoute.Robots {
  const site = getSiteConfig()
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api/admin'] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
