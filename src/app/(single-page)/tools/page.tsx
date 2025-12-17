import { getUnofficialTools } from '@/src/lib/fetcher'
import { getMetadata } from '@/src/lib/helpers'
import { Fragment, Suspense } from 'react'
import Container from '../../components/Container'
import HeaderPage from '../../components/HeaderPage'
import ToolSimpleSection, { SkeletonToolPageSection } from './ToolSimpleSection'

export const revalidate = 60

const title = 'Tools I use'
const description = 'Apps, tools, websites I find useful.'

export const metadata = getMetadata({
  title,
  description,
  images: [`/api/og?title=${encodeURI(title)}&description=${encodeURI(description)}`]
})

export default async function ToolsHomePage() {
  const { tools, categories } = await getUnofficialTools({
    whoIsCalling: '(single-page)/tools/page.tsx/ToolsHomePage',
    uri: 'https://dinhanhthi.com/tools/'
  })
  const sortedCategories = categories?.sort((a, b) => a.localeCompare(b))
  const favoriteTools = tools.filter(tool => tool.favorite)

  return (
    <>
      <HeaderPage
        title={title}
        subtitle="I'm always on the lookout for new apps and websites that can help me learn and work more effectively. Here's a list of tools that I've found really useful so far."
        iconPath="/logo_sketches/sketch_tools_nobg.png"
        number={tools.length}
      />
      <Container className="flex flex-col gap-8">
        <Suspense fallback={<SkeletonToolsPageContent />}>
          {tools.length > 0 && (
            <ToolSimpleSection
              key={'recently-added'}
              title="Recently added"
              tools={tools.slice(0, 6)} // We don't sort alphabetically here
              className="!bg-[#e7ffee] dark:!bg-[#0b2c40c4]/60"
            />
          )}
          {favoriteTools.length > 0 && (
            <ToolSimpleSection
              key={'favorites'}
              title="Favorites"
              tools={favoriteTools.sort((a, b) => a.name.localeCompare(b.name))}
              className="!bg-orange-100 dark:!bg-[#80653c6b]/60"
            />
          )}
          {sortedCategories &&
            sortedCategories.length > 0 &&
            sortedCategories.map(category => {
              const _tools = tools.filter(t => t.category === category)
              const sortedTools = _tools.sort((a, b) => a.name.localeCompare(b.name))
              return (
                <Fragment key={category}>
                  {sortedTools.length > 0 && (
                    <ToolSimpleSection key={category} title={category} tools={sortedTools} />
                  )}
                </Fragment>
              )
            })}
        </Suspense>
      </Container>
    </>
  )
}

const SkeletonToolsPageContent = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonToolPageSection key={i} />
      ))}
    </>
  )
}
