'use client'

import SimpleImage from '@/src/app/components/SimpleImage'
import AiOutlineLoading3Quarters from '@/src/app/icons/AiOutlineLoading3Quarters'
import { defaultMapImageUrl } from '@/src/lib/notion/utils'
import { Tool } from '@/src/lib/types'
import { useEffect, useState } from 'react'

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
      className="flex flex-row items-center gap-4 rounded-lg p-4 hover:bg-slate-100"
    >
      <SimpleImage
        src={convertedIconUrl}
        width={30}
        height={30}
        className="z-20 h-auto rounded-md"
        imagePlaceholder={ImagePlaceholder()}
      />
      <div className="flex flex-col gap-1">
        <div className="font-normal">
          <span className="text-[0.95rem] font-medium text-slate-800">{tool.name}</span>
          {/* NEW */}
          {isNew && (
            <span className="mr-1 ml-2 inline rounded-md bg-amber-200 px-2 py-0 align-middle text-[0.75rem] whitespace-nowrap text-amber-900">
              new
            </span>
          )}
        </div>
        <div className="text-[0.9rem] text-slate-500">{tool.shortDescription}</div>
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
      <AiOutlineLoading3Quarters className="animate-spin text-[25px] text-slate-600" />
    </div>
  </div>
)

export const SkeletonToolSimpleItem = () => (
  <div className="flex flex-row items-center gap-4 rounded-lg p-4 text-[0.9rem]">
    <div className="h-8 w-8 animate-pulse rounded-md bg-slate-200"></div>
    <div className="flex flex-col gap-2">
      <div className="h-3 w-40 animate-pulse rounded-md bg-slate-200"></div>
      <div className="h-3 w-64 animate-pulse rounded-md bg-slate-200"></div>
    </div>
  </div>
)
