import TopicIcon from '@/public/topics.svg'
import SimpleImage from '@notion-x/src/components/SimpleImage'
import AiOutlineLoading3Quarters from '@notion-x/src/icons/AiOutlineLoading3Quarters'
import { Tag } from '@notion-x/src/interface'
import cn from 'classnames'
import Link from 'next/link'
import { Suspense } from 'react'

import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderPage from '../../components/HeaderPage'
import { bodyPadding, containerWide, defaultBlurDataURL } from '../../lib/config'
import { getTopics } from '../../lib/fetcher'
import { getMetadata } from '../../lib/helpers'

export const revalidate = 20

export const metadata = getMetadata({
  title: 'List of topics',
  description: 'A list of topics I write about'
})

export default async function TagsPage() {
  const _tags = await getTopics()
  const tags = _tags.map(tag => ({
    ...tag,
    icon: { sourceUrl: tag.iconUrl, width: 30, height: 30, blurDataURL: defaultBlurDataURL }
  }))

  const tagListContainerClass =
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'

  const ImagePlaceholder = () => {
    return (
      <div
        className={cn(
          'bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center',
          'flex flex-col h-[30px] w-[30px] rounded-full'
        )}
      >
        <AiOutlineLoading3Quarters className="text-[30px] text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="thi-bg-stone flex flex-col">
      <HeaderPage
        headerType="gray"
        headerWidth="wide"
        title="List of topics"
        subtitle={`A list of topics I write about. They are mainly about Web Development,
          Data Science and Computer Science.`}
        icon={{ staticImageData: TopicIcon }}
        iconClassName="h-12 w-12"
      />
      <Container className={cn('basis-auto grow shrink-0', bodyPadding, containerWide)}>
        <Suspense fallback={<SkeletonTags className={tagListContainerClass} />}>
          {tags.length === 0 && <div className="my-4 text-xl font-bold">There is no tag yet!</div>}
          {tags.length > 0 && (
            <div className={tagListContainerClass}>
              {tags.map((tag: Tag) => (
                <Link
                  href={tag.uri!}
                  key={tag.id}
                  className={cn(
                    'thi-box-code flex items-center gap-2 p-4',
                    'transition duration-200 ease-in-out hover:-translate-y-0.5',
                    { 'tooltip-auto': tag.description }
                  )}
                  data-title={tag.description}
                >
                  {tag.icon && (
                    <div>
                      <SimpleImage
                        src={tag.icon.sourceUrl!}
                        alt={tag.name}
                        width={30}
                        height={30}
                        imagePlaceholder={ImagePlaceholder()}
                      />
                    </div>
                  )}
                  <div>{tag.name}</div>
                </Link>
              ))}
            </div>
          )}
        </Suspense>
      </Container>
      <Footer footerType="gray" />
    </div>
  )
}

function SkeletonTags(props: { className?: string }) {
  return (
    <div className={props.className}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="thi-box-code w-full h-[62px] animate-pulse bg-white"></div>
      ))}
    </div>
  )
}
