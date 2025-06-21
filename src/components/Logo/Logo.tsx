import Image from 'next/image'
import { getServerSideURL } from '@/utilities/getURL'

type Props = {
  className?: string
  loading?: 'eager' | 'lazy'
  priority?: 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className, loading = 'lazy', priority = 'low' } = props

  return (
    <Image
      className={className}
      src={`${getServerSideURL()}/logo/logo_text.png`}
      alt="1minyt Logo"
      width={150}
      height={50}
      loading={loading}
      priority={priority === 'high'}
    />
  )
}
