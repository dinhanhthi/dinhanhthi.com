import Container from '../../components/Container'
import { HeaderPageSkeleton } from '../../components/HeaderPage'
import { SkeletonTopic } from '../../components/Topic'
import { tagListContainerClass } from './page'

export default function TagsLoading() {
  return <SkeletonTagsLoading />
}

export const SkeletonTagsLoading = () => {
  return (
    <>
      <HeaderPageSkeleton />
      <Container>
        <div className={tagListContainerClass}>
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonTopic key={i} type="detailed" />
          ))}
        </div>
      </Container>
    </>
  )
}
