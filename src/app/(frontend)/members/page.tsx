import { getMeUser } from '@/utilities/getMeUser'
import SearchComponent from './SearchComponent'

export default async function Members() {
  const { user } = await getMeUser({
    nullUserRedirect: '/members/login',
  })

  return <SearchComponent userId={user.id} />
}
