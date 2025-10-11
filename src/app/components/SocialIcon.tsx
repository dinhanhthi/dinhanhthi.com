'use client'

import { LinkedinIcon } from 'lucide-react'
import { siGithub, siGoodreads, siX, type SimpleIcon } from 'simple-icons'
import { Button } from './ui/button'

// Wrapper component for simple-icons
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

const iconMap = {
  GithubIcon: siGithub,
  LinkedinIcon, // keep using LinkedinIcon from lucide-react because Simple Icons doesn't have it
  TwitterIcon: siX,
  Goodreads: siGoodreads
}

type SocialIconProps = {
  iconName: keyof typeof iconMap
  url: string
  title: string
  id?: string
}

export default function SocialIcon({ iconName, url, title, id }: SocialIconProps) {
  const iconData = iconMap[iconName]
  const isSimpleIcon = typeof iconData === 'object' && 'path' in iconData

  return (
    <Button size="icon" className="rounded-full" variant="outline" tooltip={title} asChild>
      <a key={id} href={url} target="_blank" rel="noopener noreferrer" title={title}>
        {isSimpleIcon && <SimpleIconWrapper icon={iconData} className="h-6 w-6 md:h-5 md:w-5" />}
        {!isSimpleIcon &&
          (() => {
            const LucideIcon = iconData
            return <LucideIcon className="h-6 w-6 md:h-5 md:w-5" />
          })()}
      </a>
    </Button>
  )
}
