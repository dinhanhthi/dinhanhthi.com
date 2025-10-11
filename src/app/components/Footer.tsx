import CafeIcon from '@/public/cafe.svg'
import TbExternalLink from '@/src/app/icons/TbExternalLink'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

import me from '../../data/me'
import Container from './Container'

type FooterProps = {
  footerType?: 'white' | 'gray'
}

export default function Footer(props: FooterProps) {
  const aClass = 'hover:text-white whitespace-nowrap flex items-center gap-1'
  return (
    <footer className="bg-nav-dark-bg text-gray-300">
      <div
        className={cn({
          'bg-wave-bottom-white': !props.footerType || props.footerType === 'white',
          'bg-wave-bottom-stone': props.footerType === 'gray'
        })}
      ></div>
      <Container className="!mt-0 py-6">
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
            My sketches <TbExternalLink />
          </a>{' '}
          <span>|</span>
          <a className={cn(aClass)} href="https://goo.gl/photos/yQXdQws1LLS16x5v5" target="_blank">
            Cooking <TbExternalLink />
          </a>{' '}
          <span>|</span>
          <Link className={cn(aClass)} href={'/support-me/'}>
            <Image className="h-4 w-auto" src={CafeIcon} alt="Cafe icon" /> Support Thi
          </Link>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center gap-2 pt-1 pb-2 lg:flex-row">
          <a className={cn(aClass)} href={`mailto:${me.email}`}>
            💌 {me.email}
          </a>
        </div>
      </Container>
    </footer>
  )
}
