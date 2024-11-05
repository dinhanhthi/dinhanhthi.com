'use client'

import SimpleImage from '@notion-x/src/components/SimpleImage'
import AiOutlineLoading3Quarters from '@notion-x/src/icons/AiOutlineLoading3Quarters'
import { defaultMapImageUrl } from '@notion-x/src/lib/utils'
import { Tool } from '../../../interface'

export default function ToolsPage(props: { tools: Tool[]; categories?: string[] }) {
  const sortedCategories = props.categories?.sort((a, b) => a.localeCompare(b))
  return (
    <div className="flex flex-col gap-8">
      {sortedCategories &&
        sortedCategories.length > 0 &&
        sortedCategories.map(category => (
          <div key={category} className="bg-slate-100 flex flex-col p-1 rounded-xl">
            <div className="p-2 font-medium text-base">{category}</div>
            <div className="bg-white grid gap-x-2 p-2 sm:grid-cols-2 rounded-xl border-slate-200 border">
              {props.tools
                ?.filter(t => t.category === category)
                ?.map(tool => {
                  const convertedIconUrl = defaultMapImageUrl(tool.iconUrl, tool.block)!
                  return (
                    <a
                      href={tool.url}
                      key={tool.url}
                      target="_blank"
                      className="flex flex-row items-center p-4 gap-4 hover:bg-slate-100 rounded-lg text-[0.9rem]"
                    >
                      <SimpleImage
                        src={convertedIconUrl}
                        width={30}
                        height={30}
                        className="rounded-md h-auto z-20"
                        imagePlaceholder={ImagePlaceholder()}
                      />
                      <div className="flex flex-col">
                        <div className="font-normal">{tool.name}</div>
                        <div className="opacity-70">{tool.shortDescription}</div>
                      </div>
                    </a>
                  )
                })}
            </div>
          </div>
        ))}
    </div>
  )
}

const ImagePlaceholder = () => (
  <div className="flex items-center justify-center h-full">
    <div
      style={{ width: 30, height: 30 }}
      className="flex items-center justify-center absolute inset-0 m-auto rounded-full animate-pulse"
    >
      <AiOutlineLoading3Quarters className="text-[25px] text-slate-600 animate-spin" />
    </div>
  </div>
)

export function SkeletonToolItem() {
  return (
    <div className="p-2 bg-white rounded-lg border border-slate-150">
      <div className="flex flex-row h-full">
        <div className="w-[90px] h-full rounded-l-lg relative overflow-hidden shrink-0 border-[0.5px] border-slate-100">
          <div className="relative w-full h-full overflow-hidden">
            <div
              style={{
                position: 'absolute',
                inset: '0px',
                backgroundImage: `
                  linear-gradient(#f0f0f0, #f0f0f0),
                  linear-gradient(transparent, transparent),
                  url()`,
                backgroundBlendMode: 'luminosity, overlay, normal',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center top',
                backgroundSize: '100% 100%',
                filter: 'blur(25px) saturate(1)',
                transform: 'var(1.5) translate3d(0, 0, 0)'
              }}
            ></div>
            <div className="flex items-center justify-center p-8">
              <div className="animate-pulse w-[60px] h-[60px] max-w-[60px] absolute inset-0 m-auto rounded-full bg-slate-200"></div>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 flex flex-col gap-4 p-3 pl-4 animate-pulse">
          <div className="flex gap-1.5 flex-col">
            <div className="font-semibold text-slate-700">
              <div className="w-1/2 h-5 bg-slate-100 rounded-md"></div>
            </div>
            <div className="flex flex-wrap gap-x-1 gap-y-2 text-[0.75rem]">
              <div className="w-8 h-3 bg-slate-100 rounded-md"></div>
              <div className="w-8 h-3 bg-slate-100 rounded-md"></div>
            </div>
          </div>
          <div className="text-[0.83rem] text-slate-700 break-words overflow">
            <div className="w-full h-3 bg-slate-100 rounded-md"></div>
            <div className="w-4/5 h-3 bg-slate-100 rounded-md mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
