import cn from 'classnames'
import React from 'react'

import { mapColorClass } from '@/src/lib/notion/helpers'
import { blockMargin } from './block'

export default function BlockCallout(props: {
  text: React.ReactNode
  icon: React.ReactNode
  color?: string
  className?: string
  children?: React.ReactNode
  updatedBlock?: React.JSX.Element
}) {
  return (
    <div className={cn(props.className, 'block-callout relative')}>
      {props.updatedBlock}
      <div
        className={cn('flex rounded-md', mapColorClass(props.color) || 'border border-gray-200')}
      >
        {props.icon && <div className="text-2xl pl-4 py-2 text-amber-500">{props.icon}</div>}
        <div className="pl-2 pr-4 w-0 flex-1">
          <div className={blockMargin}>{props.text}</div>
          {!!props.children && <div className="m2it-inside-box">{props.children}</div>}
          <div className={blockMargin}></div>
        </div>
      </div>
    </div>
  )
}
