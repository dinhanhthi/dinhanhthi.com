import TooltipX from './tooltip-x'
import { Badge } from './ui/badge'

type DraftBadgeComponentProps = {
  className?: string
  draftLabel?: string
  tooltipDraftLabel?: string
  postId: string
}

export default function DraftBadgeComponent(props: DraftBadgeComponentProps) {
  const { className, draftLabel, tooltipDraftLabel, postId } = props
  return (
    <>
      <Badge id={`draft-${postId}`} variant="outline" className={className}>
        {draftLabel || 'draft'}
      </Badge>{' '}
      <TooltipX id={`#draft-${postId}`}>
        {tooltipDraftLabel || 'The content is not so good yet'}
      </TooltipX>
    </>
  )
}
