import { cookies } from 'next/headers'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_COOKIE = 'admin_session'
const SESSION_SECRET = process.env.SESSION_SECRET || 'edulearn-secret-key-change-in-production'

export function verifyCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export function createSessionToken(): string {
  const payload = { user: 'admin', ts: Date.now() }
  return Buffer.from(JSON.stringify(payload) + '|' + SESSION_SECRET).toString('base64')
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8')
    return decoded.endsWith('|' + SESSION_SECRET)
  } catch {
    return false
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false
  return verifySessionToken(token)
}

export { SESSION_COOKIE }
