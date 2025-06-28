import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '1minyt.com',
  description: 'Transcribe, Summarize, and Chat with your videos.',
}

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-black min-h-screen">{children}</div>
}
