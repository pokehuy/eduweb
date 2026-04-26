'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { HeroSlide } from '@/lib/content'

interface Props {
  slides: HeroSlide[]
}

export default function HeroSlider({ slides }: Props) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % slides.length)
  }, [slides.length])

  const prev = () => {
    setCurrent(c => (c - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next, slides.length])

  if (!slides.length) return null

  const slide = slides[current]

  return (
    <section
      className={`relative bg-gradient-to-br ${slide.gradient} text-white py-24 overflow-hidden transition-all duration-700`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white/5" />
      </div>

      <div className="page-container text-center max-w-3xl mx-auto relative z-10">
        {/* Badge */}
        <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold mb-6 transition-all duration-500">
          {slide.badge}
        </span>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6 tracking-tight transition-all duration-500">
          {slide.headline}
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-white/85 mb-10 leading-relaxed max-w-2xl mx-auto transition-all duration-500">
          {slide.subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={slide.ctaPrimaryHref}
            className="bg-white text-slate-900 font-bold px-8 py-3.5 rounded-xl hover:bg-white/90 transition-colors text-base no-underline"
          >
            {slide.ctaPrimary} →
          </Link>
          <Link
            href={slide.ctaSecondaryHref}
            className="bg-white/15 border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/25 transition-colors text-base no-underline"
          >
            {slide.ctaSecondary}
          </Link>
        </div>
      </div>

      {/* Navigation arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm border-0 cursor-pointer z-20"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm border-0 cursor-pointer z-20"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full border-0 cursor-pointer ${
                i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
