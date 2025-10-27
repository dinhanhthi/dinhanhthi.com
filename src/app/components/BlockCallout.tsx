import cn from 'classnames'
import React from 'react'

import { mapColorClass } from '@/src/lib/helpers'
import { blockMargin } from './block'

export default function BlockCallout(props: {
  text: React.ReactNode
  icon: React.ReactNode
  color?: string
  className?: string
  children?: React.ReactNode
  updatedBlock?: React.ReactElement
}) {
  return (
    <div className={cn(props.className, 'block-callout relative')}>
      {props.updatedBlock}
      <div
        className={cn(
          'flex rounded-md',
          mapColorClass(props.color) || 'border-border-muted border'
        )}
      >
        {props.icon && <div className="text-yellow-text py-2 pl-4 text-2xl">{props.icon}</div>}
        <div className="w-0 flex-1 pr-4 pl-2">
          <div className={blockMargin}>{props.text}</div>
          {!!props.children && <div className="[&>*]:!my-3">{props.children}</div>}
          <div className={blockMargin}></div>
        </div>
      </div>
    </div>
  )
}
