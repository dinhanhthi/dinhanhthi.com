import cv from '../../../data/cv'
import Container from '../../components/Container'
import { CVGroupType, SkeletonCVGroup } from '../../components/CVGroup'
import { SkeletonHeaderThiCard } from '../../components/HeaderThiCard'

export default function AboutPageLoading() {
  return <SkeletonAboutPageLoading />
}

export const SkeletonAboutPageLoading = () => {
  return (
    <>
      <SkeletonHeaderThiCard />
      <Container className="flex flex-col gap-12">
        {cv.map((cvGroup: CVGroupType) => (
          <SkeletonCVGroup
            key={cvGroup.id}
            cvGroup={cvGroup}
            className="flex-auto animate-pulse lg:flex-1"
          />
        ))}
      </Container>
    </>
  )
}
