import { sectionOuterClass } from '../../lib/config'
import { cn } from '../../lib/utils'
import CVSection from './CVSection'
import HeadingAbout from './HeadingAbout'

export type CVItem = {
  id: string
  where: string
  bgWhite?: boolean
  logo: any
  url?: string
  title: string
  date: string
  activity: string[]
  tech?: string[]
}

export type CVGroupType = {
  id: string
  name: string
  list: CVItem[]
}

type CVGroupProps = {
  cvGroup: CVGroupType
  className?: string
}

export default function CVGroup({ cvGroup, className }: CVGroupProps) {
  return (
    <div className={className}>
      <HeadingAbout className="mb-4">{cvGroup.name}</HeadingAbout>
      <div className={cn('divide-y divide-slate-200 p-4', sectionOuterClass)}>
        {cvGroup.list.map((cvItem: CVItem) => (
          <CVSection key={cvItem.id} cv={cvItem} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonCVGroup(props: CVGroupProps) {
  return (
    <div className={props.className}>
      <HeadingAbout className="mb-4 text-2xl">{props.cvGroup.name}</HeadingAbout>
      <div className="h-[500px] animate-pulse rounded-lg bg-slate-200 shadow-lg"></div>
    </div>
  )
}
