import { Post } from '@/src/lib/types'
import cn from 'classnames'
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
              'ml-1.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0 text-xs text-slate-500'
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
