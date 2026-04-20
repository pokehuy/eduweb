import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getBlogPosts, saveBlogPosts, type BlogPost } from '@/lib/content'

async function requireAdmin() {
  const ok = await getAdminSession()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return null
}

export async function GET() {
  const deny = await requireAdmin()
  if (deny) return deny
  return NextResponse.json(getBlogPosts())
}

export async function POST(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const body = await req.json() as BlogPost
  const posts = getBlogPosts()
  const newPost = { ...body, id: body.slug, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] }
  posts.push(newPost)
  saveBlogPosts(posts)
  return NextResponse.json(newPost, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const body = await req.json() as BlogPost
  const posts = getBlogPosts()
  const idx = posts.findIndex(p => p.id === body.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  posts[idx] = { ...body, updatedAt: new Date().toISOString().split('T')[0] }
  saveBlogPosts(posts)
  return NextResponse.json(posts[idx])
}

export async function DELETE(req: NextRequest) {
  const deny = await requireAdmin()
  if (deny) return deny
  const { id } = await req.json()
  const posts = getBlogPosts().filter(p => p.id !== id)
  saveBlogPosts(posts)
  return NextResponse.json({ success: true })
}
