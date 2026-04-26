import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(req: NextRequest) {
  const ok = await getAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed. Use JPG, PNG, WebP, GIF or SVG.' }, { status: 400 })
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File too large. Maximum size is 5 MB.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')

  await mkdir(uploadDir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, safeName), buffer)

  return NextResponse.json({ url: `/uploads/${safeName}` }, { status: 201 })
}
