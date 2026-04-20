export const metadata = {
  title: { default: 'Admin Console', template: '%s | Admin' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
