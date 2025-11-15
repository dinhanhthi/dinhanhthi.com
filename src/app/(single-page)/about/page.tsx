import { getMetadata } from '@/src/lib/helpers'
import cv from '../../../data/cv'
import me from '../../../data/me'
import AnimatedSkillsSection from '../../components/AnimatedSkillsSection'
import Container from '../../components/Container'
import CVGroup, { CVGroupType } from '../../components/CVGroup'
import HeaderThiCard from '../../components/HeaderThiCard'

export const revalidate = 60

export const metadata = getMetadata({
  title: 'About me',
  description: me.quote,
  images: [
    {
      url: 'https://i.imgur.com/PyXUtfTh.png',
      width: 1024,
      height: 591
    }
  ]
})

export default async function AboutHomePage() {
  return (
    <>
      <HeaderThiCard />
      <AnimatedSkillsSection className='mb-12' />
      <Container className="flex flex-col gap-12">
        {cv.map((cvGroup: CVGroupType) => (
          <CVGroup className="flex-auto lg:flex-1" key={cvGroup.id} cvGroup={cvGroup} />
        ))}
      </Container>
    </>
  )
}
