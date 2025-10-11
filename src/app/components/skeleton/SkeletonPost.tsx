import SkeletonPostHeaderTopics from '@/src/app/components/skeleton/SkeletonPostHeaderTopics'
import AiOutlineClockCircle from '@/src/app/icons/AiOutlineClockCircle'
import RiUser3Line from '@/src/app/icons/RiUser3Line'
import cn from 'classnames'

import { bodyPadding } from '@/src/lib/config'
import MdEditNote from '../../icons/MdEditNote'
import Container from '../Container'
import Footer from '../Footer'
import Header from '../Header'
import { fullWidthPostCoverHeight } from '../PostHeader'

type SkeletonPostProps = {
  hideCover?: boolean
  hideMeta?: boolean
  hideTags?: boolean
}

/**
 * A skeleton loading template for post
 * Note that, options in this component should have the same values as the one
 * in pages/[postSlug], where it's used as a skeleton. This makes sure the
 * loading placeholder has the same shape as the one to be loaded!
 */
export default function SkeletonPost(props: SkeletonPostProps) {
  return (
    <>
      <div className="animate-pulse">
        {/* Featured Image */}
        {!props.hideCover && (
          <div>
            <div className={cn('w-full bg-slate-200', fullWidthPostCoverHeight)}></div>
          </div>
        )}
        <Header
          childrenContainerClassName={cn('animate-pulse')}
          headerType={'white'}
          headerWidth="normal"
        >
          <div className="flex w-full flex-col items-center gap-4 py-8 sm:items-start">
            {/* Icon (mobile) */}
            <div className="h-8 w-8 rounded-full bg-slate-200 sm:hidden"></div>

            {/* Title */}
            <div className={cn('h-8 w-3/4 rounded-2xl bg-slate-200')}></div>

            {/* Meta */}
            {!props.hideMeta && (
              <div className={cn('flex flex-wrap justify-start gap-3 md:flex-nowrap')}>
                <div className="flex items-center gap-1">
                  <RiUser3Line className="text-slate-400" />
                  <div className="h-5 w-16 rounded-2xl bg-slate-200"></div>
                </div>
                <MdEditNote className={cn('mt-[-3px] inline-block text-[1.3rem] text-[#dadada]')} />
                <div className="flex items-center gap-1">
                  <AiOutlineClockCircle className="text-slate-400" />
                  <div className="h-5 w-28 rounded-2xl bg-slate-200"></div>
                </div>
              </div>
            )}

            {/* Tags */}
            {!props.hideTags && <SkeletonPostHeaderTopics className="pt-0 pb-2" />}
          </div>
        </Header>
      </div>
      {/* Content */}
      <Container className={cn(bodyPadding, 'h-[400px]')}>
        <div className={cn('container mx-auto pt-4 pb-8')}>
          <div className="mt-4 mb-2 h-5 w-full rounded-2xl bg-slate-200"></div>
          <div className="mb-2 h-5 w-full rounded-2xl bg-slate-200"></div>
          <div className="mb-2 h-5 w-full rounded-2xl bg-slate-200"></div>
          <div className="mb-1 h-5 w-1/2 rounded-2xl bg-slate-200"></div>
        </div>
      </Container>

      <Footer footerType="white" />
    </>
  )
}
