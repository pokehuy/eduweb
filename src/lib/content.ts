import fs from 'fs'
import path from 'path'

const contentDir = path.join(process.cwd(), 'content')

function readJSON<T>(filename: string, fallback?: T): T {
  const filePath = path.join(contentDir, filename)
  if (!fs.existsSync(filePath) && fallback !== undefined) return fallback
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

function writeJSON<T>(filename: string, data: T): void {
  const filePath = path.join(contentDir, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export interface HeroSlide {
  id: string
  headline: string
  subheadline: string
  ctaPrimary: string
  ctaPrimaryHref: string
  ctaSecondary: string
  ctaSecondaryHref: string
  gradient: string
  badge: string
}

export interface FAQ {
  q: string
  a: string
}

export interface SiteConfig {
  name: string
  tagline: string
  description: string
  url: string
  logo: string
  email: string
  phone: string
  address: string
  mapLink: string
  social: { twitter: string; linkedin: string; youtube: string; facebook: string; instagram: string }
  hero: { headline: string; subheadline: string; ctaPrimary: string; ctaSecondary: string; image: string }
  heroSlides: HeroSlide[]
  stats: Array<{ label: string; value: string }>
  features: Array<{ icon: string; title: string; description: string }>
  germanFAQs: FAQ[]
  aboutSection: {
    heroTitle: string
    story: { title: string; p1: string; p2: string; p3: string }
    values: Array<{ icon: string; title: string; description: string }>
    teamTitle: string
    contactTitle: string
    contactDesc: string
  }
  footer: {
    copyrightName: string
    privacyLink: string
    termsLink: string
  }
  seo: {
    defaultTitle: string
    titleTemplate: string
    defaultDescription: string
    keywords: string[]
    ogImage: string
    twitterHandle: string
  }
}

export interface Course {
  id: string
  slug: string
  title: string
  description: string
  shortDescription: string
  category: string
  level: string
  instructor: string
  instructorBio: string
  instructorImage: string
  thumbnail: string
  duration: string
  lessons: number
  students: number
  rating: number
  reviews: number
  price: number
  originalPrice: number
  featured: boolean
  tags: string[]
  curriculum: Array<{ title: string; lessons: number; duration: string }>
  requirements: string[]
  whatYouLearn: string[]
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  authorImage: string
  thumbnail: string
  tags: string[]
  readTime: string
  published: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

export function getSiteConfig(): SiteConfig {
  return readJSON<SiteConfig>('site.json')
}

export function saveSiteConfig(config: SiteConfig): void {
  writeJSON('site.json', config)
}

export function getCourses(): Course[] {
  return readJSON<Course[]>('courses.json')
}

export function getPublishedCourses(): Course[] {
  return getCourses().filter(c => c.published)
}

export function getCourseBySlug(slug: string): Course | undefined {
  return getCourses().find(c => c.slug === slug)
}

export function saveCourses(courses: Course[]): void {
  writeJSON('courses.json', courses)
}

export function getBlogPosts(): BlogPost[] {
  return readJSON<BlogPost[]>('blog.json')
}

export function getPublishedPosts(): BlogPost[] {
  return getBlogPosts().filter(p => p.published)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getBlogPosts().find(p => p.slug === slug)
}

export function saveBlogPosts(posts: BlogPost[]): void {
  writeJSON('blog.json', posts)
}

export interface GermanClass {
  id: string
  slug: string
  title: string
  level: string
  description: string
  shortDescription: string
  schedule: string
  startDate: string
  endDate: string
  duration: string
  sessions: number
  sessionLength: string
  location: string
  maxStudents: number
  currentStudents: number
  price: number
  currency: string
  instructor: string
  instructorBio: string
  whatYouLearn: string[]
  requirements: string[]
  materials: string[]
  tags: string[]
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface Registration {
  id: string
  classId: string
  className: string
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export function getGermanClasses(): GermanClass[] {
  return readJSON<GermanClass[]>('german-classes.json', [])
}

export function getPublishedGermanClasses(): GermanClass[] {
  return getGermanClasses().filter(c => c.published)
}

export function getGermanClassBySlug(slug: string): GermanClass | undefined {
  return getGermanClasses().find(c => c.slug === slug)
}

export function saveGermanClasses(classes: GermanClass[]): void {
  writeJSON('german-classes.json', classes)
}

export function getRegistrations(): Registration[] {
  return readJSON<Registration[]>('registrations.json', [])
}

export function saveRegistrations(registrations: Registration[]): void {
  writeJSON('registrations.json', registrations)
}

export function addRegistration(reg: Omit<Registration, 'id' | 'createdAt'>): Registration {
  const registrations = getRegistrations()
  const newReg: Registration = {
    ...reg,
    id: `reg_${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  registrations.push(newReg)
  saveRegistrations(registrations)
  return newReg
}
