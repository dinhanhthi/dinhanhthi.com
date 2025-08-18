'use client'

import { Fragment } from 'react'
import { Tool } from '../../../interface'
import ToolSimpleSection, { SkeletonToolPageSection } from './ToolSimpleSection'

export default function ToolsPage(props: { tools: Tool[]; categories?: string[] }) {
  const sortedCategories = props.categories?.sort((a, b) => a.localeCompare(b))
  const favoriteTools = props.tools.filter(tool => tool.favorite)
  return (
    <div className="flex flex-col gap-8">
      {props.tools.length > 0 && (
        <ToolSimpleSection
          key={'recently-added'}
          title="Recently added"
          tools={props.tools.slice(0, 6).sort((a, b) => a.name.localeCompare(b.name))}
          className="!bg-green-100"
        />
      )}
      {favoriteTools.length > 0 && (
        <ToolSimpleSection
          key={'favorites'}
          title="Favorites"
          tools={favoriteTools.sort((a, b) => a.name.localeCompare(b.name))}
          className="!bg-orange-100"
        />
      )}
      {sortedCategories &&
        sortedCategories.length > 0 &&
        sortedCategories.map(category => {
          const tools = props.tools.filter(t => t.category === category)
          const sortedTools = tools.sort((a, b) => a.name.localeCompare(b.name))
          return (
            <Fragment key={category}>
              {sortedTools.length > 0 && (
                <ToolSimpleSection key={category} title={category} tools={sortedTools} />
              )}
            </Fragment>
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
