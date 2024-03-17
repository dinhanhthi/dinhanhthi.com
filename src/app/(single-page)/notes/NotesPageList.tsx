import HeadingWithMore from '@notion-x/src/components/HeadingWithMore'
import PostList from '@notion-x/src/components/PostsList'
import SkeletonPostList from '@notion-x/src/components/SkeletonPostList'
import BlogIcon from '@notion-x/src/icons/BlogIcon'
import { Post, Tag } from '@notion-x/src/interface'
import { Suspense } from 'react'
import NoteTopicSection from '../../components/NoteTopicSection'
import { defaultPostTypeOpts } from '../../lib/config'
import { numBlogPosts } from './page'

type NotesPageListProps = {
  blogPosts: Post[]
  pinnedPosts: Post[]
  posts: Post[]
  pinnedTags: Tag[]
}

export default function NotesPageList(props: NotesPageListProps) {
  const { blogPosts, pinnedPosts, posts, pinnedTags } = props
  return (
    <div className="order-2 flex-1 flex flex-col gap-12">
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
                  count={numBlogPosts}
                  postType="PostCardWave"
                  options={{
                    className: 'grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 sm:gap-x-4'
                  }}
                />
              }
            >
              <PostList
                posts={blogPosts}
                postType="PostCardWave"
                postTypeOpts={defaultPostTypeOpts}
                options={{
                  className: 'grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 sm:gap-x-4'
                }}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* pinned */}
      <div className="flex flex-col gap-2">
        <HeadingWithMore title="Pinned notes" className="scroll-mt-[70px]" />
        <div className="thi-box-code overflow-hidden">
          <Suspense
            fallback={
              <SkeletonPostList
                count={4}
                postType="PostSimple"
                options={{
                  className: 'flex flex-col divide-y'
                }}
              />
            }
          >
            <PostList
              posts={pinnedPosts}
              postType="PostSimple"
              postTypeOpts={{ ...defaultPostTypeOpts, showPinned: true }}
              options={{
                className: 'flex flex-col divide-y'
              }}
            />
          </Suspense>
        </div>
      </div>

      {/* Recently updated notes */}
      <div className="flex flex-col gap-2">
        <HeadingWithMore title="Recently updated notes" className="scroll-mt-[70px]" />
        <div className="thi-box-code overflow-hidden">
          <Suspense
            fallback={
              <SkeletonPostList
                count={4}
                postType="PostSimple"
                options={{
                  className: 'flex flex-col divide-y'
                }}
              />
            }
          >
            <PostList
              posts={posts.filter(post => !post.pinned)}
              postType="PostSimple"
              postTypeOpts={defaultPostTypeOpts}
              options={{
                className: 'flex flex-col divide-y'
              }}
            />
          </Suspense>
        </div>
      </div>

      {pinnedTags.map((tag: Tag) => (
        <NoteTopicSection key={tag.id} tag={tag} />
      ))}
    </div>
  )
}
