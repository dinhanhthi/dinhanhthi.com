import { Suspense } from 'react'

import {
  defaultBlurDataURL,
  defaultPostTypeOpts,
  postSimpleListContainerClass
} from '@/src/lib/config'
import { getPosts, getTopics, getUnofficialBooks, getUnofficialTools } from '@/src/lib/fetcher'
import { filterDupLangPosts, getMetadata } from '@/src/lib/helpers'
import { queryDefinitions } from '@/src/lib/query-definitions'
import { Book } from '@/src/lib/types'
import me from '../data/me'
import BookItem, { SkeletonBookItem } from './(single-page)/reading/BookItem'
import ToolSimpleSection, { SkeletonToolPageSection } from './(single-page)/tools/ToolSimpleSection'
import AnimatedSkillsSection from './components/AnimatedSkillsSection'
import Container from './components/Container'
import HeaderThiCard from './components/HeaderThiCard'
import HeadingPage from './components/HeadingPage'
import PostList, { SkeletonPostList } from './components/PostsList'
import Topic, { SkeletonTopic } from './components/Topic'

// This allows static generation with periodic updates
// Redis cache is still used during data fetching
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

// Async component for Blog section wrapper (checks if blog posts exist)
async function BlogSection() {
  const _blogPosts = await getPosts({
    ...queryDefinitions.homePage.blogPosts,
    whoIsCalling: 'page.tsx/BlogSection'
  })
  const blogPosts = filterDupLangPosts(_blogPosts).slice(
    0,
    (queryDefinitions.homePage.blogPosts.pageSize ?? 0) / 2
  )

  if (blogPosts.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <HeadingPage title="Recent blog posts" href="/blogs/" />
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
    </div>
  )
}

// Async component for Notes section wrapper (checks if notes exist)
async function NotesSection() {
  const _pinnedPosts = await getPosts({
    ...queryDefinitions.homePage.pinnedPosts,
    whoIsCalling: 'page.tsx/NotesSection/getPinnedPosts'
  })
  const pinnedPosts = filterDupLangPosts(_pinnedPosts).slice(
    0,
    (queryDefinitions.homePage.pinnedPosts.pageSize ?? 0) / 2
  )

  const _posts = await getPosts({
    ...queryDefinitions.homePage.recentNotes,
    whoIsCalling: 'page.tsx/NotesSection/getPosts'
  })
  const posts = filterDupLangPosts(_posts).slice(
    0,
    (queryDefinitions.homePage.recentNotes.pageSize ?? 0) / 2
  )

  const nonPinnedPosts = posts.filter(post => !post.pinned)

  // Only show section if there are either pinned posts or non-pinned posts
  if (pinnedPosts.length === 0 && nonPinnedPosts.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <HeadingPage title="Recently updated notes" href="/notes/" />
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
        {nonPinnedPosts.length > 0 && (
          <PostList
            posts={nonPinnedPosts}
            postType="PostSimple"
            postTypeOpts={defaultPostTypeOpts}
            options={{
              className: postSimpleListContainerClass
            }}
          />
        )}
      </div>
    </div>
  )
}

// Async component for Tools section wrapper (checks if tools exist)
async function ToolsSection() {
  const numTools = 6
  const { tools } = await getUnofficialTools({ whoIsCalling: 'page.tsx/ToolsSection' })

  if (tools.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <HeadingPage title="Recent tools I use" href="/tools/" />
      <ToolSimpleSection tools={tools.slice(0, numTools)} />
    </div>
  )
}

// Async component for Reading section wrapper (checks if books exist)
async function ReadingSection() {
  const numBooks = 6
  const { books } = await getUnofficialBooks({ whoIsCalling: 'page.tsx/ReadingSection' })

  if (books.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <HeadingPage title="My reading list" href="/reading/" />
      <div className="flex w-full flex-col gap-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {books.slice(0, numBooks).map((book: Book) => (
            <BookItem key={book.id} book={book} hideDescription={true} hideTags={true} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Async component for Topics section wrapper (checks if topics exist)
async function TopicsSection() {
  const _topics = await getTopics({ whoIsCalling: 'page.tsx/TopicsSection' })
  const topics = _topics.map(topic => ({
    ...topic,
    icon: { sourceUrl: topic.iconUrl, width: 20, height: 20, blurDataURL: defaultBlurDataURL }
  }))

  const pinnedTopics = topics.filter(t => t.pinned)

  if (pinnedTopics.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      <HeadingPage title="Main topics" href="/tags/" />
      <div className="flex flex-wrap gap-4">
        {pinnedTopics.map(topic => (
          <Topic type="simple" key={topic.id} tag={topic} />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <>
      <HeaderThiCard />
      <Container className="flex flex-col gap-12">
        {/* Blog */}
        <Suspense
          fallback={
            <div className="flex flex-col gap-4">
              <HeadingPage title="Recent blog posts" href="/blogs/" />
              <SkeletonPostList
                count={(queryDefinitions.homePage.blogPosts.pageSize ?? 0) / 2}
                postType="PostBlogSimple"
                className={postSimpleListContainerClass}
              />
            </div>
          }
        >
          <BlogSection />
        </Suspense>

        {/* Notes */}
        <Suspense
          fallback={
            <div className="flex flex-col gap-4">
              <HeadingPage title="Recently updated notes" href="/notes/" />
              <SkeletonPostList
                count={8}
                postType="PostSimple"
                className={postSimpleListContainerClass}
              />
            </div>
          }
        >
          <NotesSection />
        </Suspense>

        {/* Tools */}
        <Suspense
          fallback={
            <div className="flex flex-col gap-4">
              <HeadingPage title="Recent tools I use" href="/tools/" />
              <SkeletonToolPageSection numTools={6} hasTitle={false} />
            </div>
          }
        >
          <ToolsSection />
        </Suspense>

        {/* Reading */}
        <Suspense
          fallback={
            <div className="flex flex-col gap-4">
              <HeadingPage title="My reading list" href="/reading/" />
              <div className="flex w-full flex-col gap-3">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonBookItem key={i} />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          <ReadingSection />
        </Suspense>

        {/* Techs */}
        <AnimatedSkillsSection />

        {/* Topics */}
        <Suspense
          fallback={
            <div className="flex flex-col gap-4">
              <HeadingPage title="Main topics" href="/tags/" />
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonTopic key={i} type="simple" />
                ))}
              </div>
            </div>
          }
        >
          <TopicsSection />
        </Suspense>
      </Container>
    </>
  )
}
