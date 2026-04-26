'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import type { GermanClass, Registration } from '@/lib/content'

const EMPTY: Partial<GermanClass> = {
  title: '', slug: '', shortDescription: '', description: '',
  level: 'A1', schedule: '', startDate: '', endDate: '',
  duration: '', sessions: 0, sessionLength: '90 minutes',
  location: 'Online (Zoom)', maxStudents: 12, currentStudents: 0,
  price: 0, currency: 'EUR', instructor: '', instructorBio: '',
  whatYouLearn: [], requirements: [], materials: [],
  tags: [], featured: false, published: false,
}

export default function AdminGermanClassesPage() {
  const router = useRouter()
  const [classes, setClasses] = useState<GermanClass[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Partial<GermanClass> | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [tab, setTab] = useState<'classes' | 'registrations'>('classes')

  async function load() {
    const [classRes, regRes] = await Promise.all([
      fetch('/api/admin/german-classes'),
      fetch('/api/admin/registrations'),
    ])
    if (classRes.status === 401) { router.push('/admin/login'); return }
    setClasses(await classRes.json())
    setRegistrations(await regRes.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    setSaving(true)
    const isNew = !classes.find(c => c.id === editing?.id)
    const slug = editing?.slug || editing?.title?.toLowerCase().replace(/\s+/g, '-') || ''
    await fetch('/api/admin/german-classes', {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editing, slug }),
    })
    setMessage(isNew ? 'Class created!' : 'Class updated!')
    setEditing(null)
    load()
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this class?')) return
    await fetch('/api/admin/german-classes', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    load()
  }

  async function togglePublish(cls: GermanClass) {
    await fetch('/api/admin/german-classes', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cls, published: !cls.published }),
    })
    load()
  }

  async function updateRegStatus(reg: Registration, status: Registration['status']) {
    await fetch('/api/admin/registrations', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...reg, status }),
    })
    load()
  }

  async function deleteReg(id: string) {
    if (!confirm('Delete this registration?')) return
    await fetch('/api/admin/registrations', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
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

  const STATUS_COLORS = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">German Classes</h1>
            <p className="text-slate-500">{classes.length} classes · {registrations.length} registrations</p>
          </div>
          {tab === 'classes' && (
            <button className="btn-primary" onClick={() => setEditing({ ...EMPTY })}>+ New Class</button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-200 rounded-lg p-1 w-fit">
          {(['classes', 'registrations'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors capitalize ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {t} {t === 'registrations' && registrations.filter(r => r.status === 'pending').length > 0 && (
                <span className="ml-1.5 bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5">
                  {registrations.filter(r => r.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5 text-green-700 font-semibold">{message}</div>
        )}

        {/* Class modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/50 z-50 overflow-auto p-6 flex items-start justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl mt-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-slate-900">{editing.id ? 'Edit Class' : 'New Class'}</h2>
                <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">×</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelCls}>Title *</label>
                  <input type="text" value={editing.title ?? ''} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} className={inputCls} placeholder="Deutsch A1 — Absolute Beginner" />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <input type="text" value={editing.slug ?? ''} onChange={e => setEditing(p => ({ ...p, slug: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Level</label>
                  <select value={editing.level ?? 'A1'} onChange={e => setEditing(p => ({ ...p, level: e.target.value }))} className={inputCls}>
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Price (EUR)</label>
                  <input type="number" value={editing.price ?? 0} onChange={e => setEditing(p => ({ ...p, price: Number(e.target.value) }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Max Students</label>
                  <input type="number" value={editing.maxStudents ?? 12} onChange={e => setEditing(p => ({ ...p, maxStudents: Number(e.target.value) }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Schedule</label>
                  <input type="text" value={editing.schedule ?? ''} onChange={e => setEditing(p => ({ ...p, schedule: e.target.value }))} className={inputCls} placeholder="Mon & Wed, 18:00–19:30" />
                </div>
                <div>
                  <label className={labelCls}>Location</label>
                  <input type="text" value={editing.location ?? ''} onChange={e => setEditing(p => ({ ...p, location: e.target.value }))} className={inputCls} placeholder="Online (Zoom)" />
                </div>
                <div>
                  <label className={labelCls}>Start Date</label>
                  <input type="date" value={editing.startDate ?? ''} onChange={e => setEditing(p => ({ ...p, startDate: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>End Date</label>
                  <input type="date" value={editing.endDate ?? ''} onChange={e => setEditing(p => ({ ...p, endDate: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Duration (e.g. 8 weeks)</label>
                  <input type="text" value={editing.duration ?? ''} onChange={e => setEditing(p => ({ ...p, duration: e.target.value }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Sessions</label>
                  <input type="number" value={editing.sessions ?? 0} onChange={e => setEditing(p => ({ ...p, sessions: Number(e.target.value) }))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Instructor</label>
                  <input type="text" value={editing.instructor ?? ''} onChange={e => setEditing(p => ({ ...p, instructor: e.target.value }))} className={inputCls} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Short Description</label>
                  <textarea value={editing.shortDescription ?? ''} onChange={e => setEditing(p => ({ ...p, shortDescription: e.target.value }))} rows={2} className={`${inputCls} resize-y`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Full Description</label>
                  <textarea value={editing.description ?? ''} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} rows={4} className={`${inputCls} resize-y`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>What You&apos;ll Learn (one per line)</label>
                  <textarea value={(editing.whatYouLearn ?? []).join('\n')}
                    onChange={e => setEditing(p => ({ ...p, whatYouLearn: e.target.value.split('\n').filter(Boolean) }))}
                    rows={4} className={`${inputCls} resize-y`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Requirements (one per line)</label>
                  <textarea value={(editing.requirements ?? []).join('\n')}
                    onChange={e => setEditing(p => ({ ...p, requirements: e.target.value.split('\n').filter(Boolean) }))}
                    rows={3} className={`${inputCls} resize-y`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>Tags (comma-separated)</label>
                  <input type="text" value={(editing.tags ?? []).join(', ')}
                    onChange={e => setEditing(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} className={inputCls} />
                </div>
                <div className="sm:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={!!editing.published} onChange={e => setEditing(p => ({ ...p, published: e.target.checked }))} className="w-4 h-4 accent-emerald-600" />
                    Published
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                    <input type="checkbox" checked={!!editing.featured} onChange={e => setEditing(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 accent-emerald-600" />
                    Featured
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditing(null)} className="btn-secondary py-2 px-5">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-5">
                  {saving ? 'Saving...' : 'Save Class'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Classes table */}
        {tab === 'classes' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Title', 'Level', 'Schedule', 'Price', 'Spots', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classes.map(c => {
                  const spotsLeft = c.maxStudents - c.currentStudents
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 truncate max-w-[200px]">{c.title}</p>
                        <p className="text-xs text-slate-400">{c.instructor}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{c.level}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs max-w-[140px]">{c.schedule}</td>
                      <td className="px-4 py-3 font-bold text-emerald-600">{c.currency} {c.price}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{spotsLeft}/{c.maxStudents}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => togglePublish(c)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer border-0 ${c.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {c.published ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => setEditing(c)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors">Edit</button>
                          <button onClick={() => handleDelete(c.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {classes.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-slate-400">No classes yet. Create your first one.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Registrations table */}
        {tab === 'registrations' && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['Student', 'Email', 'Class', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{r.firstName} {r.lastName}</p>
                      {r.phone && <p className="text-xs text-slate-400">{r.phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{r.email}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs max-w-[160px] truncate">{r.className}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <select value={r.status}
                        onChange={e => updateRegStatus(r, e.target.value as Registration['status'])}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[r.status]}`}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteReg(r.id)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
                {registrations.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">No registrations yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
