/* eslint-disable quotes */
import HeadingWithMore from '@notion-x/src/components/HeadingWithMore'
import PostList from '@notion-x/src/components/PostsList'
import SkeletonPostList from '@notion-x/src/components/SkeletonPostList'
import cn from 'classnames'
import Link from 'next/link'
import { Suspense } from 'react'

import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import me from '../data/me'
import { Book, BookmarkItem, Tool } from '../interface'
import BookmarkItemSimpleTemplate, {
  SkeletonBookmarkItemSimpleTemplate
} from './(single-page)/bookmarks/BookmarkItemSimpleTemplate'
import ToolItem, { ToolItemInputType } from './(single-page)/tools/ToolItem'
import { SkeletonToolItem } from './(single-page)/tools/ToolsPage'
import Container from './components/Container'
import Footer from './components/Footer'
import HeaderIndex from './components/HeaderIndex'
import ProjectItem, { Project, SkeletonProjectItem } from './components/ProjectItem'
import Topic from './components/Topic'
import { bodyPadding, containerWide, defaultBlurDataURL, defaultPostTypeOpts } from './lib/config'
import {
  getPosts,
  getTopics,
  getUnofficialBookmarks,
  getUnofficialBooks,
  getUnofficialProjects,
  getUnofficialTools
} from './lib/fetcher'
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
  const numPosts = 10
  const numProjects = 6
  const numBookmarks = 6
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
    pageSize: numPosts,
    filter: {
      property: 'blog',
      checkbox: {
        equals: false
      }
    }
  })
  const projects = await getUnofficialProjects()
  const _topics = await getTopics()
  const { tools } = await getUnofficialTools()
  const { bookmarks } = await getUnofficialBookmarks()
  const { books } = await getUnofficialBooks()

  const topics = _topics.map(topic => ({
    ...topic,
    icon: { sourceUrl: topic.iconUrl, width: 20, height: 20, blurDataURL: defaultBlurDataURL }
  }))

  const projectsToShow = projects.slice(0, numProjects)
  const isThereDsProject = projectsToShow.some(project => project.type.includes('ds'))
  const isThereWebProject = projectsToShow.some(project => project.type.includes('web'))
  const isThereOtherProject = projectsToShow.some(project => project.type.includes('other'))

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
                    postTypeOpts={defaultPostTypeOpts}
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
              href={posts.length >= numPosts ? '/notes/' : undefined}
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
                      postTypeOpts={{ ...defaultPostTypeOpts, showPinned: true }}
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

          {/* Bookmarks */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore
              title="Recent bookmarks"
              href={bookmarks.length >= numBookmarks ? '/bookmarks/' : undefined}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bookmarks.slice(0, numBookmarks).map((mark: BookmarkItem, index: number) => (
                <Suspense
                  key={mark.id}
                  fallback={<SkeletonBookmarkItemSimpleTemplate index={index} />}
                >
                  <BookmarkItemSimpleTemplate
                    key={mark.id}
                    mark={mark}
                    hidePinIcon={true}
                    hideDescription={false}
                    hideTags={true}
                  />
                </Suspense>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore
              title="Recent tools I use"
              href={tools.length >= numTools ? '/tools/' : undefined}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-3">
              {tools.slice(0, numTools).map((tool: Tool) => (
                <Suspense key={tool.id} fallback={<SkeletonToolItem />}>
                  <ToolItem key={tool.id} tool={tool as any} hideTags={true} />
                </Suspense>
              ))}
            </div>
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

          {/* Projects */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore
              title="Recent projects"
              href={projects.length >= numProjects ? '/projects/' : undefined}
            />
            <div className="flex flex-col gap-x-3 gap-y-4">
              <div className="flex gap-4 flex-wrap">
                {isThereDsProject && (
                  <div className="flex gap-2 items-center">
                    <div className="h-1 rounded-xl w-8 sm:w-16 bg-sky-600"></div>
                    <div className="text-slate-600 text-sm">
                      <span className="hidden sm:inline whitespace-nowrap">Data Science</span>
                      <span className="sm:hidden">DS</span>
                    </div>
                  </div>
                )}

                {isThereWebProject && (
                  <div className="flex gap-2 items-center">
                    <div className="h-1 rounded-xl w-8 sm:w-16 bg-amber-500"></div>
                    <div className="text-slate-600 text-sm">
                      <span className="hidden sm:inline whitespace-nowrap">Web Development</span>
                      <span className="sm:hidden">Web</span>
                    </div>
                  </div>
                )}

                {isThereOtherProject && (
                  <div className="flex gap-2 items-center">
                    <div className="h-1 rounded-xl w-8 sm:w-16 bg-emerald-600"></div>
                    <div className="text-slate-600 text-sm whitespace-nowrap">Others</div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:gap-3 xl:grid-cols-3 overflow-hidden">
                {projects.slice(0, numProjects).map((project: Project) => (
                  <Suspense key={project.id} fallback={<SkeletonProjectItem />}>
                    <ProjectItem key={project.id} project={project} grayScale={true} />
                  </Suspense>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer footerType="gray" />
      <ScrollToTop />
    </div>
  )
}
