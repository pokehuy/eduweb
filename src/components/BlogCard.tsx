import Link from 'next/link'
import type { BlogPost } from '@/lib/content'
import type { Dict } from '@/i18n'

const CATEGORY_EMOJI: Record<string, string> = {
  Technology: '🤖', Design: '🎨', Business: '📈', 'Learning Tips': '💡', Career: '🚀', News: '📰',
}

export default function BlogCard({ post, dict }: { post: BlogPost; dict: Dict }) {
  const d = dict.blog
  return (
    <Link href={`/blog/${post.slug}`} className="no-underline group">
      <article className="card h-full flex flex-col">
        <div className="h-40 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
          <span className="text-5xl">{CATEGORY_EMOJI[post.category] ?? '📝'}</span>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="badge">{d.category[post.category as keyof typeof d.category] ?? post.category}</span>
            <span className="text-slate-400 text-xs">{post.readTime}</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2.5 border-t border-slate-100 pt-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900 leading-none">{post.author}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
