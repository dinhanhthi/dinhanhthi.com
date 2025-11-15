import type { Stuff } from '@/src/lib/types/stuff'
import StuffCard from './StuffCard'

interface StuffSectionHomeProps {
  stuff: Stuff[]
}

export default function StuffSectionHome({ stuff }: StuffSectionHomeProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {stuff.map(item => (
        <StuffCard key={item.id} stuff={item} />
      ))}
    </div>
  )
}

export function SkeletonStuffSectionHome({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
        >
          {/* Image skeleton */}
          <div className="aspect-video w-full animate-pulse bg-gray-200" />

          {/* Content skeleton */}
          <div className="space-y-3 p-4">
            {/* Title */}
            <div className="h-6 animate-pulse rounded bg-gray-200" />
            {/* Description lines */}
            <div className="space-y-2">
              <div className="h-4 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
            </div>
            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
              <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
