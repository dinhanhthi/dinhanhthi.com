import SkeletonPostHeaderTopics from '@/src/app/components/skeleton/SkeletonPostHeaderTopics'
import cn from 'classnames'

import { Calendar, UserRound } from 'lucide-react'
import Container from '../Container'
import Header from '../Header'
import { fullWidthPostCoverHeight } from '../HeaderPost'

type SkeletonPostProps = {
  hideCover?: boolean
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
        <Header className="animate-pulse">
          <div className="flex w-full flex-col items-center gap-4 py-8 sm:items-start">
            {/* Icon (mobile) */}
            <div className="h-8 w-8 rounded-full bg-slate-200 sm:hidden"></div>

            {/* Title */}
            <div className={cn('h-8 w-3/4 rounded-2xl bg-slate-200')}></div>

            {/* Meta */}
            <div className={cn('flex flex-wrap justify-start gap-3 md:flex-nowrap')}>
              <div className="flex items-center gap-1">
                <UserRound size={14} />
                <div className="h-5 w-16 rounded-2xl bg-slate-200"></div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <div className="h-5 w-28 rounded-2xl bg-slate-200"></div>
              </div>
            </div>

            {/* Tags */}
            {!props.hideTags && <SkeletonPostHeaderTopics className="pt-0 pb-2" />}
          </div>
        </Header>
      </div>
      {/* Content */}
      <Container className="h-[400px]">
        <div className={cn('container mx-auto pt-4 pb-8')}>
          <div className="mt-4 mb-2 h-5 w-full rounded-2xl bg-slate-200"></div>
          <div className="mb-2 h-5 w-full rounded-2xl bg-slate-200"></div>
          <div className="mb-2 h-5 w-full rounded-2xl bg-slate-200"></div>
          <div className="mb-1 h-5 w-1/2 rounded-2xl bg-slate-200"></div>
        </div>
      </Container>
    </>
  )
}
