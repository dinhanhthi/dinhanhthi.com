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
      className={cn('!text-xs !px-2 !py-0.5 !rounded-md !z-[9999]', props.className)}
      noArrow={true}
      defaultIsOpen={props.defaultIsOpen}
    >
      {props.children}
    </Tooltip>
  )
}
