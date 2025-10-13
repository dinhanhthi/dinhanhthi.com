import { sectionOuterClass } from '../../../lib/config'
import { cn } from '../../../lib/utils'
import { SkeletonHeaderPost } from '../../components/HeaderPost'
import { SkeletonPostToc } from '../../components/PostToc'

export default function LoadingPost() {
  return (
    <>
      <SkeletonHeaderPost />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div
          className={cn(
            'order-2 flex flex-1 animate-pulse flex-col gap-4 bg-white p-4 lg:p-6',
            sectionOuterClass
          )}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-5 animate-pulse rounded-xl bg-slate-200"
              style={{ width: `${60 + Math.random() * 40}%` }}
            ></div>
          ))}
        </div>
        <SkeletonPostToc className="order-1 h-fit w-full lg:sticky lg:order-2 lg:h-[calc(100vh-110px)] lg:w-[200px]" />
      </div>
    </>
  )
}
