import HeaderPost from '@/src/app/components/HeaderPost'
import PostBody from '@/src/app/components/PostBody'
import PostToc from '@/src/app/components/PostToc'
import { BlockOptionsContextType } from '@/src/lib/notion/context'
import cn from 'classnames'
import { ExtendedRecordMap, PageBlock } from 'notion-types'
import { getPageTableOfContents } from 'notion-utils'

import { defaultPostTypeOpts, postFontClassName, sectionOuterClass } from '@/src/lib/config'
import { Post } from '@/src/lib/types'
import { get } from 'lodash'
import Comments from '../components/Comments'

type SinglePostTemplateProps = {
  recordMap: ExtendedRecordMap
  postProps: Post
  blockOptionsContext?: BlockOptionsContextType
}

export default function SinglePostTemplate(props: SinglePostTemplateProps) {
  const id = Object.keys(props.recordMap.block)[0]
  const block = props.recordMap.block[id]?.value
  const tocs = getPageTableOfContents(block as PageBlock, props.recordMap)
  return (
    <>
      <HeaderPost recordMap={props.recordMap} postProps={props.postProps} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className={cn('order-2 bg-white p-4 lg:p-6', sectionOuterClass)}>
          {props.postProps.isDraft && (
            <div className="mb-8 flex items-center gap-2 border-b border-b-slate-200 bg-transparent text-sm">
              <div className="py-2 pl-2 text-base">⚠️</div>
              <div className="w-0 flex-1 pr-4 text-slate-600">
                This is a quick &amp; dirty draft, for me only!
              </div>
            </div>
          )}
          <PostBody
            className={cn({
              vietnamese: props.postProps?.language === 'vi'
            })}
            recordMap={props.recordMap}
            blockOptions={{
              siteDomain: 'dinhanhthi.com',
              labelTocTitle: props.postProps?.blog ? 'In this post' : 'In this note',
              postTocClassName: 'text-[0.95rem]',
              blockCodeCopiedText: 'Copied',
              blockCodeCopyText: 'Copy',
              headingScrollMarginTopClass: 'scroll-mt-[70px]',
              minNumHeadingsToShowToc: 4,
              maxDaysWinthin: get(defaultPostTypeOpts, 'maxDaysWinthin', 7),
              expandTocOnMobile: false
            }}
            useSimpleImage={true}
            fontClass={postFontClassName}
            showUpdatedIndicator={true}
            postCreatedDate={props.postProps.createdDate}
            postLastModifiedDate={props.postProps.date}
            lastModifiedIdKey={process.env.NEXT_PUBLIC_ID_LAST_MODIFIED}
            createdIdKey={process.env.NEXT_PUBLIC_ID_CREATED_DATE}
            showBackToTopButton={true}
            showUpdateButtonClassName="before:!left-auto before:!right-[55px] before:!top-[15px]"
            showUpdateButtonPositionClass="right-10 bottom-8"
          />
          <Comments />
        </div>

        <PostToc
          className={cn(
            'top-[70px] order-1 h-fit w-full lg:sticky lg:order-2 lg:h-[calc(100vh-110px)] lg:max-w-[200px]'
          )}
          defaultOpenToc={true}
          recordMap={props.recordMap}
          tocs={tocs}
          labelTocTitle="In this note"
        />
      </div>
    </>
  )
}
