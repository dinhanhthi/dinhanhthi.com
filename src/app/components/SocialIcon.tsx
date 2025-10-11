'use client'

import { Button } from './ui/button'

type SocialIconProps = {
  icon: React.ReactNode
  url: string
  title: string
  id?: string
}

export default function SocialIcon({ icon, url, title, id }: SocialIconProps) {
  return (
    <Button size="icon" className="rounded-full" variant="outline" tooltip={title} asChild>
      <a key={id} href={url} target="_blank" rel="noopener noreferrer" title={title}>
        {icon as React.ReactNode}
      </a>
    </Button>
  )
}
