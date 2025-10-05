import cn from 'classnames'
import React from 'react'
import { Post } from '@/src/lib/types'
import TooltipX from './tooltip-x'

type DraftBadgeComponentProps = {
  post: Post
  draftLabel?: string
  tooltipDraftLabel?: string
}

export default function DraftBadgeComponent(props: DraftBadgeComponentProps) {
  const { post, draftLabel, tooltipDraftLabel } = props
  return (
    <>
      {post.isDraft && (
        <>
          <span
            id={`draft-${post.id}`}
            className={cn(
              'bg-slate-100 text-slate-500 px-2 py-0 text-xs border border-slate-200 rounded-md ml-1.5'
            )}
          >
            {draftLabel || 'draft'}
          </span>
          <TooltipX id={`#draft-${post.id}`}>
            {tooltipDraftLabel || 'The content is not so good yet'}
          </TooltipX>
        </>
      )}
    </>
  )
}
