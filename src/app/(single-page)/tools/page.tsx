import ToolsIcon from '@/public/tools.webp'
import cn from 'classnames'
import { Suspense } from 'react'

import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderPage from '../../components/HeaderPage'
import { bodyPadding, containerWide } from '../../lib/config'
import { getUnofficialTools } from '../../lib/fetcher'
import { getMetadata } from '../../lib/helpers'
import ToolsPage, { SkeletonToolPage } from './ToolsPage'

export const revalidate = 20

const title = 'Tools I use'
const description = 'Apps, tools, websites I find useful.'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function ToolsHomePage() {
  const { tools, categories } = await getUnofficialTools()

  return (
    <div className="flex flex-col bg-white">
      <HeaderPage
        headerType="white"
        title={title}
        subtitle={`I'm always on the lookout for new apps and websites that can help me learn and work more effectively. Here's a list of tools that I've found really useful so far.`}
        headerWidth="wide"
        icon={{ staticImageData: ToolsIcon }}
        iconClassName="h-12 w-12"
        number={tools.length}
      />
      <Container className={cn('basis-auto grow shrink-0', bodyPadding, containerWide)}>
        <Suspense fallback={<SkeletonToolPage />}>
          <ToolsPage tools={tools} categories={categories} />
        </Suspense>
      </Container>
      <Footer footerType="white" />
      <ScrollToTop />
    </div>
  )
}
