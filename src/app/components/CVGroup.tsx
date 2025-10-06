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
    <div className={className ? className : ''}>
      <HeadingAbout className="mb-4">{cvGroup.name}</HeadingAbout>
      <div className={'thi-box-code divide-y divide-slate-200 px-4'}>
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
