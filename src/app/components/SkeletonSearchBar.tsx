import FiSearch from '@/src/components/icons/FiSearch'

type SkeletonSearchBarProps = {
  placeholder?: string
}

export function SkeletonSearchBar(props: SkeletonSearchBarProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl">
      <div className="grid place-items-center text-slate-500">
        <FiSearch className="text-2xl" />
      </div>
      <div className="text-slate-400">{props.placeholder || 'Search...'}</div>
    </div>
  )
}
