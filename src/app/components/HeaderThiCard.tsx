import BadgeInfos from '@/src/app/components/BadgeInfos'
import SocialIcon from '@/src/app/components/SocialIcon'
import cn from 'classnames'
import Image from 'next/image'

import inforLinks from '../../data/inforLinks'
import me from '../../data/me'
import socials from '../../data/social'
import { sectionOuterClass } from '../../lib/config'
import Header from './Header'

export default function HeaderThiCard() {
  return (
    <Header>
      <div className={cn('flex flex-col lg:flex-row lg:gap-4', sectionOuterClass)}>
        <div className="flex shrink-0 flex-row items-center gap-4">
          <Image src="/avatar_nobg.png" alt={me.name} height={200} width={200} />
          <h1 className="font-heading -mb-2 text-3xl lg:hidden">Hi! I&apos;m Thi</h1>
        </div>
        <div className="flex flex-col gap-4 py-4">
          <h1 className="font-heading -mb-2 hidden text-3xl lg:block">Hi! I&apos;m Thi</h1>
          <div className="max-w-full">{me.shortIntro}</div>
          <div className="flex flex-wrap items-center gap-3">
            {inforLinks.map(item => (
              <BadgeInfos key={item.id} {...item} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {socials.map(item => {
              return (
                <SocialIcon
                  key={item.id}
                  id={item.id}
                  iconName={item.lucideIcon as any}
                  url={item.url}
                  title={item.title}
                />
              )
            })}
          </div>
        </div>
      </div>
    </Header>
  )
}
