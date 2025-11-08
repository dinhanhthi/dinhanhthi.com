import HeadingPage from '@/src/app/components/HeadingPage'
import PostList, { SkeletonPostList } from '@/src/app/components/PostsList'
import { defaultPostTypeOpts, postSimpleListContainerClass } from '@/src/lib/config'
import { Post, Tag } from '@/src/lib/types'
import { Feather } from 'lucide-react'
import { Suspense } from 'react'
import { cn } from '../../../lib/utils'
import NoteTopicSection from './NoteTopicSection'

type NotesPageListProps = {
  className?: string
  blogPosts: Post[]
  pinnedPosts: Post[]
  recentPosts: Post[]
  postsByTag: { tag: Tag; posts: Post[] }[]
  numBlogPosts: number
}

export default function NotesPageList(props: NotesPageListProps) {
  const { className, blogPosts, pinnedPosts, recentPosts, postsByTag, numBlogPosts } = props
  return (
    <div className={cn('flex flex-1 flex-col gap-12', className)}>
      {/* Blog posts */}
      {blogPosts.length > 0 && (
        <div className="flex flex-col gap-2">
          <HeadingPage
            title="Blog posts"
            href={blogPosts.length >= numBlogPosts ? '/blogs/' : undefined}
            className="scroll-mt-[70px]"
            icon={<Feather size={26} className="text-text-heading" />}
          />
          <div className="overflow-hidden">
            <Suspense
              fallback={
                <SkeletonPostList
                  count={2}
                  postType="PostBlogSimple"
                  className={postSimpleListContainerClass}
                />
              }
            >
              <PostList
                posts={blogPosts}
                postType="PostBlogSimple"
                postTypeOpts={defaultPostTypeOpts}
                options={{
                  className: postSimpleListContainerClass
                }}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* pinned */}
      {pinnedPosts.length > 0 && (
        <div className="flex flex-col gap-2">
          <HeadingPage title="Pinned notes" className="scroll-mt-[70px]" />
          <>
            <Suspense
              fallback={
                <SkeletonPostList
                  count={4}
                  postType="PostSimple"
                  className={postSimpleListContainerClass}
                />
              }
            >
              <PostList
                posts={pinnedPosts}
                postType="PostSimple"
                postTypeOpts={{ ...defaultPostTypeOpts, showPinned: true }}
                options={{
                  className: postSimpleListContainerClass
                }}
              />
            </Suspense>
          </>
        </div>
      )}

      {/* Recently updated notes */}
      <div className="flex flex-col gap-2">
        <HeadingPage title="Recently updated notes" className="scroll-mt-[70px]" />
        <>
          <Suspense
            fallback={
              <SkeletonPostList
                count={4}
                postType="PostSimple"
                className={postSimpleListContainerClass}
              />
            }
          >
            <PostList
              posts={recentPosts}
              postType="PostSimple"
              postTypeOpts={defaultPostTypeOpts}
              options={{
                className: postSimpleListContainerClass
              }}
            />
          </Suspense>
        </>
      </div>

      {postsByTag.map(({ tag, posts }) => (
        <Suspense
          key={tag.id}
          fallback={
            <div className="flex flex-col gap-4">
              <div className="flex animate-pulse items-center gap-2">
                <div className="bg-skeleton-bg h-[40px] w-[40px] rounded-full"></div>
                <div className="bg-skeleton-bg h-[26px] w-[250px] rounded-2xl"></div>
              </div>
              <SkeletonPostList
                count={4}
                postType="PostSimple"
                className={postSimpleListContainerClass}
              />
            </div>
          }
        >
          <NoteTopicSection tag={tag} posts={posts} />
        </Suspense>
      ))}
    </div>
  )
}
