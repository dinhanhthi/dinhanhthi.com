import BadgeTech from '@notion-x/src/components/BadgeTech'
import cn from 'classnames'

import techs from '../../data/techs'
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
      <div className={'thi-box-code flex flex-wrap gap-2.5 p-3'}>
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
      <div className={cn('rounded-lg shadow-lg bg-slate-200 animate-pulse h-[200px]')}></div>
    </div>
  )
}
