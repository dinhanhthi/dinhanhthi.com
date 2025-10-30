import { Search } from 'lucide-react'

type SkeletonSearchBarProps = {
  placeholder?: string
}

export function SkeletonSearchBar(props: SkeletonSearchBarProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-4">
      <div className="grid place-items-center text-slate-500">
        <Search size={24} />
      </div>
      <div className="text-slate-400">{props.placeholder || 'Search...'}</div>
    </div>
  )
}
