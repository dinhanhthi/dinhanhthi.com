import FiSearch from '@notion-x/src/icons/FiSearch'
import cn from 'classnames'

type SkeletonSearchBarProps = {
  placeholder?: string
}

export function SkeletonSearchBar(props: SkeletonSearchBarProps) {
  return (
    <div className={cn('flex items-center gap-3 p-4 bg-white rounded-xl')}>
      <div className={cn('grid place-items-center text-slate-500')}>
        <FiSearch className="text-2xl" />
      </div>
      <div className="text-slate-400">{props.placeholder || 'Search...'}</div>
    </div>
  )
}
