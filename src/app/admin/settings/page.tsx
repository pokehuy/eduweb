'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'
import type { SiteConfig } from '@/lib/content'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [config, setConfig] = useState<SiteConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function load() {
    const res = await fetch('/api/admin/settings')
    if (res.status === 401) { router.push('/admin/login'); return }
    setConfig(await res.json())
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
    if (res.ok) setMessage('Settings saved successfully!')
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
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

  if (loading || !config) return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8 flex items-center justify-center text-slate-400">Loading...</div>
    </div>
  )

  const inputCls = 'input-field'
  const labelCls = 'block text-sm font-semibold text-slate-700 mb-1.5'
  const sectionCls = 'bg-white border border-slate-200 rounded-xl p-6 mb-5'

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Site Settings</h1>
            <p className="text-slate-500">Configure your site content and SEO</p>
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5 text-green-700 font-semibold">{message}</div>
        )}

        {/* General */}
        <div className={sectionCls}>
          <h2 className="font-bold text-slate-900 text-base mb-5">General</h2>
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
              <textarea value={config.description} onChange={e => update('description', e.target.value)}
                rows={3} className={`${inputCls} resize-y`} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Address</label>
              <input type="text" value={config.address} onChange={e => update('address', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className={sectionCls}>
          <h2 className="font-bold text-slate-900 text-base mb-5">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Headline</label>
              <input type="text" value={config.hero.headline} onChange={e => update('hero.headline', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Subheadline</label>
              <textarea value={config.hero.subheadline} onChange={e => update('hero.subheadline', e.target.value)}
                rows={3} className={`${inputCls} resize-y`} />
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

        {/* Stats */}
        <div className={sectionCls}>
          <h2 className="font-bold text-slate-900 text-base mb-5">Stats</h2>
          <div className="space-y-3">
            {config.stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
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

        {/* SEO */}
        <div className={sectionCls}>
          <h2 className="font-bold text-slate-900 text-base mb-5">SEO Settings</h2>
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
              <textarea value={config.seo.defaultDescription} onChange={e => update('seo.defaultDescription', e.target.value)}
                rows={3} className={`${inputCls} resize-y`} />
            </div>
            <div>
              <label className={labelCls}>Keywords (comma-separated)</label>
              <input type="text" value={config.seo.keywords.join(', ')}
                onChange={e => update('seo.keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Social */}
        <div className={sectionCls}>
          <h2 className="font-bold text-slate-900 text-base mb-5">Social Links</h2>
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

        <div className="flex justify-end pb-8">
          <button className="btn-primary px-8" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
