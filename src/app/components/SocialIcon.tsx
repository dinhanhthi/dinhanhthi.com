'use client'

import { BookOpen, Code2, GithubIcon, LinkedinIcon, TwitterIcon } from 'lucide-react'
import { Button } from './ui/button'

const iconMap = {
  GithubIcon,
  LinkedinIcon,
  BookOpen,
  Code2,
  TwitterIcon
}

type SocialIconProps = {
  iconName: keyof typeof iconMap
  url: string
  title: string
  id?: string
}

export default function SocialIcon({ iconName, url, title, id }: SocialIconProps) {
  const Icon = iconMap[iconName]

  return (
    <Button size="icon" className="rounded-full" variant="outline" asChild>
      <a key={id} href={url} target="_blank" rel="noopener noreferrer" title={title}>
        <Icon className="h-6 w-6 md:h-5 md:w-5" />
      </a>
    </Button>
  )
}
