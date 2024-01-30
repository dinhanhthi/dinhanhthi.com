import ToolsIcon from '@/public/tools.webp'
import cn from 'classnames'
import { Suspense } from 'react'

import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderPage from '../../components/HeaderPage'
import { SkeletonSearchBar } from '../../components/SkeletonSearchBar'
import { bodyPadding, containerWide } from '../../lib/config'
import { getUnofficialTools } from '../../lib/fetcher'
import { getMetadata } from '../../lib/helpers'
import ToolsPage, { SkeletonToolItem } from './ToolsPage'

export const revalidate = 20

const title = 'Tools I use'
const description = 'Apps, tools, websites I find useful.'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function ProjectsPage() {
  const { tools, tags } = await getUnofficialTools()

  return (
    <div className="thi-bg-stone flex flex-col">
      <HeaderPage
        headerType="gray"
        title="Tools I use"
        subtitle={`I'm always on the lookout for new apps and websites that can help me learn and work more effectively. Here's a list of tools that I've found really useful so far.`}
        headerWidth="wide"
        icon={{ staticImageData: ToolsIcon }}
        iconClassName="h-12 w-12"
      />
      <Container className={cn('basis-auto grow shrink-0', bodyPadding, containerWide)}>
        <Suspense fallback={<SkeletonToolContainer />}>
          <ToolsPage tools={tools} tags={tags} />
        </Suspense>
      </Container>
      <Footer footerType="gray" />
      <ScrollToTop />
    </div>
  )
}

function SkeletonToolContainer() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        👉{' '}
        <a
          className="m2it-link"
          target="_blank"
          href="https://github.com/stars/dinhanhthi/lists/favorites"
        >
          My favorite repositories
        </a>{' '}
        on Github.
      </div>
      <SkeletonSearchBar placeholder="Search tools..." />
      <div className="flex items-center gap-x-4 gap-y-2 flex-wrap justify-center sm:justify-start">
        <div className="flex gap-x-2 gap-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={cn('h-6 w-20 bg-white rounded-md animate-pulse')}></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonToolItem key={i} />
        ))}
      </div>
    </div>
  )
}
