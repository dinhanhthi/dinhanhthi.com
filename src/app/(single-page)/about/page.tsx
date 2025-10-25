import { Suspense } from 'react'

import { getMetadata } from '@/src/lib/helpers'
import cv from '../../../data/cv'
import me from '../../../data/me'
import CVGroup, { CVGroupType, SkeletonCVGroup } from '../../components/CVGroup'
import HeaderThiCard from '../../components/HeaderThiCard'

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
  return (
    <>
      <HeaderThiCard />
      <div className="flex flex-col gap-12">
        {cv.map((cvGroup: CVGroupType) => (
          <Suspense
            fallback={
              <SkeletonCVGroup cvGroup={cvGroup} className="flex-auto animate-pulse lg:flex-1" />
            }
            key={cvGroup.id}
          >
            <CVGroup className="flex-auto lg:flex-1" key={cvGroup.id} cvGroup={cvGroup} />
          </Suspense>
        ))}
      </div>
    </>
  )
}
