import BadgeInfos from '@/src/app/components/BadgeInfos'
import ImageWithLoading from '@/src/app/components/ImageWithLoading'
import SocialIcon from '@/src/app/components/SocialIcon'

import inforLinks from '../../data/inforLinks'
import me from '../../data/me'
import socials from '../../data/social'
import Header from './Header'

export default function HeaderThiCard() {
  return (
    <Header containerClassName="flex flex-col lg:flex-row lg:gap-4">
      <div className="flex shrink-0 flex-row items-center gap-4">
        <ImageWithLoading
          src="/logo_sketches/avatar_nobg.png"
          alt={me.name}
          height={200}
          width={200}
          priority
        />
        <h1 className="font-heading thi-text-rainbow -mb-2 text-2xl font-bold lg:hidden lg:text-4xl">
          Hi! I&apos;m Thi
        </h1>
      </div>
      <div className="flex flex-col gap-4 py-4">
        <h1 className="font-heading thi-text-rainbow -mb-2 hidden text-2xl font-bold lg:block lg:text-4xl">
          Hi! I&apos;m Thi
        </h1>
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
                icon={item.icon}
                url={item.url}
                title={item.title}
              />
            )
          })}
        </div>
      </div>
    </Header>
  )
}

export function SkeletonHeaderThiCard() {
  return (
    <Header containerClassName="flex flex-col lg:flex-row lg:gap-4">
      <div className="flex shrink-0 flex-row items-center gap-4">
        {/* Avatar skeleton */}
        <div className="h-[200px] w-[200px] animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />

        {/* Mobile heading skeleton */}
        <div className="h-9 w-32 animate-pulse rounded bg-slate-200 lg:hidden dark:bg-slate-700" />
      </div>

      <div className="flex flex-1 flex-col gap-4 py-4">
        {/* Desktop heading skeleton */}
        <div className="hidden h-9 w-32 animate-pulse rounded bg-slate-200 lg:block dark:bg-slate-700" />

        {/* Short intro skeleton */}
        <div className="flex max-w-full flex-col gap-2">
          <div className="h-5 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Badge infos skeleton */}
        <div className="flex flex-wrap items-center gap-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-7 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>

        {/* Social icons skeleton */}
        <div className="flex flex-wrap items-center gap-3">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"
            />
          ))}
        </div>
      </div>
    </Header>
  )
}
