import { BookOpen, ChefHat, Mail, Palette, UserRound } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/src/app/components/ui/button'

export type BadgeInfosProps = {
  id?: string
  url: string
  title: string
  icon?: string
  external?: boolean
  targetSelf?: boolean
}

const iconMap = {
  Mail,
  UserRound,
  Palette,
  BookOpen,
  ChefHat
}

export default function BadgeInfos(props: BadgeInfosProps) {
  const IconComponent = props.icon ? iconMap[props.icon as keyof typeof iconMap] : null

  if (props.external || props.url.includes('//')) {
    return (
      <Button size="sm" variant="outline" asChild>
        <a
          href={props.url}
          target={props.targetSelf ? '_self' : '_blank'}
          rel="noopener noreferrer"
        >
          {IconComponent && <IconComponent className="h-4 w-4" />}
          <span className="hidden sm:block">{props.title}</span>
        </a>
      </Button>
    )
  }
  return (
    <Button size="sm" variant="outline" asChild>
      <Link href={props.url}>
        {IconComponent && <IconComponent className="h-4 w-4" />}
        <span className="hidden sm:block">{props.title}</span>
      </Link>
    </Button>
  )
}
