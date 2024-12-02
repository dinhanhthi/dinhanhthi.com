import TagIcon from '@/public/tag.svg'
import Container from '@/src/app/components/Container'
import Pagination from '@notion-x/src/components/Pagination'
import PostList, { PostType } from '@notion-x/src/components/PostsList'
import SkeletonPostList from '@notion-x/src/components/SkeletonPostList'
import { ImageType, Post } from '@notion-x/src/interface'
import cn from 'classnames'

import Link from 'next/link'
import { Suspense } from 'react'
import Footer from '../components/Footer'
import HeaderPage, { HeaderPageSkeleton } from '../components/HeaderPage'
import { bodyPadding, containerWide, defaultPostTypeOpts, postBlogSimpleListClass, postSimpleListClass } from '../lib/config'

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
      <Container className={cn(bodyPadding, containerWide)}>
        {posts.length + pinnedPosts.length === 0 && blogPosts && blogPosts.length === 0 && (
          <div className="my-4 text-xl">There is no post yet!</div>
        )}
        {(posts.length > 0 || pinnedPosts.length > 0 || (blogPosts && blogPosts.length > 0)) && (
          <>
            <div className="flex flex-col gap-8">
              {blogPosts && blogPosts.length > 0 && (
                <div className="overflow-hidden flex flex-col gap-2">
                  {pinnedPosts.length + posts.length > 0 && (
                    <div className="flex flex-row gap-2 items-center">
                      <h2 className="font-heading text-xl text-slate-700">Blog posts</h2>
                      {blogPosts.length >= 4 && (
                        <Link
                          href="/blogs/"
                          className="italic text-slate-600 hover:m2it-link-hover"
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
              )}

              <div className="flex flex-col gap-2">
                {blogPosts && blogPosts.length > 0 && pinnedPosts.length + posts.length > 0 && (
                  <div className="flex flex-row gap-2 items-center">
                    <h2 className="font-heading text-xl text-slate-700">Notes</h2>
                  </div>
                )}

                {pinnedPosts.length > 0 && (
                  <div className="thi-box-code overflow-hidden mb-2">
                    <PostList
                      posts={pinnedPosts}
                      postType="PostSimple"
                      postTypeOpts={{ ...defaultPostTypeOpts, showPinned: true }}
                      options={{
                        className: postSimpleListClass
                      }}
                    />
                  </div>
                )}

                {posts.length > 0 && (
                  <div className="overflow-hidden">
                    <PostList
                      posts={posts}
                      postType={props.postType || 'PostSimple'}
                      postTypeOpts={defaultPostTypeOpts}
                      options={{
                        className:
                          props.postListContainerClassName || postSimpleListClass
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
      <Footer footerType="gray" />
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
      <Container className={cn(bodyPadding, containerWide)}>
        <div className={'overflow-hidden'}>
          <SkeletonPostList
            count={props.numPosts || 4}
            postType={props.postType || 'PostSimple'}
            options={{
              className: props.postListContainerClassName || 'flex flex-col divide-y thi-box-code',
              postContainerClassName: 'bg-white'
            }}
          />
        </div>
      </Container>
      <Footer footerType="gray" />
    </div>
  )
}
