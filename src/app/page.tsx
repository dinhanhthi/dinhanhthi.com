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
  numPostsToShow,
  postBlogSimpleListClass,
  postSimpleListClass
} from './lib/config'
import { getPosts, getTopics, getUnofficialBooks, getUnofficialTools } from './lib/fetcher'
import { filterDupLangPosts, getMetadata } from './lib/helpers'

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
    <div className="thi-bg-stone">
      <HeaderIndex />
      <Container className={cn(bodyPadding, containerWide)}>
        <div className="flex flex-col gap-14">
          {/* Logs */}
          {/* <div className="flex flex-col gap-4">
            <HeadingWithMore
              title="Logs"
              href={posts.length >= numPostsToShow ? '/notes/' : undefined}
            />
            <div className={cn('thi-box-code flex flex-col gap-6 py-6 pr-6 pl-10')}>
              <DemoLogDay dateText="today" />
              <DemoLogDay dateText="6 days ago" />
            </div>
          </div> */}

          {/* Notes */}
          <div className="flex flex-col gap-4">
            <HeadingWithMore
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
                          className: postSimpleListClass
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
                        className: postSimpleListClass
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
              </>
            </div>
          </div>

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
                    postTypeOpts={{ ...defaultPostTypeOpts }}
                    options={{
                      className: postBlogSimpleListClass
                    }}
                  />
                </Suspense>
              </div>
            </div>
          )}

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
              <div className="italic text-[0.95rem] text-slate-700">
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

// function DemoLogDay(props: any) {
//   return (
//     <div className="flex flex-col gap-6 border-l border-dashed border-slate-300">
//       <div className="-ml-4 bg-white text-[1rem] text-sky-700">{props.dateText || 'today'}</div>
//       <div className="flex flex-col gap-6 -ml-4">
//         {/* Log 1 */}
//         <DemoLogItem />

//         {/* Log 2 */}
//         <DemoLogItem hidePhotos={true} />
//       </div>
//     </div>
//   )
// }

// function DemoLogItem(props: any) {
//   return (
//     <div className="flex flex-row gap-2 items-start group">
//       <div className="bg-white rounded-full border border-slate-300 group-hover:border-slate-400 border-dashed shrink-0 flex items-center justify-center w-8 h-8 -mt-0.5">
//         <StreamlineApplicationAdd className="w-4 h-4 shrink-0 bg-white text-slate-500 group-hover:text-slate-600" />
//       </div>
//       <div className="flex flex-col gap-2 text-[0.95rem] leading-relaxed">
//         <div className="text-slate-800 group-hover:text-slate-950">
//           Để có thể save hình đã chụp trong clipboard thành một file riêng trên macOS, mở Preview
//           lên rồi nhấn cmd+N là xong. Để có thể save hình đã chụp trong clipboard thành một file
//           riêng trên macOS, mở Preview lên rồi nhấn cmd+N là xong.
//         </div>
//         {!props.hidePhotos && (
//           <div className="flex flex-row gap-4">
//             <Image
//               src="https://images.unsplash.com/photo-1730774487035-05673e0c5747?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//               width={100}
//               height={100}
//               alt="Picture of the author"
//               className="rounded-xl"
//             />
//             <Image
//               src="https://plus.unsplash.com/premium_photo-1730156312766-e5ab6e27a993?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//               width={100}
//               height={100}
//               alt="Picture of the author"
//               className="rounded-xl"
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
