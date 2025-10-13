import { postSimpleListContainerClass } from '../../../lib/config'
import { cn } from '../../../lib/utils'
import { SkeletonHeadingPage } from '../../components/HeadingPage'
import SkeletonPostList from '../../components/skeleton/SkeletonPostList'

export function SkeletonNotesPageBody({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-1 flex-col gap-12', className)}>
      {/* Blog posts */}
      <div className="flex flex-col gap-4">
        <SkeletonHeadingPage className="gap-2" hasIcon />
        <SkeletonPostList
          count={2}
          postType="PostBlogSimple"
          options={{
            className: postSimpleListContainerClass
          }}
        />
      </div>

      {/* Notes */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <SkeletonHeadingPage className="gap-2" hasIcon />
          <SkeletonPostList
            count={2}
            postType="PostSimple"
            options={{
              className: postSimpleListContainerClass
            }}
          />
        </div>
      ))}
    </div>
  )
}
