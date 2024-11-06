/* eslint-disable quotes */
import HeadingWithMore from '@notion-x/src/components/HeadingWithMore'
import PostList from '@notion-x/src/components/PostsList'
import SkeletonPostList from '@notion-x/src/components/SkeletonPostList'
import cn from 'classnames'
import Link from 'next/link'
import { Suspense } from 'react'

import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import me from '../data/me'
import { Book } from '../interface'
import ToolItem, { SkeletonToolItem, ToolItemInputType } from './(single-page)/tools/ToolItem'
import ToolSimpleSection, { SkeletonToolPageSection } from './(single-page)/tools/ToolSimpleSection'
import Container from './components/Container'
import Footer from './components/Footer'
import HeaderIndex from './components/HeaderIndex'
import Topic from './components/Topic'
import {
  bodyPadding,
  containerWide,
  defaultBlurDataURL,
  defaultPostTypeOpts,
  numPostsToShow
} from './lib/config'
import { getPosts, getTopics, getUnofficialBooks, getUnofficialTools } from './lib/fetcher'
import { getMetadata } from './lib/helpers'

export const revalidate = 20

export const metadata = getMetadata({
  title: "Hi! I'm Thi",
  description: me.quote,
  images: [
    {
      url: 'https://i.imgur.com/PyXUtfTh.png',
      width: 1024,
      height: 581
    }
  ]
})

export default async function Home() {
  const numPinnedPosts = 6
  const numTools = 6
  const numBooks = 6
  const numBlogPosts = 4

  const pinnedPosts = await getPosts({
    pageSize: numPinnedPosts,
    filter: {
      and: [
        {
          property: 'pinned',
          checkbox: {
            equals: true
          }
        },
        {
          property: 'blog',
          checkbox: {
            equals: false
          }
        }
      ]
    }
  })
  const blogPosts = await getPosts({
    pageSize: numBlogPosts,
    filter: {
      property: 'blog',
      checkbox: {
        equals: true
      }
    }
  })
  const posts = await getPosts({
    pageSize: numPostsToShow,
    filter: {
      property: 'blog',
      checkbox: {
        equals: false
      }
    }
  })
  const _topics = await getTopics()
  const { tools } = await getUnofficialTools()
  const { books } = await getUnofficialBooks()

  const topics = _topics.map(topic => ({
    ...topic,
    icon: { sourceUrl: topic.iconUrl, width: 20, height: 20, blurDataURL: defaultBlurDataURL }
  }))

  return (
    <div className="thi-bg-stone">
      <HeaderIndex />
      <Container className={cn(bodyPadding, containerWide)}>
        <div className="flex flex-col gap-14">
          {/* Blog */}
          {blogPosts.length > 0 && (
            <div className="flex flex-col gap-4">
              <HeadingWithMore
                title="Recent blog posts"
                href={blogPosts.length >= numBlogPosts ? '/blogs/' : undefined}
              />
              <div className="overflow-hidden">
                <Suspense
                  fallback={
                    <SkeletonPostList
                      count={numBlogPosts}
                      postType="PostCardWave"
                      options={{
                        className: 'grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 sm:gap-x-4'
                      }}
                    />
                  }
                >
                  <PostList
                    posts={blogPosts}
                    postType="PostCardWave"
                    postTypeOpts={{
                      ...defaultPostTypeOpts,
                      fontClassName: 'font-family-base text-base'
                    }}
                    options={{
                      className: 'grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 sm:gap-x-4'
                    }}
                  />
                </Suspense>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore
              title="Recently updated notes"
              href={posts.length >= numPostsToShow ? '/notes/' : undefined}
            />

            <div className="flex flex-col gap-2">
              {/* pinned */}
              {pinnedPosts.length > 0 && (
                <div className="thi-box-code overflow-hidden mb-3">
                  <Suspense
                    fallback={
                      <SkeletonPostList
                        count={6}
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
                      postTypeOpts={{
                        ...defaultPostTypeOpts,
                        showPinned: true
                      }}
                      options={{
                        className: 'flex flex-col divide-y'
                      }}
                    />
                  </Suspense>
                </div>
              )}

              {/* notes */}
              <div className="thi-box-code overflow-hidden">
                <Suspense
                  fallback={
                    <SkeletonPostList
                      count={8}
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
          </div>

          {/* Tools */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore
              title="Recent tools I use"
              href={tools.length >= numTools ? '/tools/' : undefined}
            />
            <Suspense fallback={<SkeletonToolPageSection />}>
              <ToolSimpleSection tools={tools.slice(0, numTools)} />
            </Suspense>
          </div>

          {/* Reading */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore
              title="My reading list"
              href={tools.length >= numTools ? '/reading/' : undefined}
            />
            <div className="w-full flex flex-col gap-3">
              <div className="italic text-[0.95rem]">
                Read more:{' '}
                <Link className="m2it-link" href="/note/my-taste-of-reading/">
                  My taste of reading.
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3">
                {books.slice(0, numBooks).map((book: Book) => (
                  <Suspense key={book.id} fallback={<SkeletonToolItem />}>
                    <ToolItem
                      type="book"
                      key={book.id}
                      tool={book as ToolItemInputType}
                      hideDescription={true}
                      hideTags={true}
                    />
                  </Suspense>
                ))}
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore title="Main topics" href="/tags/" />
            <div className="flex flex-wrap gap-4 overflow-hidden">
              {topics
                .filter(t => t.pinned)
                .map(topic => (
                  <Topic type="simple" key={topic.id} tag={topic} />
                ))}
            </div>
          </div>
        </div>
      </Container>
      <Footer footerType="gray" />
      <ScrollToTop />
    </div>
  )
}
