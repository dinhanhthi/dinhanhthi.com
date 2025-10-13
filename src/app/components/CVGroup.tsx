import { sectionOuterClass } from '../../lib/config'
import { cn } from '../../lib/utils'
import CVSection from './CVSection'
import HeadingPage from './HeadingPage'

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
      <HeadingPage title={cvGroup.name} className="mb-4" />
      <div className={cn('divide-border-muted divide-y p-4', sectionOuterClass)}>
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
      <HeadingPage title={props.cvGroup.name} className="mb-4 text-2xl" />
      <div className="bg-skeleton-bg h-[500px] animate-pulse rounded-lg shadow-lg"></div>
    </div>
  )
}
