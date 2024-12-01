import cn from 'classnames'
import { Tool } from '../../../interface'
import ToolSimpleItem, { SkeletonToolSimpleItem } from './ToolSimpleItem'

export default function ToolSimpleSection(props: { tools: Tool[]; title?: string }) {
  return (
    <div
      className={cn('flex flex-col rounded-xl', {
        'bg-slate-100 p-1': !!props.title
      })}
    >
      {props.title && <div className="p-2 text-base text-sky-800 font-medium">{props.title}</div>}
      <div className="bg-white grid gap-x-2 p-2 sm:grid-cols-2 rounded-xl border-slate-200 border">
        {props.tools.map(tool => {
          return <ToolSimpleItem key={tool.url} tool={tool} />
        })}
      </div>
    </div>
  )
}

export function SkeletonToolPageSection() {
  return (
    <div className="bg-slate-100 flex flex-col p-1 rounded-xl">
      <div className="p-2 text-base text-sky-800">
        <div className="w-32 h-4 bg-slate-200 rounded-md animate-pulse"></div>
      </div>
      <div className="bg-white grid gap-x-2 p-2 sm:grid-cols-2 rounded-xl border-slate-200 border">
        {Array.from({ length: 4 }).map((_, j) => {
          return <SkeletonToolSimpleItem key={j} />
        })}
      </div>
    </div>
  )
}
