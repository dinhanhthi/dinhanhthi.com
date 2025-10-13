import cn from 'classnames'
import { Block } from 'notion-types'
import * as React from 'react'

import FaGithub from '@/src/app/icons/FaGithub'
import RxDotFilled from '@/src/app/icons/RxDotFilled'
import { formatNotionDateTime } from '@/src/lib/notion/utils'

// External Object Instance
export const EOI: React.FC<{
  block: Block
  inline?: boolean
  className?: string
  updatedBlock?: React.ReactElement
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
              'not-prose border-border-muted hover:border-link flex flex-row items-center gap-3 rounded-md border p-3 hover:cursor-pointer'
            )}
            target="_blank"
            href={original_url}
            rel="noopener noreferrer"
          >
            <FaGithub className="text-4xl" />
            <div className={cn('flex flex-col gap-0')}>
              <div className="text-link group-hover:text-link-hover text-base">{title}</div>
              <div className="text-muted flex flex-row items-center gap-1 text-[0.9em]">
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
          className="not-prose group hover:border-link inline-flex flex-row items-baseline gap-1 px-1 hover:cursor-pointer"
          target="_blank"
          href={original_url}
          rel="noopener noreferrer"
        >
          <FaGithub className="text-[0.9em]" />
          <div className="text-link group-hover:text-link-hover text-[1em] leading-[1.1]">
            {title}
          </div>
        </a>
      )}
    </>
  )
}
