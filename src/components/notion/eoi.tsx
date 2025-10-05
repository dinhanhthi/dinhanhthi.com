import cn from 'classnames'
import { Block } from 'notion-types'
import * as React from 'react'

import FaGithub from '@/src/components/icons/FaGithub'
import RxDotFilled from '@/src/components/icons/RxDotFilled'
import { formatNotionDateTime } from '@/src/lib/notion/utils'

// External Object Instance
export const EOI: React.FC<{
  block: Block
  inline?: boolean
  className?: string
  updatedBlock?: React.JSX.Element
}> = ({ block, inline, className, updatedBlock }) => {
  const { original_url, attributes, domain } = block?.format || {}
  if (!original_url || !attributes) {
    return null
  }

  const title = attributes.find((attr: { id: string }) => attr.id === 'title')?.values[0]
  let owner = attributes.find((attr: { id: string }) => attr.id === 'owner')?.values[0]
  const lastUpdatedAt = attributes.find((attr: { id: string }) => attr.id === 'updated_at')
    ?.values[0]
  const lastUpdated = lastUpdatedAt ? formatNotionDateTime(lastUpdatedAt) : null

  switch (domain) {
    case 'github.com':
      if (owner) {
        const parts = owner.split('/')
        owner = parts[parts.length - 1]
      }
      break

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `Unsupported external_object_instance domain "${domain}"`,
          JSON.stringify(block, null, 2)
        )
      }

      return null
  }

  return (
    <>
      {!inline && (
        <div className="relative">
          {!!updatedBlock && updatedBlock}
          <a
            className={cn(
              className,
              'not-prose p-3 border border-slate-200 rounded-md hover:cursor-pointer hover:border-sky-300 hover:shadow-sm flex gap-3 flex-row items-center'
            )}
            target="_blank"
            href={original_url}
            rel="noopener noreferrer"
          >
            <FaGithub className="text-4xl" />
            <div className={cn('flex gap-0 flex-col')}>
              <div className="text-base m2it-link group-hover:m2it-link-hover">{title}</div>
              <div className="flex flex-row gap-1 items-center text-gray-500 text-[0.9em]">
                <div>{owner}</div>
                <RxDotFilled />
                <div>{lastUpdated}</div>
              </div>
            </div>
          </a>
        </div>
      )}
      {inline && (
        <a
          className="not-prose px-1 hover:cursor-pointer hover:border-sky-300 hover:shadow-sm inline-flex gap-1 flex-row items-baseline group"
          target="_blank"
          href={original_url}
          rel="noopener noreferrer"
        >
          <FaGithub className="text-[0.9em]" />
          <div className="text-[1em] m2it-link group-hover:m2it-link-hover border-b border-slate-200 leading-[1.1]">
            {title}
          </div>
        </a>
      )}
    </>
  )
}
