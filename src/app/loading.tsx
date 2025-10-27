import { postSimpleListContainerClass } from '../lib/config'
import { SkeletonBookItem } from './(single-page)/reading/BookItem'
import { SkeletonToolPageSection } from './(single-page)/tools/loading'
import Container from './components/Container'
import { SkeletonHeaderThiCard } from './components/HeaderThiCard'
import { SkeletonHeadingPage } from './components/HeadingPage'
import { SkeletonPostList } from './components/PostsList'
import { SkeletonTopic } from './components/Topic'

export default function Loading() {
  return <PageLoadingSkeleton />
}

export const PageLoadingSkeleton = () => {
  return (
    <>
      <SkeletonHeaderThiCard />
      <Container className="flex flex-col gap-12">
        {/* Blog */}
        <div className="flex flex-col gap-4">
          <SkeletonHeadingPage />
          <SkeletonPostList
            count={2}
            postType="PostBlogSimple"
            className={postSimpleListContainerClass}
          />
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-4">
          <SkeletonHeadingPage />
          <SkeletonPostList
            count={2}
            postType="PostSimple"
            className={postSimpleListContainerClass}
          />
        </div>

        {/* Tools */}
        <div className="flex flex-col gap-4">
          <SkeletonHeadingPage />
          <SkeletonToolPageSection numTools={4} hasTitle={false} />
        </div>

        {/* Reading */}
        <div className="flex flex-col gap-4">
          <SkeletonHeadingPage />
          <div className="flex w-full flex-col gap-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonBookItem key={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-col gap-4">
          <SkeletonHeadingPage />
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonTopic key={i} type="simple" />
            ))}
          </div>
        </div>
      </Container>
    </>
  )
}
