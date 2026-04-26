import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getRegistrations, saveRegistrations, type Registration } from '@/lib/content'

async function requireAdmin() {
  const ok = await getAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET() {
  const deny = await requireAdmin()
  if (deny) return deny
  return NextResponse.json(getRegistrations())
}

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const body = await req.json() as Registration
  const registrations = getRegistrations()
  const idx = registrations.findIndex(r => r.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  registrations[idx] = body
  saveRegistrations(registrations)
  return NextResponse.json(registrations[idx])
}

export async function DELETE(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const { id } = await req.json()
  saveRegistrations(getRegistrations().filter(r => r.id !== id))
  return NextResponse.json({ success: true })
}
