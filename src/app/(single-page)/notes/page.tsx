import NotesIcon from '@/public/notes.svg'
import HeadingWithMore from '@notion-x/src/components/HeadingWithMore'
import PostList from '@notion-x/src/components/PostsList'
import SkeletonPostList from '@notion-x/src/components/SkeletonPostList'
import { Tag } from '@notion-x/src/interface'
import cn from 'classnames'
import { Suspense } from 'react'

import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderPage from '../../components/HeaderPage'
import NoteTopicSection from '../../components/NoteTopicSection'
import NotesToc from '../../components/NotesToc'
import {
  bodyPadding,
  containerWide,
  defaultBlurDataURL,
  defaultPostTypeOpts
} from '../../lib/config'
import { getPosts, getTopics } from '../../lib/fetcher'
import { getMetadata } from '../../lib/helpers'

export const revalidate = 20

const title = 'Notes'
const description = 'When I learn something new, I write it down here.'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function NotesPage() {
  const pinnedPosts = await getPosts({
    filter: {
      property: 'pinned',
      checkbox: {
        equals: true
      }
    }
  })
  const posts = await getPosts({ pageSize: 8 + pinnedPosts.length })
  const _tags = await getTopics()
  const tags = _tags.map(tag => ({
    ...tag,
    icon: { sourceUrl: tag.iconUrl, width: 30, height: 30, blurDataURL: defaultBlurDataURL }
  }))

  const pinnedTags = tags.filter(tag => tag.pinned)

  return (
    <div className="thi-bg-stone flex flex-col">
      <HeaderPage
        title="Notes"
        subtitle={`When I learn something new, I write it down here. It helps me to remember and
          understand better. I hope you find it useful.`}
        headerType="gray"
        headerWidth="wide"
        icon={{ staticImageData: NotesIcon }}
        iconClassName="h-12 w-12"
      />
      <Container className={cn(bodyPadding, containerWide)}>
        <div className="flex flex-col md:flex-row gap-8">
          <Suspense fallback={<SkeletonNotesPageBody />}>
            <div className="order-2 flex-1 flex flex-col gap-12">
              {/* pinned */}
              <div className="flex flex-col gap-2">
                <HeadingWithMore title="Pinned notes" className="scroll-mt-[70px]" />
                <div className="thi-box-code overflow-hidden">
                  <Suspense
                    fallback={
                      <SkeletonPostList
                        count={4}
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
              </div>

              {/* Recently updated notes */}
              <div className="flex flex-col gap-2">
                <HeadingWithMore title="Recently updated notes" className="scroll-mt-[70px]" />
                <div className="thi-box-code overflow-hidden">
                  <Suspense
                    fallback={
                      <SkeletonPostList
                        count={4}
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

              {pinnedTags.map((tag: Tag) => (
                <NoteTopicSection key={tag.id} tag={tag} />
              ))}
            </div>
          </Suspense>

          <NotesToc
            className={'order-1 md:order-2 md:sticky top-[70px] h-fit md:w-fit w-full'}
            tags={pinnedTags}
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
    <div className="flex-1 flex flex-col gap-12">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="flex gap-2 items-center animate-pulse">
            <div className="h-[30px] w-[30px] rounded-full bg-slate-200"></div>
            <div className="h-[30px] bg-slate-200 w-[250px] rounded-md"></div>
          </div>
          <div className="thi-box-code overflow-hidden flex-1">
            <SkeletonPostList
              count={2}
              postType="PostSimple"
              options={{
                className: 'flex flex-col divide-y'
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
