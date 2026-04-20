import Link from 'next/link'
import { getSiteConfig } from '@/lib/content'
import type { Dict } from '@/i18n'

export default function Footer({ dict }: { dict: Dict }) {
  const site = getSiteConfig()

  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="page-container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm">E</div>
              <span className="font-bold text-xl text-white">EduLearn</span>
            </div>
            <p className="text-sm leading-relaxed mb-5">{site.tagline}</p>
            <div className="flex gap-3">
              {[
                { label: 'Twitter', icon: '𝕏' },
                { label: 'LinkedIn', icon: 'in' },
                { label: 'YouTube', icon: '▶' },
              ].map(s => (
                <div key={s.label} className="w-8 h-8 bg-slate-800 rounded-md flex items-center justify-center text-slate-400 text-xs font-bold hover:bg-slate-700 hover:text-white transition-colors cursor-pointer">
                  {s.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Learn */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{dict.footer.learn}</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href="/courses" className="hover:text-white transition-colors no-underline">{dict.footer.allCourses}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors no-underline">{dict.footer.blog}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors no-underline">{dict.footer.about}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{dict.footer.categories}</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {(['Technology', 'Design', 'Business', 'Data Science'] as const).map(cat => (
                <li key={cat}>
                  <Link href={`/courses?category=${cat}`} className="hover:text-white transition-colors no-underline">
                    {dict.courses.category[cat] ?? cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">{dict.footer.contact}</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>{site.email}</li>
              <li>{site.phone}</li>
              <li className="leading-snug">{site.address}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p>© {new Date().getFullYear()} EduLearn. {dict.footer.rights}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors no-underline">{dict.footer.privacy}</Link>
            <Link href="/terms" className="hover:text-white transition-colors no-underline">{dict.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
