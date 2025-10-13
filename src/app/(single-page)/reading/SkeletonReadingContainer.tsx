import { SkeletonBookItem } from './BookItem'

export function SkeletonReadingContainer() {
  return (
    <div className="flex animate-pulse flex-col gap-6">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
        <div className="flex gap-x-2 gap-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-skeleton-bg h-6 w-20 rounded-full"></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBookItem key={i} />
        ))}
      </div>
    </div>
  )
}
