import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getCourses, saveCourses, type Course } from '@/lib/content'

async function requireAdmin() {
  const ok = await getAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET() {
  const deny = await requireAdmin()
  if (deny) return deny
  return NextResponse.json(getCourses())
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const body = await req.json() as Course
  const courses = getCourses()
  const newCourse = { ...body, id: body.slug, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] }
  courses.push(newCourse)
  saveCourses(courses)
  return NextResponse.json(newCourse, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const body = await req.json() as Course
  const courses = getCourses()
  const idx = courses.findIndex(c => c.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  courses[idx] = { ...body, updatedAt: new Date().toISOString().split('T')[0] }
  saveCourses(courses)
  return NextResponse.json(courses[idx])
}

export async function DELETE(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const { id } = await req.json()
  const courses = getCourses().filter(c => c.id !== id)
  saveCourses(courses)
  return NextResponse.json({ success: true })
}
