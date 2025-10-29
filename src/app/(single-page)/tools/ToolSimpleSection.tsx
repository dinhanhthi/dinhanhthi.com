import { Tool } from '@/src/lib/types'
import cn from 'classnames'
import { sectionOuterClass } from '../../../lib/config'
import ToolSimpleItem, { SkeletonToolSimpleItem } from './ToolSimpleItem'

export default function ToolSimpleSection(props: {
  tools: Tool[]
  title?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-xl',
        {
          'border-border-muted border bg-slate-200 p-1 dark:bg-slate-700/50': !!props.title
        },
        props.className
      )}
    >
      {props.title && (
        <div className="p-2 text-base font-medium text-sky-800 dark:text-sky-100">
          {props.title}
        </div>
      )}
      <div className={cn('grid gap-x-2 p-1.5 sm:grid-cols-2', sectionOuterClass)}>
        {props.tools.map(tool => {
          return <ToolSimpleItem key={tool.url} tool={tool} />
        })}
      </div>
    </div>
  )
}

export function SkeletonToolPageSection({
  numTools,
  hasTitle = true,
  className
}: {
  numTools?: number
  hasTitle?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-border-muted flex flex-col rounded-xl border bg-slate-200 p-1 dark:bg-slate-700',
        className
      )}
    >
      {hasTitle && (
        <div className="animate-pulse p-2">
          <div className="h-4 w-32 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
        </div>
      )}
      <div className="border-border-muted bg-bg grid gap-x-2 rounded-xl border p-1.5 sm:grid-cols-2">
        {Array.from({ length: numTools || 4 }).map((_, j) => {
          return <SkeletonToolSimpleItem key={j} />
        })}
      </div>
    </div>
  )
}
