import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSiteConfig, getPublishedPosts, getPostBySlug } from '@/lib/content'
import { getDict } from '@/i18n'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getPublishedPosts().map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title, description: post.excerpt, keywords: post.tags,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.createdAt, authors: [post.author] },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const [dict, post] = await Promise.all([getDict(), Promise.resolve(getPostBySlug(slug))])
  if (!post || !post.published) notFound()
  const d = dict.blog

  const paragraphs = post.content.split('\n\n')

  return (
    <article>
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="page-container max-w-3xl">
          <Link href="/blog" className="text-slate-400 hover:text-white text-sm no-underline mb-6 inline-block transition-colors">
            {d.backToBlog}
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-5 text-sm">
            <span className="bg-white/15 px-3 py-1 rounded-full text-xs font-semibold">{d.category[post.category as keyof typeof d.category] ?? post.category}</span>
            <span className="text-slate-400">{post.readTime}</span>
            <span className="text-slate-400">
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-6">{post.title}</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold shrink-0">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold">{post.author}</p>
              <p className="text-slate-400 text-sm">{d.instructor}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container max-w-3xl py-12">
        <div className="prose-content text-lg">
          {paragraphs.map((para, i) => {
            if (para.startsWith('## ')) return <h2 key={i}>{para.slice(3)}</h2>
            if (para.startsWith('### ')) return <h3 key={i}>{para.slice(4)}</h3>
            if (para.includes('\n- ') || para.startsWith('- ')) {
              const items = para.split('\n').filter(l => l.startsWith('- '))
              return <ul key={i}>{items.map((item, j) => <li key={j}>{item.slice(2)}</li>)}</ul>
            }
            return <p key={i}>{para}</p>
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => <span key={tag} className="badge">{tag}</span>)}
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'BlogPosting',
          headline: post.title, description: post.excerpt,
          author: { '@type': 'Person', name: post.author },
          datePublished: post.createdAt, dateModified: post.updatedAt,
          keywords: post.tags.join(', '),
        }),
      }} />
    </article>
  )
}
