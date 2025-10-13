import CafeIcon from '@/public/cafe.svg'
import TbExternalLink from '@/src/app/icons/TbExternalLink'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

import Container from './Container'

export default function Footer() {
  const aClass = 'hover:text-white whitespace-nowrap flex items-center gap-1'
  return (
    <footer className="bg-nav-dark-bg text-gray-300">
      <Container className="p-4">
        <div className="flex flex-row flex-wrap items-center justify-center gap-2 pt-2 pb-1 lg:flex-row">
          <Link className={cn(aClass)} href={'/about/'}>
            About
          </Link>
          <span>|</span>
          <a
            className={cn(aClass)}
            href="https://photos.app.goo.gl/9OVEkdTjmtRPg7vC3"
            target="_blank"
          >
            Sketches <TbExternalLink />
          </a>{' '}
          <span>|</span>
          <a className={cn(aClass)} href="https://goo.gl/photos/yQXdQws1LLS16x5v5" target="_blank">
            Cooking <TbExternalLink />
          </a>{' '}
          <span>|</span>
          <Link className={cn(aClass)} href={'/note/support-me/'}>
            <Image className="h-4 w-auto" src={CafeIcon} alt="Cafe icon" /> Support Thi
          </Link>
        </div>
      </Container>
    </footer>
  )
}
