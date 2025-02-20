import cn from 'classnames'
import { Tool } from '../../../interface'
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
          'p-1': !!props.title,
          'bg-slate-100': !!props.title
        },
        props.className
      )}
    >
      {props.title && <div className="p-2 text-base font-medium text-sky-800">{props.title}</div>}
      <div className="grid gap-x-2 rounded-xl border border-slate-200 bg-white p-2 sm:grid-cols-2">
        {props.tools.map(tool => {
          return <ToolSimpleItem key={tool.url} tool={tool} />
        })}
      </div>
    </div>
  )
}

export function SkeletonToolPageSection() {
  return (
    <div className="flex flex-col rounded-xl bg-slate-100 p-1">
      <div className="p-2 text-base text-sky-800">
        <div className="h-4 w-32 animate-pulse rounded-md bg-slate-200"></div>
      </div>
      <div className="grid gap-x-2 rounded-xl border border-slate-200 bg-white p-2 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, j) => {
          return <SkeletonToolSimpleItem key={j} />
        })}
      </div>
    </div>
  )
}
