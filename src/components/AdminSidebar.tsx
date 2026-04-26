'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navGroups = [
  {
    label: 'Content',
    items: [
      { href: '/admin/courses', label: 'Courses', icon: '📚', description: 'Manage online courses' },
      { href: '/admin/german-classes', label: 'German Classes', icon: '🇩🇪', description: 'Classes & registrations' },
      { href: '/admin/blog', label: 'Blog', icon: '✍️', description: 'Articles & posts' },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/settings', label: 'Site Settings', icon: '⚙️', description: 'Config & CMS' },
    ],
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col shrink-0 border-r border-slate-800">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-lg">E</div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">EduLearn</div>
            <div className="text-slate-500 text-xs">Admin Console</div>
          </div>
        </div>
      </div>

      {/* Dashboard link */}
      <div className="px-3 pt-3">
        <Link href="/admin"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold no-underline transition-all ${
            pathname === '/admin'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}>
          <span className="text-base w-5 text-center">📊</span>
          <span>Dashboard</span>
        </Link>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-xs font-bold uppercase tracking-widest text-slate-600">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname.startsWith(item.href)
                return (
                  <Link key={item.href} href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium no-underline transition-all ${
                      active
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    }`}>
                    <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-800 space-y-0.5">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-800 hover:text-white no-underline transition-all">
          <span className="w-5 text-center">🌐</span>
          <span>View Site</span>
          <span className="ml-auto text-slate-600 text-xs">↗</span>
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all border-0 bg-transparent cursor-pointer">
          <span className="w-5 text-center">🚪</span>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  )
}
