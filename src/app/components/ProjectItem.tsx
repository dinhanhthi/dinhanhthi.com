import BadgeTech from '@/src/app/components/BadgeTech'
import { defaultMapImageUrl } from '@/src/lib/notion/utils'
import cn from 'classnames'

import SimpleImage from '@/src/app/components/SimpleImage'
import AiOutlineLoading3Quarters from '@/src/app/icons/AiOutlineLoading3Quarters'
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
      <div className="flex h-[30px] w-[30px] flex-col items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-indigo-500">
        <AiOutlineLoading3Quarters className="animate-spin text-[30px] text-white" />
      </div>
    )
  }
  const convertedIconUrl = defaultMapImageUrl(project.icon!, project.block!)!
  return (
    <a
      className={cn(
        'group thi-box-code relative pl-0.5',
        className,
        'transition duration-200 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5'
      )}
      href={project.source ? project.source : project.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col overflow-hidden rounded-lg">
        {project.type.includes('ds') && <div className="w-full flex-1 bg-sky-600"></div>}
        {project.type.includes('web') && <div className="w-full flex-1 bg-amber-500"></div>}
        {project.type.includes('other') && <div className="w-full flex-1 bg-emerald-600"></div>}
      </div>
      <div className="sticky z-20 flex h-full flex-col rounded-lg bg-white p-4">
        <div className="flex items-center gap-2 font-medium text-slate-700">
          {project.icon && (
            <SimpleImage
              emoji={!project.icon?.includes('http') ? project.icon : undefined}
              src={project.icon?.includes('http') ? convertedIconUrl : undefined}
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
        <div className="mt-2 flex-1 text-sm opacity-85">{project.description}</div>
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
      <div className="h-[200px] animate-pulse rounded-lg bg-slate-200 shadow-lg"></div>
    </div>
  )
}
