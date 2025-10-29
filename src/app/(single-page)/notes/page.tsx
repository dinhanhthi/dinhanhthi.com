import { defaultBlurDataURL, numPostsToShow } from '@/src/lib/config'
import { getPosts, getTopics } from '@/src/lib/fetcher'
import { filterDupLangPosts, getMetadata } from '@/src/lib/helpers'
import { queryDefinitions } from '@/src/lib/query-definitions'
import { Suspense } from 'react'
import Container from '../../components/Container'
import HeaderPage from '../../components/HeaderPage'
import NotesToc, { SkeletonNotesToc } from '../../components/NotesToc'
import NotesPageList from './NotesPageList'

export const dynamic = 'force-dynamic'
export const revalidate = 60

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
    ...queryDefinitions.notesPage.pinnedPosts,
    whoIsCalling: '(single-page)/notes/page.tsx/NotesHomePage/getPinnedPosts'
  })
  const pinnedPosts = filterDupLangPosts(_pinnedPosts)

  const _blogPosts = await getPosts({
    ...queryDefinitions.notesPage.blogPosts,
    whoIsCalling: '(single-page)/notes/page.tsx/NotesHomePage/getBlogPosts'
  })
  const blogPosts = filterDupLangPosts(_blogPosts).slice(0, numBlogPosts)

  const _posts = await getPosts({
    ...queryDefinitions.notesPage.allNotes,
    whoIsCalling: '(single-page)/notes/page.tsx/NotesHomePage/getPosts'
  })
  const posts = filterDupLangPosts(_posts).slice(0, numPostsToShow + pinnedPosts.length)

  const _tags = await getTopics({ whoIsCalling: '(single-page)/notes/page.tsx/NotesHomePage' })
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
    <>
      <HeaderPage
        title="Notes"
        subtitle="When I learn something new, I write it down here. It helps me to remember and understand better. I hope you find it useful."
        iconPath={'/logo_sketches/sketch_notes_nobg.png'}
      />
      <Container className="flex flex-col gap-12 md:flex-row md:gap-4">
        <NotesPageList
          className="order-2"
          blogPosts={blogPosts}
          pinnedPosts={pinnedPosts}
          posts={posts}
          pinnedTags={pinnedTagsSorted}
          numBlogPosts={numBlogPosts}
        />

        <Suspense fallback={<SkeletonNotesToc />}>
          <NotesToc
            className={
              'top-[60px] order-1 h-fit w-full md:sticky md:order-2 md:h-[calc(100vh-110px)] md:w-fit'
            }
            tags={pinnedTagsSorted}
            hidePinnedTags={pinnedPosts.length === 0}
          />
        </Suspense>
      </Container>
    </>
  )
}
