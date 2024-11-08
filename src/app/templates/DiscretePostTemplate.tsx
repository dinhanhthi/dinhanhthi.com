import PostBody from '@notion-x/src/components/PostBody'
import { Post } from '@notion-x/src/interface'
import { BlockOptionsContextType } from '@notion-x/src/lib/context'
import cn from 'classnames'
import { ExtendedRecordMap } from 'notion-types'
import Comments from '../components/Comments'
import Footer from '../components/Footer'
import PostHeader from '../components/PostHeader'
import { bodyPadding, containerNormal, discreteColsType } from '../lib/config'

type DiscretePostTemplateType = {
  recordMap: ExtendedRecordMap
  postProps: Post
  blockOptionsContext?: BlockOptionsContextType
  hideMeta?: boolean
}

export default function DiscretePostTemplate(props: DiscretePostTemplateType) {
  return (
    <>
      <div className="animate-fadeIn thi-bg-stone">
        <PostHeader
          recordMap={props.recordMap}
          hideMeta={props.hideMeta}
          postProps={props.postProps}
          discreteStyle={true}
        />
        <div className={cn(bodyPadding)}>
          <div
            className={cn('mx-auto px-5', {
              container: discreteColsType === 'single',
              [containerNormal]: discreteColsType === 'single'
            })}
          >
            {props.postProps.isDraft && (
              <div className="flex bg-transparent items-center gap-2 mb-8 border-b-slate-300 border-b text-sm">
                <div className="pl-2 py-2 text-base">⚠️</div>
                <div className="pr-4 w-0 flex-1 text-slate-600">
                  This is a quick &amp; dirty draft, for me only!
                </div>
              </div>
            )}
            <PostBody
              recordMap={props.recordMap}
              blockOptions={{
                siteDomain: 'dinhanhthi.com',
                labelTocTitle: 'In this note',
                blockCodeCopiedText: 'Copied',
                blockCodeCopyText: 'Copy',
                headingScrollMarginTopClass: 'scroll-mt-[70px]',
                minNumHeadingsToShowToc: 4,
                maxDaysWinthin: 7
              }}
              useSimpleImage={true}
              discreteStyle={true} // The big difference from SinglePostTemplate is here!
              fontClass="font-sans"
              discreteColsType={discreteColsType}
              showUpdatedIndicator={true}
              lastModifiedIdKey={process.env.NEXT_PUBLIC_ID_LAST_MODIFIED}
              createdIdKey={process.env.NEXT_PUBLIC_ID_CREATED_DATE}
              showBackToTopButton={true}
              showUpdateButtonClassName="before:!left-auto before:!right-[55px] before:!top-[15px]"
              showUpdateButtonPositionClass="right-10 bottom-8"
            />
          </div>
          <Comments />
        </div>

        <Footer footerType="gray" />
      </div>
    </>
  )
}
