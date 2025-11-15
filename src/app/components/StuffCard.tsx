import type { Stuff } from '@/src/lib/types/stuff'
import { cn } from '@/src/lib/utils'
import Image from 'next/image'

interface StuffCardProps {
  stuff: Stuff
  onEdit?: () => void
  isAdmin?: boolean
}

export default function StuffCard({ stuff, onEdit, isAdmin }: StuffCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image */}
      {stuff.image_url && (
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <Image
            src={stuff.image_url}
            alt={stuff.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
          <a
            href={stuff.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-blue-600"
          >
            {stuff.title}
          </a>
        </h3>

        {/* Description */}
        {stuff.description && (
          <p className="mb-3 line-clamp-3 text-sm text-gray-600">{stuff.description}</p>
        )}

        {/* Notes */}
        {stuff.notes && (
          <div className="mb-3 line-clamp-2 rounded bg-yellow-50 p-2 text-xs text-gray-700">
            <span className="font-medium">Note:</span> {stuff.notes}
          </div>
        )}

        {/* Tags */}
        {stuff.tags && stuff.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {stuff.tags.map(tag => (
              <span
                key={tag}
                className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Admin Edit Button */}
        {isAdmin && onEdit && (
          <button
            onClick={onEdit}
            className={cn(
              'mt-3 rounded bg-blue-500 px-3 py-1.5 text-sm text-white',
              'transition-colors hover:bg-blue-600'
            )}
          >
            Edit
          </button>
        )}
      </div>

      {/* External Link Indicator */}
      <div className="absolute top-2 right-2 rounded-full bg-white/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <svg
          className="h-4 w-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>
    </div>
  )
}
