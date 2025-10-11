import PostAside from '@/src/app/components/PostAside'
import PostBody from '@/src/app/components/PostBody'
import PostHeader from '@/src/app/components/PostHeader'
import PostToc from '@/src/app/components/PostToc'
import { BlockOptionsContextType } from '@/src/lib/notion/context'
import cn from 'classnames'
import { ExtendedRecordMap, PageBlock } from 'notion-types'
import { getPageTableOfContents } from 'notion-utils'

import { bodyPadding, defaultPostTypeOpts, postFontClassName } from '@/src/lib/config'
import { Post } from '@/src/lib/types'
import { get } from 'lodash'
import Comments from '../components/Comments'
import Container from '../components/Container'
import Footer from '../components/Footer'

type SinglePostTemplateProps = {
  recordMap: ExtendedRecordMap
  postProps: Post
  blockOptionsContext?: BlockOptionsContextType
  hideMeta?: boolean
}

// Note: If we change the breakpoint here, we have to change the breakpoint of showing TOC on
// small screens in component post-toc.tsx too.
const asideClass = cn('hidden flex-1 2xl:block', 'sticky top-[70px] h-[calc(100vh-130px)] pt-8')

export default function SinglePostTemplate(props: SinglePostTemplateProps) {
  const id = Object.keys(props.recordMap.block)[0]
  const block = props.recordMap.block[id]?.value
  const tocs = getPageTableOfContents(block as PageBlock, props.recordMap)
  return (
    <>
      <div className="animate-fadeIn bg-white">
        <PostHeader
          recordMap={props.recordMap}
          postProps={props.postProps}
          hideMeta={props.hideMeta}
        />
        <div className={cn('flex justify-center', bodyPadding)}>
          <aside className={cn(asideClass)}>
            <PostAside position="left">
              <div className="hidden">Left aside</div>
            </PostAside>
          </aside>

          <Container>
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
          </Container>

          <aside className={cn(asideClass)}>
            <PostAside position="right">
              <PostToc
                defaultOpenToc={true}
                recordMap={props.recordMap}
                tocs={tocs}
                labelTocTitle="In this note"
                postTocClassName="text-[0.95rem]"
              />
            </PostAside>
          </aside>
        </div>

        <Footer />
      </div>
    </>
  )
}
