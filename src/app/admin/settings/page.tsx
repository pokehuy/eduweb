'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import ImageUpload from '@/components/ImageUpload'
import type { SiteConfig, HeroSlide, FAQ } from '@/lib/content'

const SLIDE_GRADIENTS = [
  'from-indigo-600 via-violet-600 to-sky-500',
  'from-emerald-600 via-teal-600 to-cyan-500',
  'from-rose-600 via-pink-600 to-fuchsia-500',
  'from-amber-500 via-orange-500 to-red-500',
  'from-slate-700 via-slate-800 to-slate-900',
  'from-blue-600 via-blue-700 to-indigo-800',
]

const EMPTY_SLIDE: HeroSlide = {
  id: '', headline: '', subheadline: '',
  ctaPrimary: '', ctaPrimaryHref: '/',
  ctaSecondary: '', ctaSecondaryHref: '/',
  gradient: SLIDE_GRADIENTS[0], badge: '',
}

const SECTIONS = [
  { id: 'general', label: 'General', icon: '🏠' },
  { id: 'contact', label: 'Contact', icon: '📍' },
  { id: 'social', label: 'Social', icon: '🔗' },
  { id: 'hero', label: 'Hero & Slides', icon: '🖼️' },
  { id: 'stats', label: 'Stats', icon: '📊' },
  { id: 'features', label: 'Features', icon: '✨' },
  { id: 'german', label: 'German Classes', icon: '🇩🇪' },
  { id: 'about', label: 'About Page', icon: '📖' },
  { id: 'footer', label: 'Footer', icon: '🔻' },
  { id: 'seo', label: 'SEO', icon: '🔍' },
]

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
    if (!data.germanFAQs) data.germanFAQs = []
    if (!data.mapLink) data.mapLink = ''
    if (!data.social?.instagram) data.social = { ...(data.social ?? {}), instagram: '' }
    if (!data.aboutSection) data.aboutSection = { heroTitle: '', story: { title: '', p1: '', p2: '', p3: '' }, values: [], teamTitle: '', contactTitle: '', contactDesc: '' }
    if (!data.footer) data.footer = { copyrightName: data.name, privacyLink: '/privacy', termsLink: '/terms' }
    setConfig(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    setSaving(true)
    const res = await fetch('/api/admin/settings', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    if (res.ok) { setMessage('Settings saved!'); setTimeout(() => setMessage(''), 3000) }
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

  // FAQ helpers
  function updateFaq(index: number, field: 'q' | 'a', value: string) {
    if (!config) return
    const faqs = [...config.germanFAQs]
    faqs[index] = { ...faqs[index], [field]: value }
    update('germanFAQs', faqs)
  }
  function addFaq() {
    if (!config) return
    update('germanFAQs', [...config.germanFAQs, { q: '', a: '' }])
  }
  function deleteFaq(index: number) {
    if (!config) return
    update('germanFAQs', config.germanFAQs.filter((_, i) => i !== index))
  }
  function moveFaq(index: number, dir: 'up' | 'down') {
    if (!config) return
    const faqs = [...config.germanFAQs]
    const t = dir === 'up' ? index - 1 : index + 1
    if (t < 0 || t >= faqs.length) return
    ;[faqs[index], faqs[t]] = [faqs[t], faqs[index]]
    update('germanFAQs', faqs)
  }

  // About values helpers
  function updateValue(index: number, field: string, value: string) {
    if (!config) return
    const vals = [...(config.aboutSection?.values ?? [])]
    vals[index] = { ...vals[index], [field]: value }
    update('aboutSection.values', vals)
  }
  function addValue() {
    if (!config) return
    update('aboutSection.values', [...(config.aboutSection?.values ?? []), { icon: '✨', title: '', description: '' }])
  }
  function deleteValue(index: number) {
    if (!config) return
    update('aboutSection.values', (config.aboutSection?.values ?? []).filter((_, i) => i !== index))
  }

  // Slide helpers
  function openSlideEditor(slide: HeroSlide | null, index: number | null) {
    setEditingSlide(slide ? { ...slide } : { ...EMPTY_SLIDE, id: `slide-${Date.now()}` })
    setEditingSlideIndex(index)
  }
  function saveSlide() {
    if (!editingSlide || !config) return
    const slides = [...(config.heroSlides ?? [])]
    editingSlideIndex === null ? slides.push(editingSlide) : (slides[editingSlideIndex] = editingSlide)
    update('heroSlides', slides)
    setEditingSlide(null); setEditingSlideIndex(null)
  }
  function deleteSlide(i: number) {
    if (!config) return
    update('heroSlides', (config.heroSlides ?? []).filter((_, idx) => idx !== i))
  }
  function moveSlide(i: number, dir: 'up' | 'down') {
    if (!config) return
    const slides = [...(config.heroSlides ?? [])]
    const t = dir === 'up' ? i - 1 : i + 1
    if (t < 0 || t >= slides.length) return
    ;[slides[i], slides[t]] = [slides[t], slides[i]]
    update('heroSlides', slides)
  }

  if (loading || !config) return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 flex items-center justify-center text-slate-400">Loading...</div>
    </div>
  )

  const inp = 'input-field'
  const lbl = 'block text-sm font-semibold text-slate-700 mb-1.5'
  const card = 'bg-white border border-slate-200 rounded-2xl p-6 mb-5'

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">

        {/* Slide editor modal */}
        {editingSlide && (
          <div className="fixed inset-0 bg-black/50 z-50 overflow-auto p-6 flex items-start justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-xl shadow-2xl mt-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-extrabold text-slate-900">{editingSlideIndex === null ? 'New Slide' : 'Edit Slide'}</h3>
                <button onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-slate-600 text-2xl leading-none border-0 bg-transparent cursor-pointer">×</button>
              </div>
              <div className="space-y-4">
                <div><label className={lbl}>Badge Text</label>
                  <input type="text" value={editingSlide.badge} onChange={e => setEditingSlide(p => p ? { ...p, badge: e.target.value } : p)} className={inp} placeholder="500+ Courses Available" /></div>
                <div><label className={lbl}>Headline</label>
                  <input type="text" value={editingSlide.headline} onChange={e => setEditingSlide(p => p ? { ...p, headline: e.target.value } : p)} className={inp} /></div>
                <div><label className={lbl}>Subheadline</label>
                  <textarea value={editingSlide.subheadline} onChange={e => setEditingSlide(p => p ? { ...p, subheadline: e.target.value } : p)} rows={3} className={`${inp} resize-y`} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lbl}>Primary Button</label>
                    <input type="text" value={editingSlide.ctaPrimary} onChange={e => setEditingSlide(p => p ? { ...p, ctaPrimary: e.target.value } : p)} className={inp} /></div>
                  <div><label className={lbl}>Primary URL</label>
                    <input type="text" value={editingSlide.ctaPrimaryHref} onChange={e => setEditingSlide(p => p ? { ...p, ctaPrimaryHref: e.target.value } : p)} className={inp} /></div>
                  <div><label className={lbl}>Secondary Button</label>
                    <input type="text" value={editingSlide.ctaSecondary} onChange={e => setEditingSlide(p => p ? { ...p, ctaSecondary: e.target.value } : p)} className={inp} /></div>
                  <div><label className={lbl}>Secondary URL</label>
                    <input type="text" value={editingSlide.ctaSecondaryHref} onChange={e => setEditingSlide(p => p ? { ...p, ctaSecondaryHref: e.target.value } : p)} className={inp} /></div>
                </div>
                <div><label className={lbl}>Background Gradient</label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {SLIDE_GRADIENTS.map(g => (
                      <button key={g} onClick={() => setEditingSlide(p => p ? { ...p, gradient: g } : p)}
                        className={`h-9 rounded-lg bg-gradient-to-br ${g} border-2 transition-all cursor-pointer ${editingSlide.gradient === g ? 'border-slate-900 scale-105' : 'border-transparent hover:scale-105'}`} />
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

        {/* Top header */}
        <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Site Settings</h1>
            <p className="text-slate-400 text-sm">Manage all website content and configuration</p>
          </div>
          <button className="btn-primary py-2 px-5" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="p-8 flex gap-6 items-start">
          {/* Section nav */}
          <div className="w-52 shrink-0 bg-white border border-slate-200 rounded-2xl p-2 sticky top-24">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all border-0 cursor-pointer ${
                  activeSection === s.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 bg-transparent'
                }`}>
                <span className="text-base shrink-0">{s.icon}</span>
                <span className="truncate">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 max-w-2xl">
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-5 text-green-700 font-semibold text-sm flex items-center gap-2">
                ✅ {message}
              </div>
            )}

            {/* ── GENERAL ── */}
            {activeSection === 'general' && (
              <div className={card}>
                <h2 className="font-bold text-slate-900 text-base mb-5">General Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={lbl}>Site Name</label>
                    <input type="text" value={config.name} onChange={e => update('name', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Site URL</label>
                    <input type="url" value={config.url} onChange={e => update('url', e.target.value)} className={inp} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Tagline</label>
                    <input type="text" value={config.tagline} onChange={e => update('tagline', e.target.value)} className={inp} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Description</label>
                    <textarea value={config.description} onChange={e => update('description', e.target.value)} rows={3} className={`${inp} resize-y`} /></div>
                  <div className="sm:col-span-2">
                    <ImageUpload
                      label="Site Logo"
                      value={config.logo}
                      onChange={url => update('logo', url)}
                      hint="Recommended: SVG or PNG with transparent background · max 5 MB"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── CONTACT ── */}
            {activeSection === 'contact' && (
              <div className={card}>
                <h2 className="font-bold text-slate-900 text-base mb-5">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={lbl}>Email Address</label>
                    <input type="email" value={config.email} onChange={e => update('email', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Phone Number</label>
                    <input type="text" value={config.phone} onChange={e => update('phone', e.target.value)} className={inp} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Street Address</label>
                    <input type="text" value={config.address} onChange={e => update('address', e.target.value)} className={inp} /></div>
                  <div className="sm:col-span-2"><label className={lbl}>Google Maps Link <span className="text-slate-400 font-normal">(optional)</span></label>
                    <input type="url" value={config.mapLink ?? ''} onChange={e => update('mapLink', e.target.value)} className={inp} placeholder="https://maps.google.com/..." /></div>
                </div>
              </div>
            )}

            {/* ── SOCIAL ── */}
            {activeSection === 'social' && (
              <div className={card}>
                <h2 className="font-bold text-slate-900 text-base mb-5">Social Media Links</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Twitter / X', path: 'social.twitter', value: config.social.twitter },
                    { label: 'LinkedIn', path: 'social.linkedin', value: config.social.linkedin },
                    { label: 'YouTube', path: 'social.youtube', value: config.social.youtube },
                    { label: 'Facebook', path: 'social.facebook', value: config.social.facebook },
                    { label: 'Instagram', path: 'social.instagram', value: config.social.instagram ?? '' },
                  ].map(f => (
                    <div key={f.path}><label className={lbl}>{f.label}</label>
                      <input type="url" value={f.value} onChange={e => update(f.path, e.target.value)} className={inp} placeholder="https://..." /></div>
                  ))}
                </div>
              </div>
            )}

            {/* ── HERO & SLIDES ── */}
            {activeSection === 'hero' && (
              <>
                <div className={card}>
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h2 className="font-bold text-slate-900 text-base">Hero Slides</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Auto-advance every 5 seconds. Pause on hover.</p>
                    </div>
                    <button onClick={() => openSlideEditor(null, null)} className="btn-primary py-1.5 px-4 text-sm">+ Add Slide</button>
                  </div>
                  {(config.heroSlides ?? []).length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">No slides yet.</div>
                  )}
                  <div className="space-y-3">
                    {(config.heroSlides ?? []).map((slide, i) => (
                      <div key={slide.id} className="flex items-center gap-3 border border-slate-200 rounded-xl p-4">
                        <div className={`w-12 h-10 rounded-lg bg-gradient-to-br ${slide.gradient} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm truncate">{slide.headline || <span className="text-slate-400 italic">Untitled</span>}</p>
                          <p className="text-xs text-slate-400 truncate">{slide.badge}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => moveSlide(i, 'up')} disabled={i === 0} className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 disabled:opacity-30 cursor-pointer bg-transparent text-xs">↑</button>
                          <button onClick={() => moveSlide(i, 'down')} disabled={i === (config.heroSlides ?? []).length - 1} className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 disabled:opacity-30 cursor-pointer bg-transparent text-xs">↓</button>
                          <button onClick={() => openSlideEditor(slide, i)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors bg-transparent cursor-pointer">Edit</button>
                          <button onClick={() => deleteSlide(i)} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors bg-transparent cursor-pointer">Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={card}>
                  <h2 className="font-bold text-slate-900 text-base mb-1">Fallback Hero</h2>
                  <p className="text-xs text-slate-400 mb-5">Used when no slides are configured.</p>
                  <div className="space-y-4">
                    <div><label className={lbl}>Headline</label>
                      <input type="text" value={config.hero.headline} onChange={e => update('hero.headline', e.target.value)} className={inp} /></div>
                    <div><label className={lbl}>Subheadline</label>
                      <textarea value={config.hero.subheadline} onChange={e => update('hero.subheadline', e.target.value)} rows={3} className={`${inp} resize-y`} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Primary Button</label>
                        <input type="text" value={config.hero.ctaPrimary} onChange={e => update('hero.ctaPrimary', e.target.value)} className={inp} /></div>
                      <div><label className={lbl}>Secondary Button</label>
                        <input type="text" value={config.hero.ctaSecondary} onChange={e => update('hero.ctaSecondary', e.target.value)} className={inp} /></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── STATS ── */}
            {activeSection === 'stats' && (
              <div className={card}>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-bold text-slate-900 text-base">Stats Strip</h2>
                  <button onClick={() => update('stats', [...config.stats, { value: '', label: '' }])} className="btn-primary py-1.5 px-3 text-sm">+ Add</button>
                </div>
                <div className="space-y-3">
                  {config.stats.map((stat, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end bg-slate-50 rounded-xl p-4">
                      <div><label className={lbl}>Value</label>
                        <input type="text" value={stat.value} onChange={e => { const s = [...config.stats]; s[i] = { ...s[i], value: e.target.value }; update('stats', s) }} className={inp} /></div>
                      <div><label className={lbl}>Label</label>
                        <input type="text" value={stat.label} onChange={e => { const s = [...config.stats]; s[i] = { ...s[i], label: e.target.value }; update('stats', s) }} className={inp} /></div>
                      <button onClick={() => update('stats', config.stats.filter((_, idx) => idx !== i))} className="text-xs px-2 py-2.5 text-red-500 hover:text-red-700 border-0 bg-transparent cursor-pointer">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FEATURES ── */}
            {activeSection === 'features' && (
              <div className={card}>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-bold text-slate-900 text-base">Homepage Features</h2>
                  <button onClick={() => update('features', [...config.features, { icon: 'video', title: '', description: '' }])} className="btn-primary py-1.5 px-3 text-sm">+ Add</button>
                </div>
                <div className="space-y-4">
                  {config.features.map((feat, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Feature {i + 1}</p>
                        <button onClick={() => update('features', config.features.filter((_, idx) => idx !== i))} className="text-xs text-red-500 hover:text-red-700 border-0 bg-transparent cursor-pointer">Remove</button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={lbl}>Icon Key</label>
                          <select value={feat.icon} onChange={e => { const f = [...config.features]; f[i] = { ...f[i], icon: e.target.value }; update('features', f) }} className={inp}>
                            {['video', 'certificate', 'community', 'lifetime'].map(o => <option key={o}>{o}</option>)}
                          </select></div>
                        <div><label className={lbl}>Title</label>
                          <input type="text" value={feat.title} onChange={e => { const f = [...config.features]; f[i] = { ...f[i], title: e.target.value }; update('features', f) }} className={inp} /></div>
                      </div>
                      <div><label className={lbl}>Description</label>
                        <textarea value={feat.description} onChange={e => { const f = [...config.features]; f[i] = { ...f[i], description: e.target.value }; update('features', f) }} rows={2} className={`${inp} resize-y`} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── GERMAN CLASSES ── */}
            {activeSection === 'german' && (
              <div className={card}>
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <h2 className="font-bold text-slate-900 text-base">German Classes — FAQ</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Shown on the German Classes listing page.</p>
                  </div>
                  <button onClick={addFaq} className="btn-primary py-1.5 px-3 text-sm">+ Add FAQ</button>
                </div>
                {config.germanFAQs.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm">No FAQs yet. Add your first one.</div>
                )}
                <div className="space-y-4">
                  {config.germanFAQs.map((faq, i) => (
                    <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">FAQ {i + 1}</p>
                        <div className="flex gap-1">
                          <button onClick={() => moveFaq(i, 'up')} disabled={i === 0} className="w-6 h-6 text-xs rounded border border-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30 bg-transparent cursor-pointer">↑</button>
                          <button onClick={() => moveFaq(i, 'down')} disabled={i === config.germanFAQs.length - 1} className="w-6 h-6 text-xs rounded border border-slate-200 text-slate-400 hover:text-slate-600 disabled:opacity-30 bg-transparent cursor-pointer">↓</button>
                          <button onClick={() => deleteFaq(i)} className="text-xs text-red-500 hover:text-red-700 border-0 bg-transparent cursor-pointer px-1">Remove</button>
                        </div>
                      </div>
                      <div><label className={lbl}>Question</label>
                        <input type="text" value={faq.q} onChange={e => updateFaq(i, 'q', e.target.value)} className={inp} /></div>
                      <div><label className={lbl}>Answer</label>
                        <textarea value={faq.a} onChange={e => updateFaq(i, 'a', e.target.value)} rows={3} className={`${inp} resize-y`} /></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ABOUT PAGE ── */}
            {activeSection === 'about' && (
              <>
                <div className={card}>
                  <h2 className="font-bold text-slate-900 text-base mb-5">About Page — Hero & Story</h2>
                  <div className="space-y-4">
                    <div><label className={lbl}>Hero Title</label>
                      <input type="text" value={config.aboutSection?.heroTitle ?? ''} onChange={e => update('aboutSection.heroTitle', e.target.value)} className={inp} /></div>
                    <div><label className={lbl}>Story Section Title</label>
                      <input type="text" value={config.aboutSection?.story?.title ?? ''} onChange={e => update('aboutSection.story.title', e.target.value)} className={inp} /></div>
                    {(['p1', 'p2', 'p3'] as const).map((p, i) => (
                      <div key={p}><label className={lbl}>Story Paragraph {i + 1}</label>
                        <textarea value={config.aboutSection?.story?.[p] ?? ''} onChange={e => update(`aboutSection.story.${p}`, e.target.value)} rows={3} className={`${inp} resize-y`} /></div>
                    ))}
                  </div>
                </div>
                <div className={card}>
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-slate-900 text-base">About Page — Values</h2>
                    <button onClick={addValue} className="btn-primary py-1.5 px-3 text-sm">+ Add Value</button>
                  </div>
                  <div className="space-y-4">
                    {(config.aboutSection?.values ?? []).map((val, i) => (
                      <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Value {i + 1}</p>
                          <button onClick={() => deleteValue(i)} className="text-xs text-red-500 hover:text-red-700 border-0 bg-transparent cursor-pointer">Remove</button>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] gap-3">
                          <div><label className={lbl}>Icon</label>
                            <input type="text" value={val.icon} onChange={e => updateValue(i, 'icon', e.target.value)} className={`${inp} w-16 text-center`} /></div>
                          <div><label className={lbl}>Title</label>
                            <input type="text" value={val.title} onChange={e => updateValue(i, 'title', e.target.value)} className={inp} /></div>
                        </div>
                        <div><label className={lbl}>Description</label>
                          <textarea value={val.description} onChange={e => updateValue(i, 'description', e.target.value)} rows={2} className={`${inp} resize-y`} /></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={card}>
                  <h2 className="font-bold text-slate-900 text-base mb-5">About Page — Contact Block</h2>
                  <div className="space-y-4">
                    <div><label className={lbl}>Team Section Title</label>
                      <input type="text" value={config.aboutSection?.teamTitle ?? ''} onChange={e => update('aboutSection.teamTitle', e.target.value)} className={inp} /></div>
                    <div><label className={lbl}>Contact Block Title</label>
                      <input type="text" value={config.aboutSection?.contactTitle ?? ''} onChange={e => update('aboutSection.contactTitle', e.target.value)} className={inp} /></div>
                    <div><label className={lbl}>Contact Block Description</label>
                      <textarea value={config.aboutSection?.contactDesc ?? ''} onChange={e => update('aboutSection.contactDesc', e.target.value)} rows={2} className={`${inp} resize-y`} /></div>
                  </div>
                </div>
              </>
            )}

            {/* ── FOOTER ── */}
            {activeSection === 'footer' && (
              <div className={card}>
                <h2 className="font-bold text-slate-900 text-base mb-5">Footer Settings</h2>
                <div className="space-y-4">
                  <div><label className={lbl}>Copyright Name</label>
                    <input type="text" value={config.footer?.copyrightName ?? config.name} onChange={e => update('footer.copyrightName', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Privacy Policy URL</label>
                    <input type="text" value={config.footer?.privacyLink ?? '/privacy'} onChange={e => update('footer.privacyLink', e.target.value)} className={inp} /></div>
                  <div><label className={lbl}>Terms of Service URL</label>
                    <input type="text" value={config.footer?.termsLink ?? '/terms'} onChange={e => update('footer.termsLink', e.target.value)} className={inp} /></div>
                </div>
              </div>
            )}

            {/* ── SEO ── */}
            {activeSection === 'seo' && (
              <div className={card}>
                <h2 className="font-bold text-slate-900 text-base mb-5">SEO & Metadata</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Default Title', path: 'seo.defaultTitle', value: config.seo.defaultTitle },
                    { label: 'Title Template  (%s = page title)', path: 'seo.titleTemplate', value: config.seo.titleTemplate },
                    { label: 'Twitter Handle', path: 'seo.twitterHandle', value: config.seo.twitterHandle },
                    ].map(f => (
                    <div key={f.path}><label className={lbl}>{f.label}</label>
                      <input type="text" value={f.value} onChange={e => update(f.path, e.target.value)} className={inp} /></div>
                  ))}
                  <ImageUpload
                    label="OG / Social Share Image"
                    value={config.seo.ogImage}
                    onChange={url => update('seo.ogImage', url)}
                    hint="Recommended: 1200×630px · JPG or PNG · max 5 MB"
                  />
                  <div><label className={lbl}>Default Meta Description</label>
                    <textarea value={config.seo.defaultDescription} onChange={e => update('seo.defaultDescription', e.target.value)} rows={3} className={`${inp} resize-y`} /></div>
                  <div><label className={lbl}>Keywords (comma-separated)</label>
                    <input type="text" value={config.seo.keywords.join(', ')}
                      onChange={e => update('seo.keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))} className={inp} /></div>
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
