import { NextRequest, NextResponse } from 'next/server'
import { addRegistration, getGermanClassBySlug } from '@/lib/content'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { classId, firstName, lastName, email, phone, message } = body

  if (!classId || !firstName || !lastName || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const germanClass = getGermanClassBySlug(classId)
  if (!germanClass || !germanClass.published) {
    return NextResponse.json({ error: 'Class not found' }, { status: 404 })
  }

  const registration = addRegistration({
    classId,
    className: germanClass.title,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim().toLowerCase(),
    phone: (phone ?? '').trim(),
    message: (message ?? '').trim(),
    status: 'pending',
  })

  return NextResponse.json({ success: true, registrationId: registration.id }, { status: 201 })
}
