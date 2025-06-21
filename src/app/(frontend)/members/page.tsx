import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import SearchComponent from './SearchComponent'

export default async function Members() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/members/login')
  }
  return <SearchComponent userId={userId} />
}
