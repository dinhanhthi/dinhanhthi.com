import BadgeTech from '@notion-x/src/components/BadgeTech'
import { defaultMapImageUrl } from '@notion-x/src/lib/utils'
import cn from 'classnames'

import SimpleImage from '@notion-x/src/components/SimpleImage'
import AiOutlineLoading3Quarters from '@notion-x/src/icons/AiOutlineLoading3Quarters'
import { Block } from 'notion-types'
import techs from '../../data/techs'

export type ProjectType = 'ds' | 'web' | 'other'

export type Project = {
  id: string
  type: ProjectType[]
  title: string
  lastModified: string
  description: string
  icon?: string
  source?: string
  url?: string
  tech?: string[]
  techText?: string[]
  choice?: boolean
  block?: Block // used to fetch icons
}

type ProjectItemProps = {
  project: Project
  className?: string
  grayScale?: boolean
}

export default function ProjectItem({ project, className, grayScale }: ProjectItemProps) {
  const ImagePlaceholder = () => {
    return (
      <div
        className={cn(
          'bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center',
          'flex flex-col h-[30px] w-[30px] rounded-full'
        )}
      >
        <AiOutlineLoading3Quarters className="text-[30px] text-white animate-spin" />
      </div>
    )
  }
  const convertedIconUrl = defaultMapImageUrl(project.icon!, project.block!)!
  return (
    <a
      className={cn(
        'relative group thi-box-code pl-0.5',
        className,
        'transition duration-200 ease-in-out hover:-translate-y-0.5 hover:-translate-x-0.5'
      )}
      href={project.source ? project.source : project.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="absolute left-0 top-0 h-full w-full z-10 flex flex-col rounded-lg overflow-hidden">
        {project.type.includes('ds') && <div className="flex-1 w-full bg-sky-600"></div>}
        {project.type.includes('web') && <div className="flex-1 w-full bg-amber-500"></div>}
        {project.type.includes('other') && <div className="flex-1 w-full bg-emerald-600"></div>}
      </div>
      <div className="sticky h-full flex flex-col p-4 z-20 bg-white rounded-lg">
        <div className="text-slate-700 font-medium flex items-center gap-2">
          {/* {project.icon && <span className="mr-2">{project.icon}</span>} */}
          {project.icon && (
            <SimpleImage
              emoji={!project.icon?.includes('http') ? project.icon : undefined}
              src={convertedIconUrl}
              alt={project.title}
              width={25}
              height={25}
              className="text-[25px]"
              imagePlaceholder={ImagePlaceholder()}
            />
          )}
          {project.title}
          {!project.source && !project.url && <span>{project.title}</span>}
        </div>
        <div className="opacity-85 mt-2 flex-1 text-sm">{project.description}</div>
        {(project.tech || project.techText) && (
          <div
            className={cn('mt-4 flex flex-wrap gap-2', {
              'grayscale group-hover:grayscale-0': grayScale
            })}
          >
            {project.tech &&
              project.tech.map((id: string) => {
                const techItem = techs.find(tech => tech.id === id)
                if (!techItem) return null
                const newTechItem = { ...techItem, icon: { staticImageData: techItem.icon } }
                return (
                  <BadgeTech
                    key={id}
                    tech={newTechItem}
                    hideText={true}
                    useLink={false}
                  ></BadgeTech>
                )
              })}
            {project.techText &&
              project.techText.map((item: string, index: number) => (
                <span key={index} className={'thi-badge-code px-2 font-mono text-[0.8rem]'}>
                  <span className="block h-full">{item}</span>
                </span>
              ))}
          </div>
        )}
      </div>
    </a>
  )
}

type SkeletonProjectItemProps = {
  className?: string
}

export function SkeletonProjectItem(props: SkeletonProjectItemProps) {
  return (
    <div className={props.className}>
      <div className={cn('rounded-lg shadow-lg bg-slate-200 animate-pulse h-[200px]')}></div>
    </div>
  )
}
