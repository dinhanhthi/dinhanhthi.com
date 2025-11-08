import Pagination from '@/src/app/components/Pagination'
import PostList, { PostType, SkeletonPostList } from '@/src/app/components/PostsList'
import { ImageType, Post } from '@/src/lib/types'

import { defaultPostTypeOpts, postSimpleListContainerClass } from '@/src/lib/config'
import { Suspense } from 'react'
import Container from '../components/Container'
import HeaderPage, { HeaderPageSkeleton } from '../components/HeaderPage'
import HeadingPage from '../components/HeadingPage'

export type PageOfPostsListTemplateProps = {
  object: {
    name: string
    longName?: string // first used for tag
    subtitle?: string
    description?: string // alternative to subtitle
    icon: ImageType
    iconPath?: string
    className: string
    uri: string
  }
  posts: Post[]
  pinnedPosts: Post[]
  blogPosts?: Post[]
  totalPages: number
  currentPage: number
  postType?: PostType
  postListContainerClassName?: string
}

export default function PageOfPostsListTemplate(props: PageOfPostsListTemplateProps) {
  const { object, posts, pinnedPosts, blogPosts, totalPages, currentPage } = props

  return (
    <>
      <HeaderPage
        title={object.longName ? `${object.longName} (${object.name})` : object.name}
        subtitle={object.subtitle || object.description}
        iconPath={object.iconPath}
        icon={object.icon}
        objectClassName={object.className}
      />
      <Container>
        {posts.length + pinnedPosts.length === 0 && blogPosts && blogPosts.length === 0 && (
          <div className="my-4 text-xl">There is no post yet!</div>
        )}
        {(posts.length > 0 || pinnedPosts.length > 0 || (blogPosts && blogPosts.length > 0)) && (
          <>
            <div className="flex flex-col gap-8">
              {blogPosts && blogPosts.length > 0 && (
                <div className="flex flex-col gap-2 overflow-hidden">
                  {pinnedPosts.length + posts.length > 0 && (
                    <HeadingPage
                      title="Blog posts"
                      href={blogPosts.length >= 4 ? '/blogs/' : undefined}
                      className="text-xl"
                    />
                  )}

                  <Suspense
                    fallback={
                      <SkeletonPostList
                        count={4}
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
              )}

              <div className="flex flex-col gap-2">
                {blogPosts && blogPosts.length > 0 && pinnedPosts.length + posts.length > 0 && (
                  <HeadingPage title="Notes" className="text-xl" />
                )}

                {pinnedPosts.length > 0 && (
                  <PostList
                    className="mb-2"
                    posts={pinnedPosts}
                    postType="PostSimple"
                    postTypeOpts={{ ...defaultPostTypeOpts, showPinned: true }}
                    options={{
                      className: postSimpleListContainerClass
                    }}
                  />
                )}

                {posts.length > 0 && (
                  <div className="overflow-hidden">
                    <PostList
                      posts={posts}
                      postType={props.postType || 'PostSimple'}
                      postTypeOpts={defaultPostTypeOpts}
                      options={{
                        className: props.postListContainerClassName || postSimpleListContainerClass
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            {totalPages > 1 && object.uri && (
              <Pagination
                className="my-8"
                path={object.uri}
                total={totalPages}
                current={currentPage}
                pageAlias="page"
              />
            )}
          </>
        )}
      </Container>
    </>
  )
}

export function SkeletonPageOfPostsListTemplate(props: {
  numPosts?: number
  postType?: PostType
  postListContainerClassName?: string
}) {
  return (
    <>
      <HeaderPageSkeleton />
      <Container>
        <SkeletonPostList
          count={props.numPosts || 4}
          postType={props.postType || 'PostSimple'}
          className={props.postListContainerClassName || postSimpleListContainerClass}
        />
      </Container>
    </>
  )
}
