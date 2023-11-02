import Container from '@/src/app/components/Container'
import Pagination from '@notion-x/src/components/Pagination'
import PostList from '@notion-x/src/components/PostsList'
import SkeletonPostList from '@notion-x/src/components/SkeletonPostList'
import { Post, Tag } from '@notion-x/src/interface'
import cn from 'classnames'

import Footer from '../components/Footer'
import HeaderPage, { HeaderPageSkeleton } from '../components/HeaderPage'
import { bodyPadding, containerWide, defaultPostTypeOpts } from '../lib/config'

type PageOfPostsListTemplateProps = {
  object: Tag
  posts: Post[]
  totalPages: number
  currentPage: number
}

export default function PageOfPostsListTemplate(props: PageOfPostsListTemplateProps) {
  const { object, posts, totalPages, currentPage } = props
  const pinnedPosts = posts.filter(post => post.pinned)

  return (
    <div className="thi-bg-stone">
      <HeaderPage
        headerType="gray"
        headerWidth="wide"
        title={object.name}
        icon={object.icon}
        iconClassName={object.className}
      />
      <Container className={cn(bodyPadding, containerWide)}>
        {posts.length === 0 && <div className="my-4 text-xl">There is no post yet!</div>}
        {posts.length > 0 && (
          <>
            <div className="flex flex-col gap-8">
              {pinnedPosts.length > 0 && (
                <div className="thi-box-code overflow-hidden">
                  <PostList
                    posts={pinnedPosts}
                    postType="PostSimple"
                    postTypeOpts={{ ...defaultPostTypeOpts, showPinned: true }}
                    options={{
                      className: 'flex flex-col divide-y'
                    }}
                  />
                </div>
              )}
              {posts.length > 0 && (
                <div className="thi-box-code overflow-hidden">
                  <PostList
                    posts={posts.filter(post => !post.pinned)}
                    postType="PostSimple"
                    postTypeOpts={defaultPostTypeOpts}
                    options={{
                      className: 'flex flex-col divide-y'
                    }}
                  />
                </div>
              )}
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

export function SkeletonPageOfPostsListTemplate() {
  return (
    <div className="thi-bg-stone">
      <HeaderPageSkeleton headerType="gray" />
      <Container className={cn(bodyPadding, containerWide)}>
        <div className="thi-box-code overflow-hidden">
          <SkeletonPostList
            count={4}
            postType="PostSimple"
            options={{
              className: 'flex flex-col divide-y'
            }}
          />
        </div>
      </Container>
      <Footer footerType="gray" />
    </div>
  )
}
