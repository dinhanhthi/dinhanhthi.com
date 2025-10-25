import HeadingPage from '@/src/app/components/HeadingPage'
import PostList from '@/src/app/components/PostsList'
import SkeletonPostList from '@/src/app/components/skeleton/SkeletonPostList'
import { Suspense } from 'react'

import {
  defaultBlurDataURL,
  defaultPostTypeOpts,
  numPostsToShow,
  postSimpleListContainerClass
} from '@/src/lib/config'
import { getPosts, getTopics, getUnofficialBooks, getUnofficialTools } from '@/src/lib/fetcher'
import { filterDupLangPosts, getMetadata } from '@/src/lib/helpers'
import { Book } from '@/src/lib/types'
import me from '../data/me'
import BookItem, { SkeletonBookItem } from './(single-page)/reading/BookItem'
import ToolSimpleSection, { SkeletonToolPageSection } from './(single-page)/tools/ToolSimpleSection'
import HeaderThiCard from './components/HeaderThiCard'
import Topic from './components/Topic'

export const revalidate = 60

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
  const numBlogPosts = 3

  const _pinnedPosts = await getPosts({
    pageSize: numPinnedPosts * 2,
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
  const pinnedPosts = filterDupLangPosts(_pinnedPosts).slice(0, numPinnedPosts)

  const _blogPosts = await getPosts({
    pageSize: numBlogPosts * 2, // *2 because we will splice the duplicated posts (post in diff languages)
    filter: {
      property: 'blog',
      checkbox: {
        equals: true
      }
    }
  })
  const blogPosts = filterDupLangPosts(_blogPosts).slice(0, numBlogPosts)

  const _posts = await getPosts({
    pageSize: numPostsToShow * 2,
    filter: {
      property: 'blog',
      checkbox: {
        equals: false
      }
    }
  })
  const posts = filterDupLangPosts(_posts).slice(0, numPostsToShow)

  const _topics = await getTopics()
  const { tools } = await getUnofficialTools()
  const { books } = await getUnofficialBooks()

  const topics = _topics.map(topic => ({
    ...topic,
    icon: { sourceUrl: topic.iconUrl, width: 20, height: 20, blurDataURL: defaultBlurDataURL }
  }))

  return (
    <>
      <HeaderThiCard />
      <div className="flex flex-col gap-12">
        {/* Notes */}
        <div className="flex flex-col gap-4">
          <HeadingPage
            title="Recently updated notes"
            href={posts.length >= numPostsToShow ? '/notes/' : undefined}
          />

          <div className="flex flex-col gap-2">
            {/* pinned */}
            {pinnedPosts.length > 0 && (
              <>
                <Suspense
                  fallback={
                    <SkeletonPostList
                      count={6}
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
                    postTypeOpts={{
                      ...defaultPostTypeOpts,
                      showPinned: true
                    }}
                    options={{
                      className: postSimpleListContainerClass
                    }}
                  />
                </Suspense>
              </>
            )}

            {/* notes */}
            <>
              <Suspense
                fallback={
                  <SkeletonPostList
                    count={8}
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
        </div>

        {/* Blog */}
        {blogPosts.length > 0 && (
          <div className="flex flex-col gap-4">
            <HeadingPage
              title="Recent blog posts"
              href={blogPosts.length >= numBlogPosts ? '/blogs/' : undefined}
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
                  postTypeOpts={{ ...defaultPostTypeOpts }}
                  options={{
                    className: postSimpleListContainerClass
                  }}
                />
              </Suspense>
            </div>
          </div>
        )}

        {/* Tools */}
        <div className="flex flex-col gap-4">
          <HeadingPage
            title="Recent tools I use"
            href={tools.length >= numTools ? '/tools/' : undefined}
          />
          <Suspense fallback={<SkeletonToolPageSection numTools={numTools} />}>
            <ToolSimpleSection tools={tools.slice(0, numTools)} />
          </Suspense>
        </div>

        {/* Reading */}
        <div className="flex flex-col gap-4">
          <HeadingPage
            title="My reading list"
            href={tools.length >= numTools ? '/reading/' : undefined}
          />
          <div className="flex w-full flex-col gap-3">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {books.slice(0, numBooks).map((book: Book) => (
                <Suspense key={book.id} fallback={<SkeletonBookItem />}>
                  <BookItem key={book.id} book={book} hideDescription={true} hideTags={true} />
                </Suspense>
              ))}
            </div>
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-col gap-4">
          <HeadingPage title="Main topics" href="/tags/" />
          <div className="flex flex-wrap gap-4">
            {topics
              .filter(t => t.pinned)
              .map(topic => (
                <Topic type="simple" key={topic.id} tag={topic} />
              ))}
          </div>
        </div>
      </div>
    </>
  )
}
