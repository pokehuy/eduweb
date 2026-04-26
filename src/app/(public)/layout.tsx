import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getDict, getLocale } from '@/i18n'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [dict, locale] = await Promise.all([getDict(), getLocale()])
  return (
    <>
      <Header dict={dict} locale={locale} />
      <main className="flex-1">{children}</main>
      <Footer dict={dict} />
    </>
  )
}
