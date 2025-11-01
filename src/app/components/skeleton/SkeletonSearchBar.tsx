import { Search } from 'lucide-react'

type SkeletonSearchBarProps = {
  placeholder?: string
}

export function SkeletonSearchBar(props: SkeletonSearchBarProps) {
  return (
    <div className="bg-bg flex items-center gap-3 rounded-xl p-4">
      <div className="text-muted grid place-items-center">
        <Search size={24} />
      </div>
      <div className="text-text-color">{props.placeholder || 'Search...'}</div>
    </div>
  )
}
