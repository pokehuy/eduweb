import Link from 'next/link'
import { getPublishedGermanClasses } from '@/lib/content'
import { getDict } from '@/i18n'

export const metadata = {
  title: 'German Language Classes',
  description: 'Learn German with expert teachers. Structured classes from A1 to C2, small groups, and proven methods.',
}

export default async function GermanClassesPage() {
  const [classes, dict] = await Promise.all([
    Promise.resolve(getPublishedGermanClasses()),
    getDict(),
  ])
  const d = dict.germanClasses

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500 text-white py-24">
        <div className="page-container text-center max-w-3xl mx-auto">
          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
            {d.heroBadge}
          </span>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            {d.heroHeadline}
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed max-w-2xl mx-auto">
            {d.heroSubheadline}
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

      {/* Stats strip */}
      <section className="bg-slate-50 border-y border-slate-200 py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '👨‍🏫', value: d.statStudentsValue, label: d.statStudentsLabel },
              { icon: '🎓', value: d.statTeachersValue, label: d.statTeachersLabel },
              { icon: '📜', value: d.statExamValue, label: d.statExamLabel },
              { icon: '🌐', value: d.statModeValue, label: d.statModeLabel },
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
            <h2 className="section-title">{d.upcomingTitle}</h2>
            <p className="section-subtitle">{d.upcomingDesc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map(cls => {
              const spotsLeft = cls.maxStudents - cls.currentStudents
              const isFull = spotsLeft <= 0
              const gradientTop = cls.level === 'A1'
                ? 'from-emerald-500 to-teal-600'
                : cls.level === 'A2'
                ? 'from-teal-500 to-cyan-600'
                : 'from-cyan-500 to-blue-600'

              return (
                <div key={cls.id} className="card flex flex-col">
                  <div className={`bg-gradient-to-br ${gradientTop} p-6 rounded-t-xl`}>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/25 text-white">
                        Level {cls.level}
                      </span>
                      {cls.featured && (
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-400 text-amber-900">
                          {d.popularBadge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-extrabold text-white mb-1">{cls.title}</h3>
                    <p className="text-white/80 text-sm">{cls.duration} · {cls.sessions} {d.sessions}</p>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">{cls.shortDescription}</p>

                    <div className="space-y-2 mb-5 text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="text-base">📅</span><span>{cls.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="text-base">🗓</span>
                        <span>{d.startsOn} {new Date(cls.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="text-base">📍</span><span>{cls.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <span className="text-base">👥</span>
                        <span>
                          {isFull
                            ? d.classFull
                            : `${spotsLeft} ${spotsLeft === 1 ? d.spotLeft : d.spotsLeft}`}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-extrabold text-emerald-600">{cls.currency} {cls.price}</span>
                        <span className="text-slate-400 text-sm">{d.perCourse}</span>
                      </div>
                      <Link
                        href={`/german-classes/${cls.slug}`}
                        className="w-full inline-flex justify-center items-center gap-2 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all no-underline text-sm"
                      >
                        {isFull ? d.joinWaitlist : `${d.viewAndRegister} →`}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {classes.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <div className="text-5xl mb-4">🇩🇪</div>
              <p className="text-lg font-semibold">{d.noClasses}</p>
              <p className="text-sm mt-1">{d.noClassesSub}</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-slate-50">
        <div className="page-container max-w-4xl">
          <h2 className="section-title text-center mb-2">{d.faqTitle}</h2>
          <p className="section-subtitle text-center mx-auto mb-10">{d.faqDesc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {d.faqs.map(item => (
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
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">{d.ctaTitle}</h2>
          <p className="text-emerald-100 text-lg mb-8 leading-relaxed">{d.ctaDesc}</p>
          <Link href="#" className="inline-block bg-white text-emerald-600 font-bold px-10 py-4 rounded-xl hover:bg-emerald-50 transition-colors text-lg no-underline">
            {d.ctaBtn}
          </Link>
        </div>
      </section>
    </>
  )
}
