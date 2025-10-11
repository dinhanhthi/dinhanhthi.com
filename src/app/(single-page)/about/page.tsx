import cn from 'classnames'
import { Suspense } from 'react'

import ScrollToTop from '@/src/app/components/ScrollToTop'
import { bodyPadding } from '@/src/lib/config'
import { getMetadata } from '@/src/lib/helpers'
import cv from '../../../data/cv'
import me from '../../../data/me'
import skills from '../../../data/skills'
import CVGroup, { CVGroupType, SkeletonCVGroup } from '../../components/CVGroup'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderThiCard from '../../components/HeaderThiCard'
import SkillGroup, { SkeletonSkillGroup, SkillGroupType } from '../../components/SkillGroup'

export const revalidate = 20

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
  const sectionSpacing = 'pt-12'
  return (
    <div className="thi-bg-stone">
      <HeaderThiCard />
      <Container className={bodyPadding}>
        <div className={'flex flex-wrap gap-4'}>
          {skills.map((skillGroup: SkillGroupType) => (
            <Suspense
              key={skillGroup.id}
              fallback={
                <SkeletonSkillGroup skillGroup={skillGroup} className="min-w-[200px] flex-1" />
              }
            >
              <SkillGroup className="min-w-[200px] flex-auto md:flex-1" skillGroup={skillGroup} />
            </Suspense>
          ))}
        </div>
        <div className={cn('flex flex-wrap gap-10 overflow-hidden lg:gap-4', sectionSpacing)}>
          {cv.map((cvGroup: CVGroupType) => (
            <Suspense
              fallback={<SkeletonCVGroup cvGroup={cvGroup} className="flex-1" />}
              key={cvGroup.id}
            >
              <CVGroup className="flex-auto lg:flex-1" key={cvGroup.id} cvGroup={cvGroup} />
            </Suspense>
          ))}
        </div>
      </Container>
      <Footer footerType="gray" />
      <ScrollToTop />
    </div>
  )
}
