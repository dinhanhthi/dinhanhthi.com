import { mapColorClass } from '@/src/lib/helpers'
import cn from 'classnames'
import React from 'react'

export default function BlockToggleDiscrete(props: {
  text: React.ReactNode | null
  color?: string
  children?: React.ReactNode
  className?: string
  updateStatus?: 'updated' | 'new'
}) {
  return (
    <div
      className={cn(
        mapColorClass(props.color, true),
        props.className,
        'discrete-block-container relative w-full break-inside-avoid rounded-lg text-[95%] shadow-lg'
      )}
    >
      <div className="absolute left-0">
        <div className="discrete-counter"></div>
      </div>
      {props.text && (
        <div className="discrete-header-container relative border-b border-[#86aecd] px-4 py-2.5 text-[105%] font-medium text-slate-700">
          {props.text}
          {props.updateStatus && (
            <div
              className={cn('absolute top-0 right-0 rounded-bl-md px-2 text-xs', {
                'bg-green-200 text-green-900': props.updateStatus === 'updated',
                'bg-amber-200 text-amber-900': props.updateStatus === 'new'
              })}
            >
              {props.updateStatus}
            </div>
          )}
        </div>
      )}
      <div
        className={cn('discrete-content-container p-4', {
          relative: !props.text
        })}
      >
        {props.children}
        {!props.text && props.updateStatus && (
          <div
            className={cn('absolute top-0 right-0 rounded-bl-md px-2 text-xs', {
              'bg-green-200 text-green-900': props.updateStatus === 'updated',
              'bg-amber-200 text-amber-900': props.updateStatus === 'new'
            })}
          >
            {props.updateStatus}
          </div>
        )}
      </div>
    </div>
  )
}
