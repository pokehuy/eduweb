import type { Metadata } from 'next'
import { getPublishedCourses } from '@/lib/content'
import { getDict } from '@/i18n'
import CourseCard from '@/components/CourseCard'

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Courses', alternates: { canonical: '/courses' } }
}

export default async function CoursesPage() {
  const [dict, courses] = await Promise.all([getDict(), Promise.resolve(getPublishedCourses())])
  const d = dict.courses
  const categories = [...new Set(courses.map(c => c.category))]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 border-b border-slate-200 py-12">
        <div className="page-container">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">{d.pageTitle}</h1>
          <p className="text-slate-500 text-lg">{courses.length} {d.pageDesc}</p>
        </div>
      </div>

      <div className="page-container py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center mb-8">
          <span className="text-sm font-semibold text-slate-500 mr-2">{d.filterBy}</span>
          <a href="/courses" className="filter-pill-active">{d.all}</a>
          {categories.map(cat => (
            <a key={cat} href={`/courses?category=${cat}`} className="filter-pill">
              {d.category[cat as keyof typeof d.category] ?? cat}
            </a>
          ))}
          <span className="w-px h-5 bg-slate-200 mx-1" />
          {(['Beginner', 'Intermediate', 'Advanced'] as const).map(level => (
            <a key={level} href={`/courses?level=${level}`} className="filter-pill">
              {d.level[level]}
            </a>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map(c => <CourseCard key={c.id} course={c} dict={dict} />)}
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'ItemList', name: 'EduLearn Courses',
          itemListElement: courses.map((c, i) => ({
            '@type': 'ListItem', position: i + 1,
            item: { '@type': 'Course', name: c.title, description: c.shortDescription },
          })),
        }),
      }} />
    </div>
  )
}
