import NotesIcon from '@/public/notes.svg'
import SkeletonPostList from '@/src/app/components/skeleton/SkeletonPostList'
import { Suspense } from 'react'

import ScrollToTop from '@/src/app/components/ScrollToTop'
import {
  bodyPadding,
  defaultBlurDataURL,
  numPostsToShow,
  postSimpleListContainerClass
} from '@/src/lib/config'
import { getPosts, getTopics } from '@/src/lib/fetcher'
import { filterDupLangPosts, getMetadata } from '@/src/lib/helpers'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderPage from '../../components/HeaderPage'
import NotesToc from '../../components/NotesToc'
import NotesPageList from './NotesPageList'

export const revalidate = 20

const title = 'Notes'
const description = 'When I learn something new, I write it down here.'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function NotesHomePage() {
  const numBlogPosts = 3

  const _pinnedPosts = await getPosts({
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
  const pinnedPosts = filterDupLangPosts(_pinnedPosts)

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

  const _posts = await getPosts({ pageSize: (numPostsToShow + pinnedPosts.length) * 2 })
  const posts = filterDupLangPosts(_posts).slice(0, numPostsToShow + pinnedPosts.length)

  const _tags = await getTopics()
  const tags = _tags.map(tag => ({
    ...tag,
    icon: { sourceUrl: tag.iconUrl, width: 30, height: 30, blurDataURL: defaultBlurDataURL }
  }))

  const pinnedTags = tags.filter(tag => tag.pinned)
  // Put "Others" at the end
  const others = tags.find(tag => tag.name === 'Others')
  const pinnedTagsSorted = pinnedTags.filter(tag => tag.name !== 'Others')
  if (others) pinnedTagsSorted.push(others)

  return (
    <div className="thi-bg-stone flex flex-col">
      <HeaderPage
        title="Notes"
        subtitle="When I learn something new, I write it down here. It helps me to remember and understand better. I hope you find it useful."
        headerType="gray"
        headerWidth="wide"
        icon={{ staticImageData: NotesIcon }}
        iconClassName="h-12 w-12"
      />
      <Container className={bodyPadding}>
        <div className="flex flex-col gap-8 md:flex-row">
          <Suspense fallback={<SkeletonNotesPageBody />}>
            <NotesPageList
              blogPosts={blogPosts}
              pinnedPosts={pinnedPosts}
              posts={posts}
              pinnedTags={pinnedTagsSorted}
              numBlogPosts={numBlogPosts}
            />
          </Suspense>

          <NotesToc
            className={
              'top-[70px] order-1 h-fit w-full md:sticky md:order-2 md:h-[calc(100vh-110px)] md:w-fit'
            }
            tags={pinnedTagsSorted}
            hidePinnedTags={pinnedPosts.length === 0}
          />
        </div>
      </Container>
      <Footer footerType="gray" />
      <ScrollToTop />
    </div>
  )
}

function SkeletonNotesPageBody() {
  return (
    <div className="flex flex-1 flex-col gap-12">
      {/* Blog posts */}
      <div className="flex flex-col gap-4">
        <div className="flex animate-pulse items-center gap-2">
          <div className="h-[30px] w-[30px] rounded-full bg-slate-200"></div>
          <div className="h-[26px] w-[250px] rounded-2xl bg-slate-200"></div>
        </div>
        <SkeletonPostList
          count={2}
          postType="PostBlogSimple"
          options={{
            className: postSimpleListContainerClass
          }}
        />
      </div>

      {/* Notes */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="flex animate-pulse items-center gap-2">
            <div className="h-[30px] w-[30px] rounded-full bg-slate-200"></div>
            <div className="h-[26px] w-[250px] rounded-2xl bg-slate-200"></div>
          </div>
          <div className="thi-box-code flex-1 overflow-hidden">
            <SkeletonPostList
              count={2}
              postType="PostSimple"
              options={{
                className: postSimpleListContainerClass
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
