import cn from 'classnames'
import { Star } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import TiTag from '@/src/app/icons/TiTag'
import { Category, Tag } from '@/src/lib/types'
import TooltipX from './tooltip-x'

type PostHeaderTopicsProps = {
  className?: string
  categories?: Category[]
  tags?: Tag[]
  selectedUri?: string
  selectedName?: string
  TiTagClass?: string
  tagClass?: string
}

const topTagClass = `flex items-center justify-center rounded-2xl px-3 py-0.5 text-xs uppercase
hover:-translate-y-0.5 transition-all duration-300 font-bold
whitespace-nowrap`

export default function PostHeaderTopics(props: PostHeaderTopicsProps) {
  const { categories, tags, className, selectedUri, selectedName } = props
  const usedTags = tags?.filter(tag => tag.uri !== props.selectedUri) || []
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {!!selectedUri && !!categories && (
        <Link
          className={`${topTagClass} border border-amber-300 bg-amber-50 !text-amber-600`}
          key={'selected'}
          href={selectedUri}
        >
          <Star className="mr-1 h-4 w-4" /> {selectedName || 'Selected'}
        </Link>
      )}
      {!!categories?.length &&
        categories?.length > 0 &&
        categories
          .filter(cat => !!cat)
          .map(category => (
            <Link
              className={topTagClass}
              style={{
                backgroundColor: `${category!.style?.bgColor}`,
                color: `${category!.style?.textColor}`,
                border: category!.style?.bdColor
                  ? `1px solid ${category!.style?.bdColor}`
                  : undefined
              }}
              key={category!.uri}
              href={category!.uri || '/'}
            >
              {category!.name}
            </Link>
          ))}
      {usedTags.length > 0 && <TiTag className={props.TiTagClass ?? 'text-lg text-gray-600'} />}
      {usedTags.length > 0 &&
        usedTags.map(tag => (
          <React.Fragment key={tag.id}>
            <Link
              id={`tag-${tag.id}`}
              className={cn(
                topTagClass,
                props.tagClass ?? 'boder-slate-300 border bg-white text-slate-600'
              )}
              key={tag.uri}
              href={tag.uri || '/'}
            >
              {tag.name}
            </Link>
            {!!(tag.longName || tag.description) && (
              <TooltipX id={`#tag-${tag.id}`}>{tag.description || tag.longName}</TooltipX>
            )}
          </React.Fragment>
        ))}
    </div>
  )
}
