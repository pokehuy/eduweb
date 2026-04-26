import type { Metadata } from 'next'
import { getSiteConfig } from '@/lib/content'
import { getDict } from '@/i18n'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about EduLearn\'s mission to make quality education accessible to everyone worldwide.',
  alternates: { canonical: '/about' },
}

const team = [
  { name: 'Sarah Johnson', role: 'CEO & Co-Founder', bio: 'Former Google engineer and education advocate with 15 years in tech.', initials: 'SJ' },
  { name: 'Dr. Michael Chen', role: 'Head of Content', bio: 'PhD in Computer Science, passionate about making complex topics accessible.', initials: 'MC' },
  { name: 'Emma Rodriguez', role: 'Design Director', bio: 'Award-winning designer who believes great learning starts with great UX.', initials: 'ER' },
  { name: 'James Wilson', role: 'Head of Growth', bio: 'Growth marketer who has scaled education platforms to millions of users.', initials: 'JW' },
]

const valueIcons = ['🌍', '✨', '🤝', '🚀']

export default async function AboutPage() {
  const [dict, site] = await Promise.all([getDict(), Promise.resolve(getSiteConfig())])
  const d = dict.about
  const values = Object.values(d.values).filter((v): v is { title: string; desc: string } => typeof v === 'object' && 'title' in v)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 to-indigo-50 py-20 text-center">
        <div className="page-container max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">{d.heroTitle}</h1>
          <p className="text-lg text-slate-500 leading-relaxed">{site.description}</p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="page-container max-w-3xl mx-auto">
          <h2 className="section-title text-center">{d.story.title}</h2>
          <div className="mt-6 space-y-5 text-slate-600 leading-relaxed text-lg">
            <p>{d.story.p1}</p>
            <p>{d.story.p2}</p>
            <p>{d.story.p3}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-slate-50">
        <div className="page-container">
          <h2 className="section-title text-center mb-12">{d.values.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                <div className="text-4xl mb-4">{valueIcons[i]}</div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="page-container">
          <h2 className="section-title text-center mb-12">{d.team.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map(member => (
              <div key={member.name} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl">
                  {member.initials}
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-indigo-600 text-sm font-semibold mb-2">{member.role}</p>
                <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section bg-slate-50">
        <div className="page-container text-center max-w-md mx-auto">
          <h2 className="section-title">{d.contact.title}</h2>
          <p className="text-slate-500 mb-6">{d.contact.desc}</p>
          <div className="space-y-3 text-slate-600">
            <a href={`mailto:${site.email}`} className="block text-indigo-600 font-semibold hover:underline no-underline">{site.email}</a>
            <p>{site.phone}</p>
            <p className="text-sm">{site.address}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
