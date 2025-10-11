import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/src/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap ring-offset-white transition-colors focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90',
        destructive:
          'bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
        outline:
          'border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        secondary:
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
        ghost:
          'hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
        link: 'text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-11 rounded-lg px-8',
        icon: 'h-10 w-10 shrink-0 text-gray-600 hover:text-gray-700 [&_svg]:size-4 [&_svg]:transition-transform [&_svg]:active:scale-90',
        iconBig:
          'group h-8 w-8 shrink-0 text-gray-500 hover:text-gray-600 [&_svg]:size-5 [&_svg]:transition-transform [&_svg]:active:scale-90'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left'
  delayDuration?: number
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      tooltip,
      tooltipPosition = 'bottom',
      delayDuration = 200,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const button = (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )

    if (!tooltip) {
      return button
    }

    const tooltipContent =
      typeof tooltip === 'string' ? (
        <TooltipContent side={tooltipPosition}>{tooltip}</TooltipContent>
      ) : (
        <TooltipContent side={tooltipPosition} {...tooltip} />
      )

    return (
      <TooltipProvider delayDuration={delayDuration}>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          {tooltipContent}
        </Tooltip>
      </TooltipProvider>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
