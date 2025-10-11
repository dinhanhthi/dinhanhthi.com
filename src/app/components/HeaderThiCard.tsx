import BadgeInfos from '@/src/app/components/BadgeInfos'
import ImageWithLoading from '@/src/app/components/ImageWithLoading'
import SocialIcon from '@/src/app/components/SocialIcon'

import inforLinks from '../../data/inforLinks'
import me from '../../data/me'
import socials from '../../data/social'
import Header from './Header'

export default function HeaderThiCard() {
  return (
    <Header className="flex flex-col lg:flex-row lg:gap-4">
      <div className="flex shrink-0 flex-row items-center gap-4">
        <ImageWithLoading
          src="/logo_sketches/avatar_nobg.png"
          alt={me.name}
          height={200}
          width={200}
          priority
        />
        <h1 className="font-heading -mb-2 text-3xl text-slate-700 lg:hidden">Hi! I&apos;m Thi</h1>
      </div>
      <div className="flex flex-col gap-4 py-4">
        <h1 className="font-heading -mb-2 hidden text-3xl text-slate-700 lg:block">
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
