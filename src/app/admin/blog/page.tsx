'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import type { BlogPost } from '@/lib/content'

const EMPTY: Partial<BlogPost> = {
  title: '', slug: '', excerpt: '', content: '', category: 'Technology',
  author: '', readTime: '5 min read', tags: [], published: false, featured: false,
  thumbnail: '', authorImage: '',
}

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function load() {
    const res = await fetch('/api/admin/blog')
    if (res.status === 401) { router.push('/admin/login'); return }
    setPosts(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    setSaving(true)
    const isNew = !posts.find(p => p.id === editing?.id)
    await fetch('/api/admin/blog', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editing, slug: editing?.slug || editing?.title?.toLowerCase().replace(/\s+/g, '-') }),
    })
    setMessage(isNew ? 'Post created!' : 'Post updated!')
    setEditing(null)
    load()
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    await fetch('/api/admin/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  async function togglePublish(post: BlogPost) {
    await fetch('/api/admin/blog', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, published: !post.published }),
    })
    load()
  }

  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8 flex items-center justify-center text-slate-400">Loading...</div>
    </div>
  )

  const inputCls = 'input-field'
  const labelCls = 'block text-sm font-semibold text-slate-700 mb-1.5'

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Blog Posts</h1>
            <p className="text-slate-500">{posts.length} total posts</p>
          </div>
          <button className="btn-primary" onClick={() => setEditing({ ...EMPTY })}>+ New Post</button>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5 text-green-700 font-semibold">{message}</div>
        )}

        {/* Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 z-50 overflow-auto p-6 flex items-start justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl mt-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-slate-900">{editing.id ? 'Edit Post' : 'New Post'}</h2>
                <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Title *', key: 'title' },
                  { label: 'Slug', key: 'slug' },
                  { label: 'Author', key: 'author' },
                  { label: 'Read Time', key: 'readTime' },
                ].map(f => (
                  <div key={f.key}>
                    <label className={labelCls}>{f.label}</label>
                    <input type="text" value={(editing as Record<string, unknown>)[f.key] as string ?? ''}
                      onChange={e => setEditing(p => ({ ...p, [f.key]: e.target.value }))} className={inputCls} />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className={labelCls}>Category</label>
                  <select value={editing.category ?? 'Technology'}
                    onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} className={inputCls}>
                    {['Technology', 'Design', 'Business', 'Learning Tips', 'Career', 'News'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Excerpt</label>
                  <textarea value={editing.excerpt ?? ''} onChange={e => setEditing(p => ({ ...p, excerpt: e.target.value }))}
                    rows={3} className={`${inputCls} resize-y`} />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Content (use ## headings, - for lists)</label>
                  <textarea value={editing.content ?? ''} onChange={e => setEditing(p => ({ ...p, content: e.target.value }))}
                    rows={12} className={`${inputCls} resize-y font-mono text-xs`}
                    placeholder="## Section Title&#10;&#10;Your paragraph here.&#10;&#10;- List item 1&#10;- List item 2" />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelCls}>Tags (comma-separated)</label>
                  <input type="text" value={(editing.tags ?? []).join(', ')}
                    onChange={e => setEditing(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))}
                    className={inputCls} />
                </div>

                <div className="sm:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={!!editing.published}
                      onChange={e => setEditing(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4 accent-indigo-600" />
                    Published
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={!!editing.featured}
                      onChange={e => setEditing(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 accent-indigo-600" />
                    Featured
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditing(null)} className="btn-secondary py-2 px-5">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5">
                  {saving ? 'Saving...' : 'Save Post'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {['Title', 'Category', 'Author', 'Read Time', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900 max-w-[250px] truncate">{p.title}</td>
                  <td className="px-4 py-3 text-slate-600">{p.category}</td>
                  <td className="px-4 py-3 text-slate-600">{p.author}</td>
                  <td className="px-4 py-3 text-slate-600">{p.readTime}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(p)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer border-0 ${p.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {p.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(p)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
