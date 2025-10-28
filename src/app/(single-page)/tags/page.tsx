import { Tag } from '@/src/lib/types'
import cn from 'classnames'

import { defaultBlurDataURL } from '@/src/lib/config'
import { getTopics } from '@/src/lib/fetcher'
import { getMetadata } from '@/src/lib/helpers'
import { LoaderCircle } from 'lucide-react'
import { Suspense } from 'react'
import Container from '../../components/Container'
import HeaderPage from '../../components/HeaderPage'
import Topic, { SkeletonTopic } from '../../components/Topic'

export const dynamic = 'force-dynamic'
export const revalidate = 60

const title = 'List of topics'
const description = 'A list of topics I write about'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function TagsHomePage() {
  const _tags = await getTopics({ whoIsCalling: '(single-page)/tags/page.tsx/TagsHomePage' })
  const tags = _tags
    .filter(tag => !tag.hide)
    .map(tag => ({
      ...tag,
      icon: { sourceUrl: tag.iconUrl, width: 30, height: 30, blurDataURL: defaultBlurDataURL }
    }))

  const ImagePlaceholder = () => {
    return (
      <div
        className={cn(
          'flex h-[30px] w-[30px] flex-col items-center justify-center rounded-full bg-gray-400'
        )}
      >
        <LoaderCircle size={30} className="animate-spin text-white" />
      </div>
    )
  }

  return (
    <>
      <HeaderPage
        title="List of topics"
        subtitle={`A list of topics I write about. They are mainly about Web Development,
          Data Science and Computer Science.`}
        iconPath="/logo_sketches/sketch_topics_nobg.png"
        number={tags.length}
      />
      <Container>
        <Suspense fallback={<SkeletonTagsPageContent />}>
          {tags.length === 0 && <div className="my-4 text-xl font-bold">There is no tag yet!</div>}
          {tags.length > 0 && (
            <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {tags.map((tag: Tag) => (
                <Topic
                  key={tag.id}
                  type="detailed"
                  tag={tag}
                  imagePlaceholder={<ImagePlaceholder />}
                />
              ))}
            </div>
          )}
        </Suspense>
      </Container>
    </>
  )
}

const SkeletonTagsPageContent = () => {
  return (
    <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <SkeletonTopic key={i} type="detailed" />
      ))}
    </div>
  )
}
