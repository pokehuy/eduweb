'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Dict, Locale } from '@/i18n'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header({ dict, locale }: { dict: Dict; locale: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '/courses', label: dict.nav.courses },
    { href: '/german-classes', label: '🇩🇪 Deutsch' },
    { href: '/blog', label: dict.nav.blog },
    { href: '/about', label: dict.nav.about },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="page-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold text-sm">
            E
          </div>
          <span className="font-bold text-xl text-slate-900">EduLearn</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors no-underline"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} dict={dict} />
          <Link href="/courses" className="hidden md:inline-flex btn-primary py-2 px-4 text-sm">
            {dict.nav.getStarted}
          </Link>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-50 no-underline"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/courses"
              onClick={() => setMenuOpen(false)}
              className="mt-2 btn-primary justify-center"
            >
              {dict.nav.getStarted}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
