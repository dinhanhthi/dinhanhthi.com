import { postSimpleListContainerClass } from '../../../lib/config'
import { cn } from '../../../lib/utils'
import Container from '../../components/Container'
import { HeaderPageSkeleton } from '../../components/HeaderPage'
import { SkeletonHeadingPage } from '../../components/HeadingPage'
import { SkeletonNotesToc } from '../../components/NotesToc'
import { SkeletonPostList } from '../../components/PostsList'

export default function NotesPageLoading() {
  return <SkeletonNotesPageLoading />
}

export const SkeletonNotesPageLoading = () => {
  return (
    <>
      <HeaderPageSkeleton />
      <Container className="flex flex-col gap-12 md:flex-row md:gap-4">
        <SkeletonNotesPageBody className="order-2" />
        <SkeletonNotesToc className="top-[60px] order-1 h-fit w-full md:sticky md:order-2 md:h-[calc(100vh-110px)] md:w-fit" />
      </Container>
    </>
  )
}

function SkeletonNotesPageBody({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-1 flex-col gap-12', className)}>
      {/* Blog posts */}
      <div className="flex flex-col gap-4">
        <SkeletonHeadingPage hasIcon />
        <SkeletonPostList
          count={2}
          postType="PostBlogSimple"
          className={postSimpleListContainerClass}
        />
      </div>

      {/* Notes */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <SkeletonHeadingPage hasIcon />
          <SkeletonPostList
            count={2}
            postType="PostSimple"
            className={postSimpleListContainerClass}
          />
        </div>
      ))}
    </div>
  )
}
