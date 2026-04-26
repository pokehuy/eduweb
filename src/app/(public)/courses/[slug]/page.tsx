import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSiteConfig, getPublishedCourses, getCourseBySlug } from '@/lib/content'
import { getDict } from '@/i18n'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getPublishedCourses().map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = getCourseBySlug(slug)
  if (!course) return { title: 'Not Found' }
  return {
    title: course.title, description: course.description, keywords: course.tags,
    alternates: { canonical: `/courses/${slug}` },
    openGraph: { title: course.title, description: course.description, type: 'article' },
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const [dict, course] = await Promise.all([getDict(), Promise.resolve(getCourseBySlug(slug))])
  if (!course || !course.published) notFound()
  const d = dict.courses
  const site = getSiteConfig()

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-16">
        <div className="page-container max-w-5xl">
          <Link href="/courses" className="text-indigo-300 hover:text-white text-sm no-underline mb-6 inline-block transition-colors">
            {d.backToAll}
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">{d.category[course.category as keyof typeof d.category] ?? course.category}</span>
            <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">{d.level[course.level as keyof typeof d.level] ?? course.level}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4 max-w-3xl">{course.title}</h1>
          <p className="text-indigo-200 text-lg leading-relaxed mb-6 max-w-2xl">{course.description}</p>
          <div className="flex flex-wrap gap-6 text-sm text-indigo-200">
            <span>⭐ {course.rating} ({course.reviews.toLocaleString()} {d.reviews})</span>
            <span>👥 {course.students.toLocaleString()} {d.students}</span>
            <span>⏱ {course.duration}</span>
            <span>📖 {course.lessons} {d.lessons}</span>
          </div>
        </div>
      </div>

      <div className="page-container max-w-5xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h2 className="font-bold text-xl text-slate-900 mb-4">{d.whatYouLearn}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.whatYouLearn.map(item => (
                  <li key={item} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-green-600 font-bold shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="font-bold text-xl text-slate-900 mb-4">{d.curriculum}</h2>
              <div className="space-y-2">
                {course.curriculum.map((section, i) => (
                  <div key={i} className="flex items-center justify-between border border-slate-200 rounded-xl px-4 py-3.5 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                      <span className="font-semibold text-slate-900 text-sm">{section.title}</span>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                      {section.lessons} {d.lessons} · {section.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h2 className="font-bold text-xl text-slate-900 mb-4">{d.aboutInstructor}</h2>
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shrink-0">
                  {course.instructor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{course.instructor}</p>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">{course.instructorBio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-20">
            <div className="card p-6">
              <div className="text-3xl font-extrabold text-indigo-600 mb-0.5">${course.price}</div>
              <div className="line-through text-slate-400 text-sm mb-5">${course.originalPrice}</div>
              <button className="btn-primary w-full justify-center mb-3">{d.enrollNow}</button>
              <button className="btn-secondary w-full justify-center mb-5">{d.freePreview}</button>
              <ul className="space-y-2.5 text-sm text-slate-600">
                <li className="flex gap-2"><span>⏱</span> {course.duration} of content</li>
                <li className="flex gap-2"><span>📖</span> {course.lessons} {d.lessons}</li>
                <li className="flex gap-2"><span>♾️</span> {d.lifetimeAccess}</li>
                <li className="flex gap-2"><span>📱</span> {d.mobileDesktop}</li>
                <li className="flex gap-2"><span>🏆</span> {d.certificate}</li>
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {course.tags.map(tag => <span key={tag} className="badge">{tag}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Course',
          name: course.title, description: course.description,
          provider: { '@type': 'Organization', name: 'EduLearn', sameAs: site.url },
          instructor: { '@type': 'Person', name: course.instructor },
          aggregateRating: { '@type': 'AggregateRating', ratingValue: course.rating, reviewCount: course.reviews },
          offers: { '@type': 'Offer', price: course.price, priceCurrency: 'USD' },
        }),
      }} />
    </div>
  )
}
