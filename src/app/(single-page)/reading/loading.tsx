import Container from '../../components/Container'
import { HeaderPageSkeleton } from '../../components/HeaderPage'
import { SkeletonReadingPage } from './ReadingPage'

export default function ReadingPageLoading() {
  return <SkeletonReadingPageLoading />
}

export const SkeletonReadingPageLoading = () => {
  return (
    <>
      <HeaderPageSkeleton />
      <Container>
        <SkeletonReadingPage />
      </Container>
    </>
  )
}
