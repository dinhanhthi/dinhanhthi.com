import cn from 'classnames'
import React from 'react'
import { Tooltip } from 'react-tooltip'

type TooltipXProps = {
  className?: string
  id: string
  children: React.ReactNode
  defaultIsOpen?: boolean
}

export default function TooltipX(props: TooltipXProps) {
  return (
    <Tooltip
      anchorSelect={props.id}
      place="bottom"
      className={cn('!z-[9999] !rounded-md !px-2 !py-0.5 !text-xs', props.className)}
      noArrow={true}
      defaultIsOpen={props.defaultIsOpen}
    >
      {props.children}
    </Tooltip>
  )
}
