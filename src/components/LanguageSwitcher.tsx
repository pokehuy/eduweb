'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { Dict, Locale } from '@/i18n'

const FLAGS: Record<Locale, string> = { en: '🇬🇧', vi: '🇻🇳', de: '🇩🇪' }

export default function LanguageSwitcher({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function switchLocale(newLocale: Locale) {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=lax`
    setOpen(false)
    router.refresh()
  }

  const locales: Locale[] = ['en', 'vi', 'de']

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors bg-white"
      >
        <span>{FLAGS[locale]}</span>
        <span className="uppercase tracking-wide">{locale}</span>
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 min-w-[160px]">
          {locales.map(l => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                l === locale
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">{FLAGS[l]}</span>
              <span>{dict.lang[l]}</span>
              {l === locale && <span className="ml-auto text-indigo-600">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
