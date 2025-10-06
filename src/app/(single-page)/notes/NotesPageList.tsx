import HeadingWithMore from '@/src/app/components/HeadingWithMore'
import PostList from '@/src/app/components/PostsList'
import SkeletonPostList from '@/src/app/components/skeleton/SkeletonPostList'
import BlogIcon from '@/src/app/icons/BlogIcon'
import { defaultPostTypeOpts, postSimpleListContainerClass } from '@/src/lib/config'
import { Post, Tag } from '@/src/lib/types'
import { Suspense } from 'react'
import NoteTopicSection from './NoteTopicSection'

type NotesPageListProps = {
  blogPosts: Post[]
  pinnedPosts: Post[]
  posts: Post[]
  pinnedTags: Tag[]
  numBlogPosts: number
}

export default function NotesPageList(props: NotesPageListProps) {
  const { blogPosts, pinnedPosts, posts, pinnedTags, numBlogPosts } = props
  return (
    <div className="order-2 flex flex-1 flex-col gap-12">
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
        <NoteTopicSection key={tag.id} tag={tag} />
      ))}
    </div>
  )
}
