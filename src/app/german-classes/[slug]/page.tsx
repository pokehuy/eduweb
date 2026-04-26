import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPublishedGermanClasses, getGermanClassBySlug } from '@/lib/content'
import GermanClassRegistrationForm from '@/components/GermanClassRegistrationForm'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getPublishedGermanClasses().map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cls = getGermanClassBySlug(slug)
  if (!cls) return { title: 'Not Found' }
  return {
    title: cls.title,
    description: cls.description,
    keywords: cls.tags,
    alternates: { canonical: `/german-classes/${slug}` },
    openGraph: { title: cls.title, description: cls.description, type: 'article' },
  }
}

export default async function GermanClassDetailPage({ params }: Props) {
  const { slug } = await params
  const cls = getGermanClassBySlug(slug)
  if (!cls || !cls.published) notFound()

  const spotsLeft = cls.maxStudents - cls.currentStudents
  const isFull = spotsLeft <= 0
  const startFormatted = new Date(cls.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const endFormatted = new Date(cls.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-900 text-white py-16">
        <div className="page-container max-w-5xl">
          <Link href="/german-classes" className="text-emerald-300 hover:text-white text-sm no-underline mb-6 inline-block transition-colors">
            ← All German Classes
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">Level {cls.level}</span>
            <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">{cls.location}</span>
            {cls.featured && <span className="bg-amber-400 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full">★ Popular</span>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4 max-w-3xl">{cls.title}</h1>
          <p className="text-emerald-200 text-lg leading-relaxed mb-6 max-w-2xl">{cls.description}</p>
          <div className="flex flex-wrap gap-6 text-sm text-emerald-200">
            <span>📅 {cls.schedule}</span>
            <span>🗓 {startFormatted} – {endFormatted}</span>
            <span>⏱ {cls.sessionLength} per session</span>
            <span>👥 {isFull ? 'Class full' : `${spotsLeft} spots left`}</span>
          </div>
        </div>
      </div>

      <div className="page-container max-w-5xl py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What you'll learn */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <h2 className="font-bold text-xl text-slate-900 mb-4">What You&apos;ll Learn</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cls.whatYouLearn.map(item => (
                  <li key={item} className="flex gap-2 text-sm text-slate-700">
                    <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Course details */}
            <div>
              <h2 className="font-bold text-xl text-slate-900 mb-4">Course Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '📅', label: 'Schedule', value: cls.schedule },
                  { icon: '📍', label: 'Location', value: cls.location },
                  { icon: '⏱', label: 'Duration', value: `${cls.duration} (${cls.sessions} sessions)` },
                  { icon: '🕐', label: 'Session Length', value: cls.sessionLength },
                  { icon: '🗓', label: 'Start Date', value: startFormatted },
                  { icon: '🏁', label: 'End Date', value: endFormatted },
                  { icon: '👥', label: 'Class Size', value: `Max ${cls.maxStudents} students` },
                  { icon: '🎓', label: 'Level', value: `CEFR ${cls.level}` },
                ].map(d => (
                  <div key={d.label} className="flex items-start gap-3 border border-slate-200 rounded-xl px-4 py-3.5">
                    <span className="text-xl shrink-0">{d.icon}</span>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{d.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            {cls.requirements.length > 0 && (
              <div>
                <h2 className="font-bold text-xl text-slate-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {cls.requirements.map(req => (
                    <li key={req} className="flex gap-2 text-sm text-slate-700">
                      <span className="text-slate-400 shrink-0">→</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Materials */}
            {cls.materials.length > 0 && (
              <div className="bg-slate-50 rounded-2xl p-6">
                <h2 className="font-bold text-xl text-slate-900 mb-4">Included Materials</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {cls.materials.map(mat => (
                    <li key={mat} className="flex gap-2 text-sm text-slate-700">
                      <span className="text-emerald-600 shrink-0">📦</span> {mat}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor */}
            <div className="bg-slate-50 rounded-2xl p-6">
              <h2 className="font-bold text-xl text-slate-900 mb-4">Your Instructor</h2>
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white font-extrabold text-lg shrink-0">
                  {cls.instructor.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{cls.instructor}</p>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">{cls.instructorBio}</p>
                </div>
              </div>
            </div>

            {/* Registration form (mobile — shown below details) */}
            <div className="lg:hidden">
              <GermanClassRegistrationForm classId={cls.slug} className={cls.title} isFull={isFull} price={cls.price} currency={cls.currency} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-20 hidden lg:block">
            <GermanClassRegistrationForm classId={cls.slug} className={cls.title} isFull={isFull} price={cls.price} currency={cls.currency} />
          </div>
        </div>
      </div>
    </div>
  )
}
