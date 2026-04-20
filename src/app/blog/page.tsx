import type { Metadata } from 'next'
import { getPublishedPosts } from '@/lib/content'
import { getDict } from '@/i18n'
import BlogCard from '@/components/BlogCard'

export const metadata: Metadata = { title: 'Blog', alternates: { canonical: '/blog' } }

export default async function BlogPage() {
  const [dict, posts] = await Promise.all([getDict(), Promise.resolve(getPublishedPosts())])
  const d = dict.blog
  const categories = [...new Set(posts.map(p => p.category))]

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-slate-50 to-cyan-50 border-b border-slate-200 py-12">
        <div className="page-container">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{d.pageTitle}</h1>
          <p className="text-slate-500 text-lg">{d.pageDesc}</p>
        </div>
      </div>

      <div className="page-container py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <a href="/blog" className="filter-pill-active">{d.all}</a>
          {categories.map(cat => (
            <a key={cat} href={`/blog?category=${cat}`} className="filter-pill">
              {d.category[cat as keyof typeof d.category] ?? cat}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(p => <BlogCard key={p.id} post={p} dict={dict} />)}
        </div>
      </div>
    </div>
  )
}
