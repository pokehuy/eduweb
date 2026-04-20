import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'
import { getCourses, getBlogPosts, getSiteConfig } from '@/lib/content'
import AdminSidebar from '@/components/AdminSidebar'
import Link from 'next/link'

export default async function AdminDashboard() {
  const isAdmin = await getAdminSession()
  if (!isAdmin) redirect('/admin/login')

  const courses = getCourses()
  const posts = getBlogPosts()
  const site = getSiteConfig()

  const stats = [
    { label: 'Total Courses', value: courses.length, icon: '📚', href: '/admin/courses', color: 'text-indigo-600' },
    { label: 'Published', value: courses.filter(c => c.published).length, icon: '✅', href: '/admin/courses', color: 'text-green-600' },
    { label: 'Blog Posts', value: posts.length, icon: '✍️', href: '/admin/blog', color: 'text-cyan-600' },
    { label: 'Published Posts', value: posts.filter(p => p.published).length, icon: '📢', href: '/admin/blog', color: 'text-amber-600' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here&apos;s your content overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <Link key={s.label} href={s.href} className="no-underline">
              <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className={`text-3xl font-extrabold mb-1 ${s.color}`}>{s.value}</div>
                <div className="text-sm text-slate-500">{s.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Courses */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-900">Recent Courses</h2>
              <Link href="/admin/courses" className="text-indigo-600 text-sm font-semibold no-underline hover:underline">View all →</Link>
            </div>
            <div className="space-y-3">
              {courses.slice(0, 4).map(c => (
                <div key={c.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-sm text-slate-900 truncate max-w-[200px]">{c.title}</p>
                    <p className="text-xs text-slate-400">{c.category} · {c.level}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {c.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Posts */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-slate-900">Recent Blog Posts</h2>
              <Link href="/admin/blog" className="text-indigo-600 text-sm font-semibold no-underline hover:underline">View all →</Link>
            </div>
            <div className="space-y-3">
              {posts.slice(0, 4).map(p => (
                <div key={p.id} className="flex justify-between items-center pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-sm text-slate-900 truncate max-w-[200px]">{p.title}</p>
                    <p className="text-xs text-slate-400">{p.category} · {p.readTime}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Site Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-slate-900">Site Info</h2>
            <Link href="/admin/settings" className="text-indigo-600 text-sm font-semibold no-underline hover:underline">Edit →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div><span className="text-slate-500">Name: </span><span className="font-semibold">{site.name}</span></div>
            <div><span className="text-slate-500">Email: </span><span className="font-semibold">{site.email}</span></div>
            <div><span className="text-slate-500">URL: </span><span className="font-semibold">{site.url}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
