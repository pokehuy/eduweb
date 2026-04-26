import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getGermanClasses, saveGermanClasses, type GermanClass } from '@/lib/content'

async function requireAdmin() {
  const ok = await getAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET() {
  const deny = await requireAdmin()
  if (deny) return deny
  return NextResponse.json(getGermanClasses())
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const body = await req.json() as GermanClass
  const classes = getGermanClasses()
  const now = new Date().toISOString().split('T')[0]
  const newClass: GermanClass = { ...body, id: body.slug, createdAt: now, updatedAt: now }
  classes.push(newClass)
  saveGermanClasses(classes)
  return NextResponse.json(newClass, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const body = await req.json() as GermanClass
  const classes = getGermanClasses()
  const idx = classes.findIndex(c => c.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  classes[idx] = { ...body, updatedAt: new Date().toISOString().split('T')[0] }
  saveGermanClasses(classes)
  return NextResponse.json(classes[idx])
}

export async function DELETE(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const { id } = await req.json()
  saveGermanClasses(getGermanClasses().filter(c => c.id !== id))
  return NextResponse.json({ success: true })
}
