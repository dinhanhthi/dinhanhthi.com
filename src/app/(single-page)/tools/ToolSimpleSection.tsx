import { Tool } from '@/src/lib/types'
import cn from 'classnames'
import ToolSimpleItem from './ToolSimpleItem'

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
          'border-border-muted border bg-slate-200 p-1 dark:bg-slate-700': !!props.title
        },
        props.className
      )}
    >
      {props.title && (
        <div className="p-2 text-base font-medium text-sky-800 dark:text-sky-100">
          {props.title}
        </div>
      )}
      <div className="border-border-muted bg-bg grid gap-x-2 rounded-xl border p-1.5 sm:grid-cols-2">
        {props.tools.map(tool => {
          return <ToolSimpleItem key={tool.url} tool={tool} />
        })}
      </div>
    </div>
  )
}
