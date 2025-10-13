import { HeaderPageSkeleton } from '../../components/HeaderPage'
import { SkeletonToolPage } from './ToolsPage'

export default function ToolsPageLoading() {
  return (
    <>
      <HeaderPageSkeleton />
      <SkeletonToolPage />
    </>
  )
}
