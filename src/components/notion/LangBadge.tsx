import cn from 'classnames'
import React from 'react'
import { Language, Post } from '@/src/lib/notion/interface'
import TooltipX from './tooltip-x'

type LangBadgeComponentProps = {
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
                <LangBadge id={post.id!} language="vi" tooltipLabel="written in Vietnamese" />
              )}
              {post.language === 'fr' && (
                <LangBadge id={post.id!} language="fr" tooltipLabel="written in French" />
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
                />
              )}
              {!!post.vi && (
                <LangBadge
                  id={post.id!}
                  language="vi"
                  availableLabel="also available in Vietnamese"
                  available={true}
                />
              )}
              {!!post.fr && (
                <LangBadge
                  id={post.id!}
                  language="fr"
                  availableLabel="also available in French"
                  available={true}
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
      <span
        id={`lang-${props.id}-${props.language}-${props.available ? 'available' : ''}`}
        className={cn('text-xs rounded-md px-1.5 ml-1.5', {
          'text-slate-600 border-slate-300 border': props.available,
          'bg-slate-500 text-white': !props.available
        })}
      >
        {props.language}
      </span>
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
