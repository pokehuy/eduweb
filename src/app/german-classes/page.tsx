import Link from 'next/link'
import { getPublishedGermanClasses } from '@/lib/content'

const LEVEL_COLOR: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-teal-100 text-teal-700',
  B1: 'bg-cyan-100 text-cyan-700',
  B2: 'bg-blue-100 text-blue-700',
  C1: 'bg-violet-100 text-violet-700',
  C2: 'bg-rose-100 text-rose-700',
}

export const metadata = {
  title: 'German Language Classes',
  description: 'Learn German with expert teachers. Structured classes from A1 to C2, small groups, and proven methods.',
}

export default function GermanClassesPage() {
  const classes = getPublishedGermanClasses()
  const featured = classes.filter(c => c.featured)
  const all = classes

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 text-white py-24">
        <div className="page-container text-center max-w-3xl mx-auto">
          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            🇩🇪 German Language Classes
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Speak German<br />with Confidence
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            Structured courses from absolute beginner to advanced. Small groups of max 12 students, certified teachers, and a proven curriculum.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm font-semibold">
            {['A1', 'A2', 'B1', 'B2'].map(level => (
              <span key={level} className="bg-white/20 border border-white/30 px-4 py-1.5 rounded-full">
                Level {level}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why learn German */}
      <section className="bg-slate-50 border-y border-slate-200 py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '👨‍🏫', value: 'Max 12', label: 'Students per class' },
              { icon: '🎓', value: 'Certified', label: 'DaF teachers' },
              { icon: '📜', value: 'Goethe', label: 'Exam preparation' },
              { icon: '🌐', value: 'Online &', label: 'In-person options' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-extrabold text-emerald-600 mb-1">{s.value}</div>
                <div className="text-slate-500 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Classes grid */}
      <section className="section">
        <div className="page-container">
          <div className="mb-10">
            <h2 className="section-title">Upcoming Classes</h2>
            <p className="section-subtitle">Choose your level and start learning. New sessions start every month.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {all.map(cls => {
              const spotsLeft = cls.maxStudents - cls.currentStudents
              const isFull = spotsLeft <= 0
              return (
                <div key={cls.id} className="card flex flex-col">
                  {/* Header */}
                  <div className={`bg-gradient-to-br ${cls.level === 'A1' ? 'from-emerald-500 to-teal-600' : cls.level === 'A2' ? 'from-teal-500 to-cyan-600' : 'from-cyan-500 to-blue-600'} p-6 rounded-t-xl`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/25 text-white`}>
                        Level {cls.level}
                      </span>
                      {cls.featured && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-400 text-amber-900">★ Popular</span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-white mb-1">{cls.title}</h3>
                    <p className="text-white/80 text-sm">{cls.duration} · {cls.sessions} sessions</p>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{cls.shortDescription}</p>

                    <div className="space-y-2 mb-5 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="text-base">📅</span>
                        <span>{cls.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="text-base">🗓</span>
                        <span>Starts {new Date(cls.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="text-base">📍</span>
                        <span>{cls.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="text-base">👥</span>
                        <span>{isFull ? 'Class full — join waitlist' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-extrabold text-emerald-600">{cls.currency} {cls.price}</span>
                        <span className="text-slate-400 text-sm">/ full course</span>
                      </div>

                      <Link
                        href={`/german-classes/${cls.slug}`}
                        className="w-full inline-flex justify-center items-center gap-2 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all no-underline text-sm"
                      >
                        {isFull ? 'Join Waitlist' : 'View & Register'} →
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {all.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <div className="text-5xl mb-4">🇩🇪</div>
              <p className="text-lg font-semibold">No classes available right now.</p>
              <p className="text-sm mt-1">Check back soon for new sessions.</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ / Info strip */}
      <section className="section bg-slate-50">
        <div className="page-container max-w-4xl">
          <h2 className="section-title text-center mb-2">Frequently Asked Questions</h2>
          <p className="section-subtitle text-center mx-auto mb-10">Everything you need to know before registering.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { q: 'How do I register?', a: 'Click "View & Register" on any class, fill in the registration form, and you will receive a confirmation email within 24 hours.' },
              { q: 'What is the class size?', a: 'We keep classes small — maximum 12 students — to ensure each student gets personal attention and speaking practice.' },
              { q: 'Is online the same quality as in-person?', a: 'Yes. Our online classes use Zoom with breakout rooms for pair work, digital whiteboards, and the same curriculum as in-person sessions.' },
              { q: 'Can I switch levels?', a: 'Yes. If you find the level too easy or too difficult after the first session, we will help you move to the right class free of charge.' },
              { q: 'What materials are included?', a: 'All course materials — workbooks, audio files, and digital resources — are included in the course price.' },
              { q: 'Do you prepare students for Goethe exams?', a: 'Our B1 and above courses specifically prepare students for Goethe-Institut certificate exams with mock tests and exam strategies.' },
            ].map(item => (
              <div key={item.q} className="bg-white border border-slate-200 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 mb-2">{item.q}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-20">
        <div className="page-container text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to Start Learning German?</h2>
          <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
            Spaces fill up fast. Register today and take the first step toward fluency.
          </p>
          <Link href="#classes" className="inline-block bg-white text-emerald-600 font-bold px-10 py-4 rounded-xl hover:bg-emerald-50 transition-colors text-lg no-underline">
            Find Your Level →
          </Link>
        </div>
      </section>
    </>
  )
}
