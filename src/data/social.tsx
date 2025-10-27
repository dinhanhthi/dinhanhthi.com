import { GithubIcon, LinkedinIcon } from 'lucide-react'
import { siGoodreads, siX, type SimpleIcon } from 'simple-icons'

const SimpleIconWrapper = ({ icon, className }: { icon: SimpleIcon; className?: string }) => {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={className}
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  )
}

export type SocialItem = {
  id: string
  title: string
  url: string
  icon: React.ReactNode
}

const socials: SocialItem[] = [
  {
    id: 'github',
    title: 'Github',
    url: 'https://github.com/dinhanhthi',
    icon: <GithubIcon className="h-6 w-6 md:h-5 md:w-5" />
  },
  {
    id: 'linkedin',
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/dinhanhthi/',
    icon: <LinkedinIcon className="h-6 w-6 md:h-5 md:w-5" />
  },
  {
    id: 'twitter',
    title: 'X',
    url: 'https://x.com/dinhanhthi',
    icon: <SimpleIconWrapper icon={siX} className="h-6 w-6 md:h-5 md:w-5" />
  },
  {
    id: 'goodreads',
    title: 'Goodreads',
    url: 'https://www.goodreads.com/user/show/19630622-thi-dinh',
    icon: <SimpleIconWrapper icon={siGoodreads} className="h-6 w-6 md:h-5 md:w-5" />
  }
]

export default socials
