'use client'

import { defaultMapImageUrl } from '@/src/lib/notion/utils'
import { Tool } from '@/src/lib/types'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../../lib/utils'
import SimpleImage from '../../components/SimpleImage'

type ToolSimpleItemProps = {
  tool: Tool
  className?: string
}

export default function ToolSimpleItem(props: ToolSimpleItemProps) {
  const { tool } = props

  const [isNew, setIsNew] = useState(false)
  useEffect(() => {
    const now = new Date()
    const markDate = new Date(tool.date)
    const diff = now.getTime() - markDate.getTime()
    const diffInDays = diff / (1000 * 3600 * 24)

    if (diffInDays <= 7) {
      setIsNew(true)
    }
  }, [tool.date])

  const convertedIconUrl = defaultMapImageUrl(tool.iconUrl, tool.block)!
  return (
    <a
      href={tool.url}
      key={tool.url}
      target="_blank"
      className="hover:bg-bg-hover flex flex-row items-center gap-4 rounded-lg p-4"
    >
      <div className="flex shrink-0 items-center justify-center rounded-lg bg-white p-0.5 dark:bg-slate-100">
        <SimpleImage
          src={convertedIconUrl}
          width={30}
          height={30}
          className="z-20 h-auto rounded-md"
          imagePlaceholder={ImagePlaceholder()}
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="font-normal">
          <span className="text-text-heading text-[0.95rem] font-medium">{tool.name}</span>
          {/* NEW */}
          {isNew && (
            <span className="mr-1 ml-2 inline rounded-md bg-amber-200 px-2 py-0 align-middle text-[0.75rem] whitespace-nowrap text-amber-900">
              new
            </span>
          )}
        </div>
        <div className="text-muted text-[0.9rem]">{tool.shortDescription}</div>
      </div>
    </a>
  )
}

const ImagePlaceholder = () => (
  <div className="flex h-full items-center justify-center">
    <div
      style={{ width: 30, height: 30 }}
      className="m-auto flex animate-pulse items-center justify-center rounded-full"
    >
      <LoaderCircle size={25} className="text-muted animate-spin" />
    </div>
  </div>
)

export function SkeletonToolSimpleItem({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex animate-pulse flex-row items-center gap-4 rounded-lg p-4 text-[0.9rem]',
        className
      )}
    >
      <div className="bg-skeleton-bg h-8 w-8 animate-pulse rounded-md"></div>
      <div className="flex flex-col gap-2">
        <div className="bg-skeleton-bg h-3 w-40 animate-pulse rounded-full"></div>
        <div className="bg-skeleton-bg h-3 w-64 animate-pulse rounded-full"></div>
      </div>
    </div>
  )
}
