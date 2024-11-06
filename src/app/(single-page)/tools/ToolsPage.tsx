'use client'

import { Tool } from '../../../interface'
import ToolSimpleSection, { SkeletonToolPageSection } from './ToolSimpleSection'

export default function ToolsPage(props: { tools: Tool[]; categories?: string[] }) {
  const sortedCategories = props.categories?.sort((a, b) => a.localeCompare(b))
  return (
    <div className="flex flex-col gap-8">
      {sortedCategories &&
        sortedCategories.length > 0 &&
        sortedCategories.map(category => {
          const tools = props.tools.filter(t => t.category === category)
          const sortedTools = tools.sort((a, b) => a.name.localeCompare(b.name))
          return (
            <>
              {sortedTools.length > 0 && (
                <ToolSimpleSection key={category} title={category} tools={sortedTools} />
              )}
            </>
          )
        })}
    </div>
  )
}

export function SkeletonToolPage() {
  return (
    <div className="flex flex-col gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonToolPageSection key={i} />
      ))}
    </div>
  )
}
