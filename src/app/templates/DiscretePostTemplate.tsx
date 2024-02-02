import cn from 'classnames'
import { ExtendedRecordMap } from 'notion-types'
import PostBody from '../../../notion-x/src/components/PostBody'
import { Post } from '../../../notion-x/src/interface'
import { BlockOptionsContextType } from '../../../notion-x/src/lib/context'
import Comments from '../components/Comments'
import Footer from '../components/Footer'
import PostHeader from '../components/PostHeader'
import { bodyPadding } from '../lib/config'

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
          <div className="mx-auto px-5">
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
              discreteStyle={true}
              showUpdatedIndicator={true}
              lastModifiedIdKey={process.env.NEXT_PUBLIC_ID_LAST_MODIFIED}
              createdIdKey={process.env.NEXT_PUBLIC_ID_CREATED_DATE}
              showBackToTopButton={true}
              showUpdateButtonClassName="tooltip-auto before:!left-auto before:!right-[55px] before:!top-[15px] before:!content-[attr(data-title)]"
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
