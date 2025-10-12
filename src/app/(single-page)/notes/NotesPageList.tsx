import HeadingWithMore from '@/src/app/components/HeadingWithMore'
import PostList from '@/src/app/components/PostsList'
import SkeletonPostList from '@/src/app/components/skeleton/SkeletonPostList'
import BlogIcon from '@/src/app/icons/BlogIcon'
import { defaultPostTypeOpts, postSimpleListContainerClass } from '@/src/lib/config'
import { Post, Tag } from '@/src/lib/types'
import { Suspense } from 'react'
import { cn } from '../../../lib/utils'
import NoteTopicSection from './NoteTopicSection'

type NotesPageListProps = {
  className?: string
  blogPosts: Post[]
  pinnedPosts: Post[]
  posts: Post[]
  pinnedTags: Tag[]
  numBlogPosts: number
}

export default function NotesPageList(props: NotesPageListProps) {
  const { className, blogPosts, pinnedPosts, posts, pinnedTags, numBlogPosts } = props
  return (
    <div className={cn('flex flex-1 flex-col gap-12', className)}>
      {/* Blog posts */}
      {blogPosts.length > 0 && (
        <div className="flex flex-col gap-2">
          <HeadingWithMore
            title="Blog posts"
            href={blogPosts.length >= numBlogPosts ? '/blogs/' : undefined}
            className="scroll-mt-[70px]"
            icon={<BlogIcon className="h-6 w-6" />}
          />
          <div className="overflow-hidden">
            <Suspense
              fallback={
                <SkeletonPostList
                  count={2}
                  postType="PostBlogSimple"
                  options={{
                    className: postSimpleListContainerClass
                  }}
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
          <HeadingWithMore title="Pinned notes" className="scroll-mt-[70px]" />
          <>
            <Suspense
              fallback={
                <SkeletonPostList
                  count={4}
                  postType="PostSimple"
                  options={{
                    className: postSimpleListContainerClass
                  }}
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
        <HeadingWithMore title="Recently updated notes" className="scroll-mt-[70px]" />
        <>
          <Suspense
            fallback={
              <SkeletonPostList
                count={4}
                postType="PostSimple"
                options={{
                  className: postSimpleListContainerClass
                }}
              />
            }
          >
            <PostList
              posts={posts.filter(post => !post.pinned)}
              postType="PostSimple"
              postTypeOpts={defaultPostTypeOpts}
              options={{
                className: postSimpleListContainerClass
              }}
            />
          </Suspense>
        </>
      </div>

      {pinnedTags.map((tag: Tag) => (
        <Suspense
          key={tag.id}
          fallback={
            <div className="flex flex-col gap-4">
              <div className="flex animate-pulse items-center gap-2">
                <div className="h-[40px] w-[40px] rounded-full bg-slate-200"></div>
                <div className="h-[26px] w-[250px] rounded-2xl bg-slate-200"></div>
              </div>
              <SkeletonPostList
                count={4}
                postType="PostSimple"
                options={{
                  className: postSimpleListContainerClass
                }}
              />
            </div>
          }
        >
          <NoteTopicSection tag={tag} />
        </Suspense>
      ))}
    </div>
  )
}
