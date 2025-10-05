import cn from 'classnames'

import AiOutlineLoading3Quarters from '@/src/app/icons/AiOutlineLoading3Quarters'

export function ImagePlaceholderPostHeader() {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-500',
        'flex flex-col'
      )}
    >
      <AiOutlineLoading3Quarters className="animate-spin text-[60px] text-white" />
    </div>
  )
}
