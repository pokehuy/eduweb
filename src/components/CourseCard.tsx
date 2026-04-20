import Link from 'next/link'
import type { Course } from '@/lib/content'
import type { Dict } from '@/i18n'

const CATEGORY_EMOJI: Record<string, string> = {
  Technology: '💻', Design: '🎨', Business: '📈', 'Data Science': '📊',
  Marketing: '📣', 'Personal Development': '🧠',
}
const LEVEL_COLOR: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-rose-100 text-rose-700',
}

export default function CourseCard({ course, dict }: { course: Course; dict: Dict }) {
  const d = dict.courses
  return (
    <Link href={`/courses/${course.slug}`} className="no-underline group">
      <article className="card h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-44 bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center overflow-hidden">
          <span className="text-5xl">{CATEGORY_EMOJI[course.category] ?? '📚'}</span>
          {course.featured && (
            <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
              {d.featured}
            </span>
          )}
          <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${LEVEL_COLOR[course.level] ?? 'bg-white/20 text-white'}`}>
            {d.level[course.level as keyof typeof d.level] ?? course.level}
          </span>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <span className="badge mb-2">{d.category[course.category as keyof typeof d.category] ?? course.category}</span>
          <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-3 flex-1 line-clamp-2">
            {course.shortDescription}
          </p>

          <p className="text-slate-400 text-xs mb-2">{d.by} {course.instructor}</p>

          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-amber-400 text-sm">★★★★★</span>
            <span className="font-bold text-sm text-slate-900">{course.rating}</span>
            <span className="text-slate-400 text-xs">({course.reviews.toLocaleString()} {d.reviews})</span>
          </div>

          <div className="flex gap-4 text-xs text-slate-400 mb-4">
            <span>⏱ {course.duration}</span>
            <span>📖 {course.lessons} {d.lessons}</span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-lg text-indigo-600">${course.price}</span>
              <span className="line-through text-slate-400 text-sm">${course.originalPrice}</span>
            </div>
            <span className="text-xs text-slate-400">{course.students.toLocaleString()} {d.students}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
