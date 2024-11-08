'use client'

import SimpleImage from '@notion-x/src/components/SimpleImage'
import AiOutlineLoading3Quarters from '@notion-x/src/icons/AiOutlineLoading3Quarters'
import { defaultMapImageUrl } from '@notion-x/src/lib/utils'
import { useEffect, useState } from 'react'
import { Tool } from '../../../interface'

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
      className="flex flex-row items-center p-4 gap-4 hover:bg-slate-100 rounded-lg"
    >
      <SimpleImage
        src={convertedIconUrl}
        width={30}
        height={30}
        className="rounded-md h-auto z-20"
        imagePlaceholder={ImagePlaceholder()}
      />
      <div className="flex flex-col gap-1">
        <div className="font-normal">
          {tool.name}
          {/* NEW */}
          {isNew && (
            <span className="align-middle ml-2 inline bg-amber-200 text-amber-900 px-2 py-0 text-[0.75rem] rounded-md whitespace-nowrap mr-1">
              new
            </span>
          )}
        </div>
        <div className="opacity-70 text-[0.9rem]">{tool.shortDescription}</div>
      </div>
    </a>
  )
}

const ImagePlaceholder = () => (
  <div className="flex items-center justify-center h-full">
    <div
      style={{ width: 30, height: 30 }}
      className="flex items-center justify-center m-auto rounded-full animate-pulse"
    >
      <AiOutlineLoading3Quarters className="text-[25px] text-slate-600 animate-spin" />
    </div>
  </div>
)

export const SkeletonToolSimpleItem = () => (
  <div className="flex flex-row items-center p-4 gap-4 rounded-lg text-[0.9rem]">
    <div className="w-8 h-8 bg-slate-200 rounded-md animate-pulse"></div>
    <div className="flex flex-col gap-2">
      <div className="w-40 h-3 bg-slate-200 rounded-md animate-pulse"></div>
      <div className="w-64 h-3 bg-slate-200 rounded-md animate-pulse"></div>
    </div>
  </div>
)
