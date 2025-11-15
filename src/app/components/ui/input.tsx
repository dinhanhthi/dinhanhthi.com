import * as React from 'react'

import { cn } from '@/src/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'bg-input-bg border-border-muted placeholder:text-muted-foreground flex h-10 w-full rounded-md px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:ring-offset-neutral-950 dark:file:text-neutral-50 focus-visible:ring-1 focus-visible:ring-border-muted',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
