import { getUnofficialTools } from '@/src/lib/fetcher'
import { getMetadata } from '@/src/lib/helpers'
import HeaderPage from '../../components/HeaderPage'
import ToolsPage from './ToolsPage'

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
    <>
      <HeaderPage
        title={title}
        subtitle="I'm always on the lookout for new apps and websites that can help me learn and work more effectively. Here's a list of tools that I've found really useful so far."
        iconPath="/logo_sketches/sketch_tools_nobg.png"
        number={tools.length}
      />
      <ToolsPage tools={tools} categories={categories} />
    </>
  )
}
