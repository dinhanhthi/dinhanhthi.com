import Container from '../../components/Container'
import { HeaderPageSkeleton } from '../../components/HeaderPage'
import { SkeletonTopic } from '../../components/Topic'

export default function TagsLoading() {
  return <SkeletonTagsLoading />
}

export const SkeletonTagsLoading = () => {
  return (
    <>
      <HeaderPageSkeleton />
      <Container>
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonTopic key={i} type="detailed" />
          ))}
        </div>
      </Container>
    </>
  )
}
