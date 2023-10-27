import cn from 'classnames'
import { Suspense } from 'react'

import cv from '../../../data/cv'
import me from '../../../data/me'
import skills from '../../../data/skills'
import CVGroup, { CVGroupType, SkeletonCVGroup } from '../../components/CVGroup'
import Container from '../../components/Container'
import Footer from '../../components/Footer'
import HeaderAbout from '../../components/HeaderAbout'
import SkillGroup, { SkeletonSkillGroup, SkillGroupType } from '../../components/SkillGroup'
import { bodyPadding, containerWide } from '../../lib/config'
import { getMetadata } from '../../lib/helpers'

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

export default async function AboutPage() {
  const sectionSpacing = 'pt-12'
  return (
    <div className="thi-bg-stone">
      <HeaderAbout />
      <Container className={cn(bodyPadding, containerWide)}>
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
        <div className={cn('flex flex-wrap gap-10 lg:gap-4', sectionSpacing)}>
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
    </div>
  )
}
