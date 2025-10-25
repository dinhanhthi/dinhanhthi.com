import { cn } from '../../../lib/utils'
import Container from '../../components/Container'
import { HeaderPageSkeleton } from '../../components/HeaderPage'
import { SkeletonToolSimpleItem } from './ToolSimpleItem'

export default function ToolsPageLoading() {
  return <SkeletonToolsPageLoading />
}

export const SkeletonToolsPageLoading = () => {
  return (
    <>
      <HeaderPageSkeleton />
      <Container className="flex flex-col gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonToolPageSection key={i} />
        ))}
      </Container>
    </>
  )
}

export function SkeletonToolPageSection({
  numTools,
  hasTitle = true,
  className
}: {
  numTools?: number
  hasTitle?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-border-muted flex flex-col rounded-xl border bg-slate-200 p-1 dark:bg-slate-700',
        className
      )}
    >
      {hasTitle && (
        <div className="animate-pulse p-2">
          <div className="h-4 w-32 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
        </div>
      )}
      <div className="border-border-muted bg-bg grid gap-x-2 rounded-xl border p-1.5 sm:grid-cols-2">
        {Array.from({ length: numTools || 4 }).map((_, j) => {
          return <SkeletonToolSimpleItem key={j} />
        })}
      </div>
    </div>
  )
}
