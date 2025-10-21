import { Tag } from '@/src/lib/types'
import cn from 'classnames'
import { Suspense } from 'react'

import { defaultBlurDataURL, sectionOuterClass } from '@/src/lib/config'
import { getTopics } from '@/src/lib/fetcher'
import { getMetadata } from '@/src/lib/helpers'
import { LoaderCircle } from 'lucide-react'
import HeaderPage from '../../components/HeaderPage'
import Topic from '../../components/Topic'

export const revalidate = 60

const title = 'List of topics'
const description = 'A list of topics I write about'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function TagsHomePage() {
  const _tags = await getTopics()
  const tags = _tags
    .filter(tag => !tag.hide)
    .map(tag => ({
      ...tag,
      icon: { sourceUrl: tag.iconUrl, width: 30, height: 30, blurDataURL: defaultBlurDataURL }
    }))

  const tagListContainerClass = 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 w-full'

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
      <Suspense fallback={<SkeletonTags className={tagListContainerClass} />}>
        {tags.length === 0 && <div className="my-4 text-xl font-bold">There is no tag yet!</div>}
        {tags.length > 0 && (
          <div className={tagListContainerClass}>
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
    </>
  )
}

function SkeletonTags(props: { className?: string }) {
  return (
    <div className={props.className}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className={cn('h-[62px] w-full animate-pulse', sectionOuterClass)}></div>
      ))}
    </div>
  )
}
