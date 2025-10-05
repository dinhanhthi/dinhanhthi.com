import Avatar from '@/public/avatar.webp'
import WavingHand from '@/public/waving_hand.webp'
import BadgeInfos from '@/src/app/components/BadgeInfos'
import BadgeSocial from '@/src/app/components/BadgeSocial'
import ImageComponent from '@/src/app/components/ImageComponent'
import { ImageType } from '@/src/lib/types'
import cn from 'classnames'
import Image from 'next/image'

import inforLinks from '../../data/inforLinks'
import me from '../../data/me'
import socials from '../../data/social'
import Header from './Header'

export default function HeaderIndex() {
  const ySpacingClass = 'mt-6 md:mt-4'
  return (
    <Header headerType="gray" headerWidth="wide">
      <div className="flex flex-col md:flex-row md:gap-6 flex-wrap items-center justify-items-stretch">
        <div className="h-28 md:order-2 md:h-60">
          <ImageComponent
            alt="Thi's avatar"
            image={{ staticImageData: Avatar }}
            className="h-full w-auto"
          />
        </div>
        <div className="md:order-1 md:flex-1">
          <h1
            className={cn(
              'flex thi-title gap-1 justify-center md:justify-start font-heading',
              ySpacingClass
            )}
          >
            <span className="mr-2 inline-flex h-9 origin-[70%_70%] animate-wave items-center justify-center">
              <Image src={WavingHand} alt="Waving hand" width={30} height={30} />
            </span>
            {me.helloText || "Hi! I'm Thi"}
          </h1>
          <p
            className={cn(
              'max-w-full text-center text-main-dark md:text-left text-[0.95rem]',
              ySpacingClass
            )}
            dangerouslySetInnerHTML={{ __html: me.shortIntro }}
          ></p>
          <div
            className={cn(
              'flex flex-wrap items-center justify-center gap-3 md:justify-start overflow-hidden',
              ySpacingClass
            )}
          >
            {socials.map(item => (
              <BadgeSocial
                id={item.id}
                key={item.id}
                icon={{ staticImageData: item.icon } as ImageType}
                url={item.url}
                title={item.title}
                imgClass={cn('h-full', item.imgClass)}
              />
            ))}
          </div>
        </div>
        <div className="mt-10 flex w-full flex-wrap items-center justify-center gap-3 md:order-3">
          {inforLinks.map(item => (
            <BadgeInfos key={item.id} {...item} />
          ))}
        </div>
      </div>
    </Header>
  )
}
