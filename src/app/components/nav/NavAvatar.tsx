import Avatar from '@/public/avatar.webp'
import Image from 'next/image'
import Link from 'next/link'

export default function NavAvatar() {
  return (
    <div className="shrink-0">
      <Link className="flex items-center overflow-hidden rounded-full" href="/">
        <Image src={Avatar} alt="Thi's avatar" width={38} height={38} />
      </Link>
    </div>
  )
}
