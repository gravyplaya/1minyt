import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to our homepage',
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
