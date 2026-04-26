'use client'

import { useState } from 'react'

interface Props {
  classId: string
  className: string
  isFull: boolean
  price: number
  currency: string
}

type Step = 'form' | 'success'

export default function GermanClassRegistrationForm({ classId, className, isFull, price, currency }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })

  function set(key: keyof typeof form, value: string) {
    setForm(p => ({ ...p, [key]: value }))
    if (error) setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId, ...form }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
      } else {
        setStep('success')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = 'w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow'
  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide'

  if (step === 'success') {
    return (
      <div className="card p-6 text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-2">Registration Received!</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-4">
          Thank you, <strong>{form.firstName}</strong>! We&apos;ve received your registration for <strong>{className}</strong>. You&apos;ll receive a confirmation email at <strong>{form.email}</strong> within 24 hours.
        </p>
        <p className="text-xs text-slate-400">Have questions? Contact us at hello@edulearn.example.com</p>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="mb-5">
        <div className="text-2xl font-extrabold text-emerald-600 mb-0.5">{currency} {price}</div>
        <div className="text-slate-400 text-sm">Full course — all materials included</div>
      </div>

      {isFull ? (
        <>
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5 text-sm text-amber-700 font-semibold">
            This class is currently full. Join the waitlist and we&apos;ll notify you when a spot opens.
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>First Name *</label>
                  <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} className={inputCls} placeholder="Anna" required />
                </div>
                <div>
                  <label className={labelCls}>Last Name *</label>
                  <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} className={inputCls} placeholder="Müller" required />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="you@example.com" required />
              </div>
            </div>
            {error && <p className="text-red-600 text-xs font-semibold mb-3">{error}</p>}
            <button type="submit" disabled={submitting}
              className="w-full inline-flex justify-center items-center gap-2 bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-600 active:scale-95 transition-all cursor-pointer border-0 text-sm">
              {submitting ? 'Submitting...' : 'Join Waitlist'}
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-3 mb-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>First Name *</label>
                <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} className={inputCls} placeholder="Anna" required />
              </div>
              <div>
                <label className={labelCls}>Last Name *</label>
                <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} className={inputCls} placeholder="Müller" required />
              </div>
            </div>
            <div>
              <label className={labelCls}>Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputCls} placeholder="you@example.com" required />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inputCls} placeholder="+49 123 456789" />
            </div>
            <div>
              <label className={labelCls}>Message (optional)</label>
              <textarea value={form.message} onChange={e => set('message', e.target.value)} className={`${inputCls} resize-y`} rows={3}
                placeholder="Any questions or special requirements?" />
            </div>
          </div>

          {error && <p className="text-red-600 text-xs font-semibold mb-3">{error}</p>}

          <button type="submit" disabled={submitting}
            className="w-full inline-flex justify-center items-center gap-2 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer border-0 text-sm mb-3">
            {submitting ? 'Submitting...' : `Register for ${currency} ${price} →`}
          </button>
          <p className="text-xs text-slate-400 text-center">No payment now — we&apos;ll confirm your spot and send payment details by email.</p>
        </form>
      )}

      <div className="border-t border-slate-100 mt-5 pt-4 space-y-2 text-xs text-slate-500">
        <div className="flex gap-2"><span>📧</span> Confirmation within 24h</div>
        <div className="flex gap-2"><span>📚</span> All materials included</div>
        <div className="flex gap-2"><span>🔄</span> Free level switch if needed</div>
      </div>
    </div>
  )
}
