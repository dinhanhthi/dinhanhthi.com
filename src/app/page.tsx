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
import Container from './components/Container'
import HeaderThiCard from './components/HeaderThiCard'
import HeadingPage from './components/HeadingPage'
import PostList, { SkeletonPostList } from './components/PostsList'
import Topic, { SkeletonTopic } from './components/Topic'

export const dynamic = 'force-dynamic'
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

// Async component for Blog section content
async function BlogSectionContent() {
  const numBlogPosts = 3
  const _blogPosts = await getPosts({
    pageSize: numBlogPosts * 2,
    filter: {
      property: 'blog',
      checkbox: {
        equals: true
      }
    }
  })
  const blogPosts = filterDupLangPosts(_blogPosts).slice(0, numBlogPosts)

  if (blogPosts.length === 0) return null

  return (
    <div className="overflow-hidden">
      <PostList
        posts={blogPosts}
        postType="PostBlogSimple"
        postTypeOpts={{ ...defaultPostTypeOpts }}
        options={{
          className: postSimpleListContainerClass
        }}
      />
    </div>
  )
}

// Async component for Notes section content
async function NotesSectionContent() {
  const numPinnedPosts = 6
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

  return (
    <div className="flex flex-col gap-4">
      {/* pinned */}
      {pinnedPosts.length > 0 && (
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
      )}

      {/* notes */}
      <PostList
        posts={posts.filter(post => !post.pinned)}
        postType="PostSimple"
        postTypeOpts={defaultPostTypeOpts}
        options={{
          className: postSimpleListContainerClass
        }}
      />
    </div>
  )
}

// Async component for Tools section content
async function ToolsSectionContent() {
  const numTools = 6
  const { tools } = await getUnofficialTools()

  return <ToolSimpleSection tools={tools.slice(0, numTools)} />
}

// Async component for Reading section content
async function ReadingSectionContent() {
  const numBooks = 6
  const { books } = await getUnofficialBooks()

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {books.slice(0, numBooks).map((book: Book) => (
          <BookItem key={book.id} book={book} hideDescription={true} hideTags={true} />
        ))}
      </div>
    </div>
  )
}

// Async component for Topics section content
async function TopicsSectionContent() {
  const _topics = await getTopics()
  const topics = _topics.map(topic => ({
    ...topic,
    icon: { sourceUrl: topic.iconUrl, width: 20, height: 20, blurDataURL: defaultBlurDataURL }
  }))

  return (
    <div className="flex flex-wrap gap-4">
      {topics
        .filter(t => t.pinned)
        .map(topic => (
          <Topic type="simple" key={topic.id} tag={topic} />
        ))}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <HeaderThiCard />
      <Container className="flex flex-col gap-12">
        {/* Blog */}
        <div className="flex flex-col gap-4">
          <HeadingPage title="Recent blog posts" href="/blogs/" />
          <Suspense
            fallback={
              <SkeletonPostList
                count={2}
                postType="PostBlogSimple"
                className={postSimpleListContainerClass}
              />
            }
          >
            <BlogSectionContent />
          </Suspense>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-4">
          <HeadingPage title="Recently updated notes" href="/notes/" />
          <Suspense
            fallback={
              <SkeletonPostList
                count={2}
                postType="PostSimple"
                className={postSimpleListContainerClass}
              />
            }
          >
            <NotesSectionContent />
          </Suspense>
        </div>

        {/* Tools */}
        <div className="flex flex-col gap-4">
          <HeadingPage title="Recent tools I use" href="/tools/" />
          <Suspense fallback={<SkeletonToolPageSection numTools={4} hasTitle={false} />}>
            <ToolsSectionContent />
          </Suspense>
        </div>

        {/* Reading */}
        <div className="flex flex-col gap-4">
          <HeadingPage title="My reading list" href="/reading/" />
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonBookItem key={i} />
                  ))}
                </div>
              </div>
            }
          >
            <ReadingSectionContent />
          </Suspense>
        </div>

        {/* Topics */}
        <div className="flex flex-col gap-4">
          <HeadingPage title="Main topics" href="/tags/" />
          <Suspense
            fallback={
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonTopic key={i} type="simple" />
                ))}
              </div>
            }
          >
            <TopicsSectionContent />
          </Suspense>
        </div>
      </Container>
    </>
  )
}
