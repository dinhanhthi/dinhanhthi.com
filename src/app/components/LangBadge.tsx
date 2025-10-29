import { Language, Post } from '@/src/lib/types'
import { cn } from '../../lib/utils'
import TooltipX from './tooltip-x'
import { Badge } from './ui/badge'

type LangBadgeComponentProps = {
  className?: string
  post: Post
  type: 'written' | 'available'
}

export default function LangBadgeComponent(props: LangBadgeComponentProps) {
  const { post } = props
  return (
    <>
      {props.type === 'written' && (
        <>
          {post.language && post.language !== 'en' && (
            <>
              {post.language === 'vi' && (
                <LangBadge
                  id={post.id!}
                  language="vi"
                  tooltipLabel="written in Vietnamese"
                  className={props.className}
                />
              )}
              {post.language === 'fr' && (
                <LangBadge
                  id={post.id!}
                  language="fr"
                  tooltipLabel="written in French"
                  className={props.className}
                />
              )}
            </>
          )}
        </>
      )}

      {props.type === 'available' && (
        <>
          {(!!post.vi || !!post.en || !!post.fr) && (
            <>
              {!!post.en && (
                <LangBadge
                  id={post.id!}
                  language="en"
                  availableLabel="also available in English"
                  available={true}
                  className={props.className}
                />
              )}
              {!!post.vi && (
                <LangBadge
                  id={post.id!}
                  language="vi"
                  availableLabel="also available in Vietnamese"
                  available={true}
                  className={props.className}
                />
              )}
              {!!post.fr && (
                <LangBadge
                  id={post.id!}
                  language="fr"
                  availableLabel="also available in French"
                  available={true}
                  className={props.className}
                />
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

type LangBadgeProps = {
  id: string
  language: Language
  tooltipLabel?: string
  className?: string
  available?: boolean // if true, show as "available" badge
  availableLabel?: string
}

export function LangBadge(props: LangBadgeProps) {
  return (
    <>
      <Badge
        id={`lang-${props.id}-${props.language}-${props.available ? 'available' : ''}`}
        variant={props.available ? 'outline' : 'secondary'}
        className={cn('hover:!bg-bg-button', props.className)}
      >
        {props.language}
      </Badge>
      {props.tooltipLabel && !props.available && (
        <TooltipX id={`#lang-${props.id}-${props.language}-${props.available ? 'available' : ''}`}>
          {props.tooltipLabel}
        </TooltipX>
      )}
      {props.availableLabel && props.available && (
        <TooltipX id={`#lang-${props.id}-${props.language}-${props.available ? 'available' : ''}`}>
          {props.availableLabel}
        </TooltipX>
      )}
    </>
  )
}
