import BadgeTech from '@/src/app/components/BadgeTech'
import cn from 'classnames'
import Image from 'next/image'

import techs from '../../data/techs'
import { CVItem } from './CVGroup'

type CVSectionProps = {
  cv: CVItem
  className?: string
}

export default function CVSection({ cv, className }: CVSectionProps) {
  return (
    <div className={cn('flex flex-wrap items-center', className)}>
      <div className="hidden w-[200px] flex-col items-center py-4 md:flex">
        {logo(cv)}
        <h4 className="text-text-heading mt-2 text-center text-base font-semibold">
          {cv.url && (
            <a
              className="text-text-heading"
              href={cv.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {cv.where}
            </a>
          )}
          {!cv.url && <span>{cv.where}</span>}
        </h4>
        <div className="mt-1 text-center text-sm opacity-80">{cv.date}</div>
      </div>
      <div className="flex-1 px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="md:hidden">{logo(cv)}</div>
          <div>
            <h3 className="text-text-heading text-lg font-semibold">{cv.title}</h3>
            <h4 className="text-base md:hidden">
              {cv.url && (
                <a className="text-link" href={cv.url}>
                  {cv.where}
                </a>
              )}
              {!cv.url && <span>{cv.where}</span>}
            </h4>
            <div className="mt-1 text-sm opacity-70 md:hidden">{cv.date}</div>
          </div>
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {cv.activity.map((activity: string, index: number) => (
            <div
              key={index}
              className="text-[0.9rem] opacity-95"
              dangerouslySetInnerHTML={{ __html: activity }}
            ></div>
          ))}
        </div>
        {cv.tech && (
          <div className="mt-4 flex flex-wrap gap-2">
            {cv.tech.map((id: string) => {
              const techItem = techs.find(tech => tech.id === id)
              if (!techItem || !techItem.icon) return null
              const newTechItem = {
                ...techItem,
                icon: { staticImageData: techItem.icon as import('next/image').StaticImageData }
              }
              return (
                <BadgeTech key={id} tech={newTechItem} hideText={true} useLink={false}></BadgeTech>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function logo(cv: CVItem) {
  return (
    <div
      className={cn('h-auto w-20', {
        'p-2 dark:rounded-lg dark:bg-white': cv.bgWhite,
        'p-1': !cv.bgWhite
      })}
    >
      <Image src={cv.logo} alt="cv.where" className="h-auto w-full" />
    </div>
  )
}
