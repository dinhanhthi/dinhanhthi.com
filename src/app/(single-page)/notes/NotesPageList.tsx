import HeadingWithMore from '@notion-x/src/components/HeadingWithMore'
import PostList from '@notion-x/src/components/PostsList'
import SkeletonPostList from '@notion-x/src/components/SkeletonPostList'
import BlogIcon from '@notion-x/src/icons/BlogIcon'
import { Post, Tag } from '@notion-x/src/interface'
import { Suspense } from 'react'
import { defaultPostTypeOpts, postBlogSimpleListClass, postSimpleListClass } from '../../lib/config'
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
                  count={2}
                  postType="PostBlogSimple"
                  options={{
                    className: postBlogSimpleListClass
                  }}
                />
              }
            >
              <PostList
                posts={blogPosts}
                postType="PostBlogSimple"
                postTypeOpts={defaultPostTypeOpts}
                options={{
                  className: postBlogSimpleListClass
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
          <div className="thi-box-code overflow-hidden">
            <Suspense
              fallback={
                <SkeletonPostList
                  count={4}
                  postType="PostSimple"
                  options={{
                    className: postSimpleListClass
                  }}
                />
              }
            >
              <PostList
                posts={pinnedPosts}
                postType="PostSimple"
                postTypeOpts={{ ...defaultPostTypeOpts, showPinned: true }}
                options={{
                  className: postSimpleListClass
                }}
              />
            </Suspense>
          </div>
        </div>
      )}

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
                  className: postSimpleListClass
                }}
              />
            }
          >
            <PostList
              posts={posts.filter(post => !post.pinned)}
              postType="PostSimple"
              postTypeOpts={defaultPostTypeOpts}
              options={{
                className: postSimpleListClass
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
