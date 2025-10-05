import VictoryHand from '@/public/victory_hand.webp'
import BadgeInfos from '@/src/app/components/BadgeInfos'
import cn from 'classnames'
import Image from 'next/image'

import BadgeSocial from '@/src/app/components/BadgeSocial'
import { ImageType } from '@/src/lib/types'
import inforLinks from '../../data/inforLinks'
import me from '../../data/me'
import socials from '../../data/social'
import Header from './Header'

export default function HeaderAbout() {
  return (
    <Header headerType="gray" headerWidth="wide">
      <div className="mx-auto flex flex-col flex-wrap items-center justify-items-stretch md:p-4 md:flex-row xl:max-w-6xl">
        <div className="mb-7 flex w-full flex-col items-center gap-4 md:flex-row md:gap-5">
          <div>
            <h1 className="thi-title flex w-full justify-center md:justify-start font-heading">
              <span className="mr-2 inline-flex h-9 origin-[70%_70%] animate-wave items-center justify-center">
                <Image src={VictoryHand} alt="Waving hand" width={36} height={36} />
              </span>
              About me
            </h1>
            <p
              className={'mt-4 flex-1 text-left text-main-dark'}
              dangerouslySetInnerHTML={{ __html: me.longIntro }}
            ></p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start overflow-hidden">
              {socials.map(item => (
                <BadgeSocial
                  key={item.id}
                  icon={{ staticImageData: item.icon } as ImageType}
                  url={item.url}
                  title={item.title}
                  imgClass={cn('h-full', item.imgClass)}
                />
              ))}
            </div>
          </div>
          <div className="w-full rounded-lg border border-slate-600 p-4 md:w-auto">
            <ul>
              {Object.keys(me.coordinate).map(key => {
                const item = me.coordinate[key as keyof typeof me.coordinate] as {
                  label: string
                  href?: string
                }
                return (
                  <li key={key} className="whitespace-nowrap">
                    <span className="mr-3 font-semibold capitalize text-sky-300">{key}</span>
                    {!item.href && <span className="text-slate-200">{item.label}</span>}
                    {item.href && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-200 hover:text-rose-400"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center gap-3 md:order-3 md:mt-8">
          {inforLinks
            .filter(item => item.id !== 'cv')
            .map(item => (
              <BadgeInfos key={item.id} {...item} />
            ))}
        </div>
      </div>
    </Header>
  )
}
