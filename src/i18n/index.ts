import { cookies } from 'next/headers'
import { en } from './en'
import { vi } from './vi'
import { de } from './de'

export type { Dict } from './en'
export type Locale = 'en' | 'vi' | 'de'
export const LOCALES: Locale[] = ['en', 'vi', 'de']

const dicts = { en, vi, de }

export async function getDict() {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value ?? 'en') as Locale
  return dicts[LOCALES.includes(locale) ? locale : 'en']
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value as Locale
  return LOCALES.includes(locale) ? locale : 'en'
}
