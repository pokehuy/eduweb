import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getSiteConfig, saveSiteConfig, type SiteConfig } from '@/lib/content'

async function requireAdmin() {
  const ok = await getAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET() {
  const deny = await requireAdmin()
  if (deny) return deny
  return NextResponse.json(getSiteConfig())
}

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const body = await req.json() as SiteConfig
  saveSiteConfig(body)
  return NextResponse.json({ success: true })
}
