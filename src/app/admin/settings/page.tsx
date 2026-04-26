'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import type { SiteConfig, HeroSlide } from '@/lib/content'

const SLIDE_GRADIENTS = [
  'from-indigo-600 via-violet-600 to-sky-500',
  'from-emerald-600 via-teal-600 to-cyan-500',
  'from-rose-600 via-pink-600 to-fuchsia-500',
  'from-amber-500 via-orange-500 to-red-500',
  'from-slate-700 via-slate-800 to-slate-900',
]

const EMPTY_SLIDE: HeroSlide = {
  id: '',
  headline: '',
  subheadline: '',
  ctaPrimary: '',
  ctaPrimaryHref: '/',
  ctaSecondary: '',
  ctaSecondaryHref: '/',
  gradient: SLIDE_GRADIENTS[0],
  badge: '',
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [activeSection, setActiveSection] = useState('general')
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null)

  async function load() {
    const res = await fetch('/api/admin/settings')
    if (res.status === 401) { router.push('/admin/login'); return }
    const data = await res.json()
    if (!data.heroSlides) data.heroSlides = []
    setConfig(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    if (res.ok) {
      setMessage('Settings saved successfully!')
      setTimeout(() => setMessage(''), 3000)
    }
    setSaving(false)
  }

  function update(path: string, value: unknown) {
    setConfig(prev => {
      if (!prev) return prev
      const keys = path.split('.')
      const next = { ...prev } as Record<string, unknown>
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = { ...(cur[keys[i]] as Record<string, unknown>) }
        cur = cur[keys[i]] as Record<string, unknown>
      }
      cur[keys[keys.length - 1]] = value
      return next as unknown as SiteConfig
    })
  }

  function openSlideEditor(slide: HeroSlide | null, index: number | null) {
    setEditingSlide(slide ? { ...slide } : { ...EMPTY_SLIDE, id: `slide-${Date.now()}` })
    setEditingSlideIndex(index)
  }

  function saveSlide() {
    if (!editingSlide || !config) return
    const slides = [...(config.heroSlides ?? [])]
    if (editingSlideIndex === null) {
      slides.push(editingSlide)
    } else {
      slides[editingSlideIndex] = editingSlide
    }
    update('heroSlides', slides)
    setEditingSlide(null)
    setEditingSlideIndex(null)
  }

  function deleteSlide(index: number) {
    if (!config) return
    const slides = (config.heroSlides ?? []).filter((_, i) => i !== index)
    update('heroSlides', slides)
  }

  function moveSlide(index: number, direction: 'up' | 'down') {
    if (!config) return
    const slides = [...(config.heroSlides ?? [])]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= slides.length) return
    ;[slides[index], slides[targetIndex]] = [slides[targetIndex], slides[index]]
    update('heroSlides', slides)
  }

  if (loading || !config) return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8 flex items-center justify-center text-slate-400">Loading...</div>
    </div>
  )

  const inputCls = 'input-field'
  const labelCls = 'block text-sm font-semibold text-slate-700 mb-1.5'
  const sectionCls = 'bg-white border border-slate-200 rounded-2xl p-6 mb-5'

  const sections = [
    { id: 'general', label: 'General', icon: '🏠' },
    { id: 'hero', label: 'Hero & Slides', icon: '🖼️' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'seo', label: 'SEO', icon: '🔍' },
    { id: 'social', label: 'Social', icon: '🔗' },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {/* Top header */}
        <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Site Settings</h1>
            <p className="text-slate-400 text-sm">Configure your site content and CMS</p>
          </div>
          <button className="btn-primary py-2 px-5" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="p-8 flex gap-6 items-start">
          {/* Section nav */}
          <div className="w-48 shrink-0 bg-white border border-slate-200 rounded-2xl p-2 sticky top-24">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors border-0 cursor-pointer ${
                  activeSection === s.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 bg-transparent'
                }`}>
                <span>{s.icon}</span> {s.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 max-w-2xl">
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 text-green-700 font-semibold text-sm flex items-center gap-2">
                ✅ {message}
              </div>
            )}

            {/* General */}
            {activeSection === 'general' && (
              <div className={sectionCls}>
                <h2 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2">🏠 General</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Site Name', path: 'name', value: config.name },
                    { label: 'Site URL', path: 'url', value: config.url },
                    { label: 'Email', path: 'email', value: config.email },
                    { label: 'Phone', path: 'phone', value: config.phone },
                  ].map(f => (
                    <div key={f.path}>
                      <label className={labelCls}>{f.label}</label>
                      <input type="text" value={f.value} onChange={e => update(f.path, e.target.value)} className={inputCls} />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Tagline</label>
                    <input type="text" value={config.tagline} onChange={e => update('tagline', e.target.value)} className={inputCls} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Description</label>
                    <textarea value={config.description} onChange={e => update('description', e.target.value)} rows={3} className={`${inputCls} resize-y`} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Address</label>
                    <input type="text" value={config.address} onChange={e => update('address', e.target.value)} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {/* Hero & Slides */}
            {activeSection === 'hero' && (
              <>
                {/* Slide editor modal */}
                {editingSlide && (
                  <div className="fixed inset-0 bg-black/50 z-50 overflow-auto p-6 flex items-start justify-center">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-2xl mt-8 mb-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-extrabold text-slate-900">
                          {editingSlideIndex === null ? 'New Slide' : 'Edit Slide'}
                        </h3>
                        <button onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none border-0 bg-transparent cursor-pointer">×</button>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className={labelCls}>Badge Text</label>
                          <input type="text" value={editingSlide.badge} onChange={e => setEditingSlide(p => p ? { ...p, badge: e.target.value } : p)} className={inputCls} placeholder="🎓 500+ Courses Available" />
                        </div>
                        <div>
                          <label className={labelCls}>Headline</label>
                          <input type="text" value={editingSlide.headline} onChange={e => setEditingSlide(p => p ? { ...p, headline: e.target.value } : p)} className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>Subheadline</label>
                          <textarea value={editingSlide.subheadline} onChange={e => setEditingSlide(p => p ? { ...p, subheadline: e.target.value } : p)} rows={3} className={`${inputCls} resize-y`} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelCls}>Primary Button Label</label>
                            <input type="text" value={editingSlide.ctaPrimary} onChange={e => setEditingSlide(p => p ? { ...p, ctaPrimary: e.target.value } : p)} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Primary Button URL</label>
                            <input type="text" value={editingSlide.ctaPrimaryHref} onChange={e => setEditingSlide(p => p ? { ...p, ctaPrimaryHref: e.target.value } : p)} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Secondary Button Label</label>
                            <input type="text" value={editingSlide.ctaSecondary} onChange={e => setEditingSlide(p => p ? { ...p, ctaSecondary: e.target.value } : p)} className={inputCls} />
                          </div>
                          <div>
                            <label className={labelCls}>Secondary Button URL</label>
                            <input type="text" value={editingSlide.ctaSecondaryHref} onChange={e => setEditingSlide(p => p ? { ...p, ctaSecondaryHref: e.target.value } : p)} className={inputCls} />
                          </div>
                        </div>
                        <div>
                          <label className={labelCls}>Background Gradient</label>
                          <div className="grid grid-cols-5 gap-2 mt-2">
                            {SLIDE_GRADIENTS.map(g => (
                              <button key={g} onClick={() => setEditingSlide(p => p ? { ...p, gradient: g } : p)}
                                className={`h-10 rounded-lg bg-gradient-to-br ${g} border-2 transition-all cursor-pointer ${editingSlide.gradient === g ? 'border-slate-900 scale-105' : 'border-transparent hover:scale-105'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setEditingSlide(null)} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                        <button onClick={saveSlide} className="btn-primary py-2 px-4 text-sm">Save Slide</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hero slides */}
                <div className={sectionCls}>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">🖼️ Hero Slides</h2>
                    <button onClick={() => openSlideEditor(null, null)} className="btn-primary py-1.5 px-4 text-sm">+ Add Slide</button>
                  </div>
                  <p className="text-sm text-slate-500 mb-5">Slides auto-advance every 5 seconds. Drag or use arrows to reorder.</p>

                  {(config.heroSlides ?? []).length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                      <div className="text-3xl mb-2">🖼️</div>
                      <p className="text-sm font-medium">No slides yet. Add your first slide.</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {(config.heroSlides ?? []).map((slide, i) => (
                      <div key={slide.id} className="flex items-center gap-3 border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors">
                        {/* Gradient preview */}
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${slide.gradient} shrink-0`} />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{slide.headline}</p>
                          <p className="text-xs text-slate-400 truncate">{slide.badge}</p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => moveSlide(i, 'up')} disabled={i === 0}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 disabled:opacity-30 transition-colors cursor-pointer bg-transparent text-xs">↑</button>
                          <button onClick={() => moveSlide(i, 'down')} disabled={i === (config.heroSlides ?? []).length - 1}
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 disabled:opacity-30 transition-colors cursor-pointer bg-transparent text-xs">↓</button>
                          <button onClick={() => openSlideEditor(slide, i)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors bg-transparent cursor-pointer">Edit</button>
                          <button onClick={() => deleteSlide(i)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors bg-transparent cursor-pointer">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legacy hero */}
                <div className={sectionCls}>
                  <h2 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">🔧 Fallback Hero</h2>
                  <p className="text-sm text-slate-400 mb-5">Used when no slides are configured.</p>
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Headline</label>
                      <input type="text" value={config.hero.headline} onChange={e => update('hero.headline', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Subheadline</label>
                      <textarea value={config.hero.subheadline} onChange={e => update('hero.subheadline', e.target.value)} rows={3} className={`${inputCls} resize-y`} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Primary Button</label>
                        <input type="text" value={config.hero.ctaPrimary} onChange={e => update('hero.ctaPrimary', e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Secondary Button</label>
                        <input type="text" value={config.hero.ctaSecondary} onChange={e => update('hero.ctaSecondary', e.target.value)} className={inputCls} />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Stats */}
            {activeSection === 'stats' && (
              <div className={sectionCls}>
                <h2 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2">📊 Stats</h2>
                <div className="space-y-3">
                  {config.stats.map((stat, i) => (
                    <div key={i} className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4">
                      <div>
                        <label className={labelCls}>Value</label>
                        <input type="text" value={stat.value} onChange={e => {
                          const stats = [...config.stats]; stats[i] = { ...stats[i], value: e.target.value }; update('stats', stats)
                        }} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Label</label>
                        <input type="text" value={stat.label} onChange={e => {
                          const stats = [...config.stats]; stats[i] = { ...stats[i], label: e.target.value }; update('stats', stats)
                        }} className={inputCls} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SEO */}
            {activeSection === 'seo' && (
              <div className={sectionCls}>
                <h2 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2">🔍 SEO</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Default Title', path: 'seo.defaultTitle', value: config.seo.defaultTitle },
                    { label: 'Title Template (%s = page title)', path: 'seo.titleTemplate', value: config.seo.titleTemplate },
                    { label: 'Twitter Handle', path: 'seo.twitterHandle', value: config.seo.twitterHandle },
                  ].map(f => (
                    <div key={f.path}>
                      <label className={labelCls}>{f.label}</label>
                      <input type="text" value={f.value} onChange={e => update(f.path, e.target.value)} className={inputCls} />
                    </div>
                  ))}
                  <div>
                    <label className={labelCls}>Default Meta Description</label>
                    <textarea value={config.seo.defaultDescription} onChange={e => update('seo.defaultDescription', e.target.value)} rows={3} className={`${inputCls} resize-y`} />
                  </div>
                  <div>
                    <label className={labelCls}>Keywords (comma-separated)</label>
                    <input type="text" value={config.seo.keywords.join(', ')}
                      onChange={e => update('seo.keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))} className={inputCls} />
                  </div>
                </div>
              </div>
            )}

            {/* Social */}
            {activeSection === 'social' && (
              <div className={sectionCls}>
                <h2 className="font-bold text-slate-900 text-base mb-5 flex items-center gap-2">🔗 Social Links</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Twitter / X', path: 'social.twitter', value: config.social.twitter },
                    { label: 'LinkedIn', path: 'social.linkedin', value: config.social.linkedin },
                    { label: 'YouTube', path: 'social.youtube', value: config.social.youtube },
                    { label: 'Facebook', path: 'social.facebook', value: config.social.facebook },
                  ].map(f => (
                    <div key={f.path}>
                      <label className={labelCls}>{f.label}</label>
                      <input type="url" value={f.value} onChange={e => update(f.path, e.target.value)} className={inputCls} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pb-8">
              <button className="btn-primary px-8" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
