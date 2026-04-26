import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import { getCourses, getBlogPosts, getSiteConfig, getGermanClasses, getRegistrations } from '@/lib/content'
import AdminSidebar from '@/components/AdminSidebar'
import Link from 'next/link'

export default async function AdminDashboard() {
  const isAdmin = await getAdminSession()
  if (!isAdmin) redirect('/admin/login')

  const courses = getCourses()
  const posts = getBlogPosts()
  const germanClasses = getGermanClasses()
  const registrations = getRegistrations()
  const site = getSiteConfig()

  const stats = [
    {
      label: 'Courses',
      value: courses.length,
      sub: `${courses.filter(c => c.published).length} published`,
      icon: '📚',
      href: '/admin/courses',
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-100',
    },
    {
      label: 'German Classes',
      value: germanClasses.length,
      sub: `${germanClasses.filter(c => c.published).length} published`,
      icon: '🇩🇪',
      href: '/admin/german-classes',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-100',
    },
    {
      label: 'Registrations',
      value: registrations.length,
      sub: `${registrations.filter(r => r.status === 'pending').length} pending`,
      icon: '📋',
      href: '/admin/german-classes',
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-100',
    },
    {
      label: 'Blog Posts',
      value: posts.length,
      sub: `${posts.filter(p => p.published).length} published`,
      icon: '✍️',
      href: '/admin/blog',
      color: 'from-cyan-500 to-sky-600',
      textColor: 'text-cyan-100',
    },
  ]

  const pendingRegistrations = registrations.filter(r => r.status === 'pending')

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {/* Top header */}
        <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Dashboard</h1>
            <p className="text-slate-400 text-sm">Overview of your site content</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/courses" className="btn-primary py-2 px-4 text-sm">+ New Course</Link>
          </div>
        </div>

        <div className="p-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <Link key={s.label} href={s.href} className="no-underline group">
                <div className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-2xl">{s.icon}</div>
                    <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full group-hover:bg-white/30 transition-colors">→</span>
                  </div>
                  <div className="text-3xl font-extrabold mb-1">{s.value}</div>
                  <div className="font-semibold text-sm opacity-90">{s.label}</div>
                  <div className={`text-xs mt-1 ${s.textColor} opacity-75`}>{s.sub}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Recent courses */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Recent Courses</h2>
                <Link href="/admin/courses" className="text-indigo-600 text-xs font-semibold no-underline hover:underline">View all →</Link>
              </div>
              <div className="divide-y divide-slate-50">
                {courses.slice(0, 5).map(c => (
                  <div key={c.id} className="flex justify-between items-center px-6 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">{c.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{c.category} · {c.level}</p>
                    </div>
                    <span className={`shrink-0 ml-3 text-xs font-semibold px-2 py-0.5 rounded-full ${c.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {c.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                ))}
                {courses.length === 0 && <p className="px-6 py-8 text-sm text-slate-400 text-center">No courses yet.</p>}
              </div>
            </div>

            {/* Recent blog posts */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">Recent Blog Posts</h2>
                <Link href="/admin/blog" className="text-indigo-600 text-xs font-semibold no-underline hover:underline">View all →</Link>
              </div>
              <div className="divide-y divide-slate-50">
                {posts.slice(0, 5).map(p => (
                  <div key={p.id} className="flex justify-between items-center px-6 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">{p.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{p.category} · {p.readTime}</p>
                    </div>
                    <span className={`shrink-0 ml-3 text-xs font-semibold px-2 py-0.5 rounded-full ${p.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                ))}
                {posts.length === 0 && <p className="px-6 py-8 text-sm text-slate-400 text-center">No posts yet.</p>}
              </div>
            </div>

            {/* Pending registrations */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">
                  Registrations
                  {pendingRegistrations.length > 0 && (
                    <span className="ml-2 bg-amber-500 text-white text-xs rounded-full px-2 py-0.5">{pendingRegistrations.length}</span>
                  )}
                </h2>
                <Link href="/admin/german-classes" className="text-indigo-600 text-xs font-semibold no-underline hover:underline">Manage →</Link>
              </div>
              <div className="divide-y divide-slate-50">
                {registrations.slice(0, 5).map(r => (
                  <div key={r.id} className="flex justify-between items-center px-6 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-900 truncate">{r.firstName} {r.lastName}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{r.className}</p>
                    </div>
                    <span className={`shrink-0 ml-3 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.status === 'confirmed' ? 'bg-green-100 text-green-700'
                      : r.status === 'cancelled' ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </div>
                ))}
                {registrations.length === 0 && <p className="px-6 py-8 text-sm text-slate-400 text-center">No registrations yet.</p>}
              </div>
            </div>
          </div>

          {/* Site info */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-900">Site Configuration</h2>
              <Link href="/admin/settings" className="text-indigo-600 text-xs font-semibold no-underline hover:underline">Edit settings →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Site Name</p>
                <p className="font-semibold text-slate-900">{site.name}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Email</p>
                <p className="font-semibold text-slate-900">{site.email}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">URL</p>
                <p className="font-semibold text-slate-900 truncate">{site.url}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
