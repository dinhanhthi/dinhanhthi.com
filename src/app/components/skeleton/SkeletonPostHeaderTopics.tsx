import cn from 'classnames'

type SkeletonPostHeaderTopicsProps = {
  className?: string
}

export default function SkeletonPostHeaderTopics(props: SkeletonPostHeaderTopicsProps) {
  return (
    <div className={cn('flex items-center gap-2', props.className)}>
      <div className="h-6 w-20 rounded-2xl bg-slate-200"></div>
      <div className="h-6 w-32 rounded-2xl bg-slate-200"></div>
      <div className="h-6 w-20 rounded-2xl bg-slate-200"></div>
    </div>
  )
}
