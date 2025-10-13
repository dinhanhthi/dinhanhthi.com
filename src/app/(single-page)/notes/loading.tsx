import { HeaderPageSkeleton } from '../../components/HeaderPage'
import { SkeletonNotesToc } from '../../components/NotesToc'
import { SkeletonNotesPageBody } from './SkeletonNotesPageBody'

export default function NotesPageLoading() {
  return (
    <>
      <HeaderPageSkeleton />
      <div className="flex flex-col gap-12 md:flex-row md:gap-4">
        <SkeletonNotesPageBody className="order-2" />
        <SkeletonNotesToc className="top-[60px] order-1 h-fit w-full md:sticky md:order-2 md:h-[calc(100vh-110px)] md:w-fit" />
      </div>
    </>
  )
}
