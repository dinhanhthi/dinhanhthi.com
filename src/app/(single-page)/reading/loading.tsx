import { HeaderPageSkeleton } from '../../components/HeaderPage'
import { SkeletonReadingContainer } from './SkeletonReadingContainer'

export default function ReadingPageLoading() {
  return (
    <>
      <HeaderPageSkeleton />
      <SkeletonReadingContainer />
    </>
  )
}
