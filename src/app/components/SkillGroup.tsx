import BadgeTech from '@/src/app/components/BadgeTech'

import techs from '../../data/techs'
import { sectionOuterClass } from '../../lib/config'
import { cn } from '../../lib/utils'
import HeadingAbout from './HeadingAbout'

export type SkillGroupType = {
  id: string
  name: string
  list: string[]
}

type SkillGroupProps = {
  skillGroup: SkillGroupType
  className?: string
}

export default function SkillGroup({ skillGroup, className }: SkillGroupProps) {
  return (
    <div className={className}>
      <HeadingAbout className="text-xl">{skillGroup.name}</HeadingAbout>
      <div className={cn('flex flex-wrap gap-2.5 p-3', sectionOuterClass)}>
        {skillGroup.list.map((id: string) => {
          const techItem = techs.find(tech => tech.id === id)
          if (!techItem) return null
          const newTechItem = { ...techItem, icon: { staticImageData: techItem.icon } }
          return (
            <BadgeTech key={id} tech={newTechItem} useLink={false} hideTooltip={true}></BadgeTech>
          )
        })}
      </div>
    </div>
  )
}

export function SkeletonSkillGroup(props: SkillGroupProps) {
  return (
    <div className={props.className}>
      <HeadingAbout className="text-xl">{props.skillGroup.name}</HeadingAbout>
      <div className="h-[200px] animate-pulse rounded-lg bg-slate-200 shadow-lg"></div>
    </div>
  )
}
