import TagIcon from '@/public/tag.svg'
import Container from '@/src/app/components/Container'
import Pagination from '@/src/app/components/Pagination'
import PostList, { PostType } from '@/src/app/components/PostsList'
import SkeletonPostList from '@/src/app/components/skeleton/SkeletonPostList'
import { ImageType, Post } from '@/src/lib/types'
import cn from 'classnames'

import { bodyPadding, defaultPostTypeOpts, postSimpleListContainerClass } from '@/src/lib/config'
import Link from 'next/link'
import { Suspense } from 'react'
import Footer from '../components/Footer'
import HeaderPage, { HeaderPageSkeleton } from '../components/HeaderPage'

export type PageOfPostsListTemplateProps = {
  object: {
    name: string
    longName?: string // first used for tag
    subtitle?: string
    description?: string // alternative to subtitle
    icon: ImageType
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
    <div className="thi-bg-stone">
      <HeaderPage
        headerType="gray"
        headerWidth="wide"
        title={object.longName ? `${object.longName} (${object.name})` : object.name}
        subtitle={object.subtitle || object.description}
        icon={
          object.icon?.sourceUrl || object.icon?.staticImageData
            ? object.icon
            : { staticImageData: TagIcon }
        }
        iconClassName={object.className}
      />
      <Container className={cn(bodyPadding)}>
        {posts.length + pinnedPosts.length === 0 && blogPosts && blogPosts.length === 0 && (
          <div className="my-4 text-xl">There is no post yet!</div>
        )}
        {(posts.length > 0 || pinnedPosts.length > 0 || (blogPosts && blogPosts.length > 0)) && (
          <>
            <div className="flex flex-col gap-8">
              {blogPosts && blogPosts.length > 0 && (
                <div className="flex flex-col gap-2 overflow-hidden">
                  {pinnedPosts.length + posts.length > 0 && (
                    <div className="flex flex-row items-center gap-2">
                      <h2 className="font-heading text-xl text-slate-700">Blog posts</h2>
                      {blogPosts.length >= 4 && (
                        <Link
                          href="/blogs/"
                          className="hover:m2it-link-hover text-slate-600 italic"
                        >
                          ...more
                        </Link>
                      )}
                    </div>
                  )}

                  <Suspense
                    fallback={
                      <SkeletonPostList
                        count={4}
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
              )}

              <div className="flex flex-col gap-2">
                {blogPosts && blogPosts.length > 0 && pinnedPosts.length + posts.length > 0 && (
                  <div className="flex flex-row items-center gap-2">
                    <h2 className="font-heading text-xl text-slate-700">Notes</h2>
                  </div>
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
      <Footer />
    </div>
  )
}

export function SkeletonPageOfPostsListTemplate(props: {
  numPosts?: number
  postType?: PostType
  postListContainerClassName?: string
}) {
  return (
    <div className="thi-bg-stone">
      <HeaderPageSkeleton headerType="gray" />
      <Container className={cn(bodyPadding)}>
        <div className={'overflow-hidden'}>
          <SkeletonPostList
            count={props.numPosts || 4}
            postType={props.postType || 'PostSimple'}
            options={{
              className: props.postListContainerClassName || postSimpleListContainerClass,
              postContainerClassName: 'bg-white'
            }}
          />
        </div>
      </Container>
      <Footer />
    </div>
  )
}
