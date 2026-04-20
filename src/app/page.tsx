import Link from 'next/link'
import { getSiteConfig, getPublishedCourses, getPublishedPosts } from '@/lib/content'
import { getDict } from '@/i18n'
import CourseCard from '@/components/CourseCard'
import BlogCard from '@/components/BlogCard'

const FEATURE_ICONS: Record<string, string> = { video: '🎬', certificate: '🏆', community: '👥', lifetime: '♾️' }

export default async function HomePage() {
  const [dict, site] = await Promise.all([getDict(), Promise.resolve(getSiteConfig())])
  const courses = getPublishedCourses().filter(c => c.featured).slice(0, 3)
  const posts = getPublishedPosts().filter(p => p.featured).slice(0, 3)
  const d = dict.home

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 text-white py-24">
        <div className="page-container text-center max-w-3xl mx-auto">
          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            🎓 {d.heroBadge}
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            {d.heroHeadline}
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            {d.heroSubheadline}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/courses" className="bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors text-base no-underline">
              {d.heroCtaPrimary} →
            </Link>
            <Link href="/about" className="bg-white/15 border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/25 transition-colors text-base no-underline">
              {d.heroCtaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-slate-50 border-y border-slate-200 py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {site.stats.map(stat => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-indigo-600 mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section">
        <div className="page-container">
          <div className="mb-10">
            <h2 className="section-title">{d.featuredCoursesTitle}</h2>
            <p className="section-subtitle">{d.featuredCoursesDesc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {courses.map(c => <CourseCard key={c.id} course={c} dict={dict} />)}
          </div>
          <div className="text-center">
            <Link href="/courses" className="btn-secondary">{d.viewAllCourses} →</Link>
          </div>
        </div>
      </section>

      {/* Why EduLearn */}
      <section className="section bg-slate-50">
        <div className="page-container">
          <div className="text-center mb-12">
            <h2 className="section-title">{d.whyTitle}</h2>
            <p className="section-subtitle mx-auto">{d.whyDesc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(d.features) as Array<keyof typeof d.features>).map(key => {
              const f = d.features[key]
              return (
                <div key={key} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                  <div className="text-4xl mb-4">{FEATURE_ICONS[key] ?? '✨'}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="section">
        <div className="page-container">
          <div className="mb-10">
            <h2 className="section-title">{d.blogTitle}</h2>
            <p className="section-subtitle">{d.blogDesc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {posts.map(p => <BlogCard key={p.id} post={p} dict={dict} />)}
          </div>
          <div className="text-center">
            <Link href="/blog" className="btn-secondary">{d.readAllArticles} →</Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white py-20">
        <div className="page-container text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{d.ctaTitle}</h2>
          <p className="text-indigo-100 text-lg mb-8 leading-relaxed">{d.ctaDesc}</p>
          <Link href="/courses" className="inline-block bg-white text-indigo-600 font-bold px-10 py-4 rounded-xl hover:bg-indigo-50 transition-colors text-lg no-underline">
            {d.ctaBtn}
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'EducationalOrganization',
          name: site.name, description: site.description, url: site.url,
          email: site.email, telephone: site.phone,
        }),
      }} />
    </>
  )
}
