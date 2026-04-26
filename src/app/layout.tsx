import type { Metadata } from 'next'
import './globals.css'
import { getSiteConfig } from '@/lib/content'
import { getLocale } from '@/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const site = getSiteConfig()
  return {
    metadataBase: new URL(site.url),
    title: { default: site.seo.defaultTitle, template: site.seo.titleTemplate },
    description: site.seo.defaultDescription,
    keywords: site.seo.keywords,
    authors: [{ name: site.name }],
    openGraph: {
      type: 'website', locale: 'en_US', url: site.url, siteName: site.name,
      title: site.seo.defaultTitle, description: site.seo.defaultDescription,
      images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image', title: site.seo.defaultTitle,
      description: site.seo.defaultDescription, site: site.seo.twitterHandle,
      images: [site.seo.ogImage],
    },
    robots: { index: true, follow: true },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale()
  const localeMap = { en: 'en', vi: 'vi', de: 'de' }
  return (
    <html lang={localeMap[locale] ?? 'en'}>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  )
}
