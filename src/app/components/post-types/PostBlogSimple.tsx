import DateComponent from '@/src/app/components/DateComponent'
import DraftBadgeComponent from '@/src/app/components/DraftBadge'
import { default as LangBadgeComponent } from '@/src/app/components/LangBadge'
import { CommonPostTypeOpts } from '@/src/app/components/PostsList'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'
import { getColorIndex } from '@/src/lib/helpers'
import { Post } from '@/src/lib/types'
import cn from 'classnames'
import Link from 'next/link'
import { Badge } from '../ui/badge'

export type PostBlogSimpleOpts = {
  colorIndex?: number
  humanizeDate?: boolean
  draftLabel?: string
  tooltipDraftLabel?: string
  autoHideAddedDate?: boolean
  tooltipLanguageLabel?: string
  hideOldDate?: boolean // hide the date if it's older than maxDaysWinthin
} & CommonPostTypeOpts

type PostBlogSimpleProps = {
  post: Post
  options?: PostBlogSimpleOpts
}

export default function PostBlogSimple(props: PostBlogSimpleProps) {
  const { post, options } = props
  const status = usePostDateStatus(post.createdDate!, post.date!, options?.maxDaysWinthin || 7)
  const colorIndex = getColorIndex(options?.colorIndex)

  return (
    <Link href={post.uri || '/'}>
      <div className="group hover:bg-bg-hover flex items-center gap-4 p-4">
        <div className="circle-wave h-12 w-12 flex-shrink-0 rounded-full">
          <div className="bottom-wave">
            <svg
              className="waves !h-[45px] !min-h-[50px]"
              preserveAspectRatio="none"
              shapeRendering="auto"
              viewBox="0 24 150 28"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <defs>
                <path
                  d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                  id="gentle-wave"
                ></path>
              </defs>
              <g className="parallax">
                <use
                  fill={`rgba(var(--wave-color-${colorIndex}), var(--wave-color-alpha-0))`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="0"
                ></use>
                <use
                  fill={`rgba(var(--wave-color-${colorIndex}), var(--wave-color-alpha-1))`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="3"
                ></use>
                <use
                  fill={`rgba(var(--wave-color-${colorIndex}), var(--wave-color-alpha-2))`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="5"
                ></use>
                <use
                  fill={`rgba(var(--wave-color-${colorIndex}), var(--wave-color-alpha-3))`}
                  x="48"
                  xlinkHref="#gentle-wave"
                  y="7"
                ></use>
              </g>
            </svg>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex flex-1 flex-col items-start justify-between gap-x-3 gap-y-1.5 md:flex-row">
            <h3 className="flex-1">
              {/* date status on mobile size */}
              {(post.createdDate || post.date) &&
                (status !== 'updated' || !options?.hideOldDate) && (
                  <Badge
                    variant="secondary"
                    className={cn('!border-none whitespace-nowrap md:hidden', {
                      '!bg-green-bg !text-green-text': status === 'updatedWithin',
                      '!bg-yellow-bg !text-yellow-text': status === 'new'
                    })}
                  >
                    {status === 'updatedWithin' && <>updated</>}
                    {status === 'new' && <>new</>}
                  </Badge>
                )}

              {/* title */}
              <span>{post.title}</span>

              {/* languages */}
              <LangBadgeComponent post={post} type="written" className="ml-1.5" />
              <LangBadgeComponent post={post} type="available" className="ml-1.5" />

              {/* draft */}
              {post?.isDraft && (
                <DraftBadgeComponent
                  className="ml-1.5"
                  postId={post.id!}
                  draftLabel={options?.draftLabel}
                  tooltipDraftLabel={options?.tooltipDraftLabel}
                />
              )}
            </h3>
            {/* date status on big screen */}
            {(post.createdDate || post.date) && (status !== 'updated' || !options?.hideOldDate) && (
              <div className="hidden items-center gap-2 md:flex">
                {['updated', 'updatedWithin'].includes(status) && post.date && (
                  <Badge
                    variant="secondary"
                    className={cn('!border-none whitespace-nowrap', {
                      '!bg-green-bg !text-green-text': status === 'updatedWithin'
                    })}
                  >
                    <DateComponent
                      dateString={post.date}
                      format="MMM DD, YYYY"
                      humanize={options?.humanizeDate}
                      dateLabel={options?.updatedOnLabel || 'updated'}
                    />
                  </Badge>
                )}
                {status === 'new' && (
                  <Badge
                    variant="secondary"
                    className="!bg-yellow-bg !text-yellow-text !border-none"
                  >
                    {options?.newLabel || 'new'}
                  </Badge>
                )}
                {!(options?.autoHideAddedDate && status !== 'normal') &&
                  post.createdDate &&
                  !options?.hideOldDate && (
                    <DateComponent
                      className="hidden text-[0.8rem] text-slate-500 group-hover:text-slate-700 md:flex"
                      dateString={post.createdDate}
                      format="MMM DD, YYYY"
                      humanize={options?.humanizeDate}
                      dateLabel={options?.addedOnLabel || 'added'}
                    />
                  )}
              </div>
            )}
          </div>
          {post.description && <div className="text-muted text-sm">{post.description}</div>}
        </div>
      </div>
    </Link>
  )
}

export const PostBlogSimpleSkeleton = (props: { postContainerClassName?: string }) => (
  <div className={cn('flex animate-pulse items-center gap-4 p-4', props.postContainerClassName)}>
    <div className="bg-skeleton-bg h-12 w-12 flex-shrink-0 rounded-full"></div>
    <div className="flex w-full flex-col gap-2">
      <div className="bg-skeleton-bg h-4 w-1/2 rounded-xl"></div>
      <div className="bg-skeleton-bg h-3 w-3/4 rounded-xl"></div>
    </div>
  </div>
)
