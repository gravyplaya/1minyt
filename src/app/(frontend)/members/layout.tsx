import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Members',
  description: 'Sign up or login to access member-only content',
}

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return children
}
