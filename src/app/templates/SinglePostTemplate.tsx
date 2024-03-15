import PostAside from '@/src/app/components/PostAside'
import PostHeader from '@/src/app/components/PostHeader'
import PostBody from '@notion-x/src/components/PostBody'
import PostToc from '@notion-x/src/components/PostToc'
import { BlockOptionsContextType } from '@notion-x/src/lib/context'
import cn from 'classnames'
import { ExtendedRecordMap, PageBlock } from 'notion-types'
import { getPageTableOfContents } from 'notion-utils'

import { Post } from '@notion-x/src/interface'
import { get } from 'lodash'
import Comments from '../components/Comments'
import Container from '../components/Container'
import Footer from '../components/Footer'
import { bodyPadding, containerNormal, defaultPostTypeOpts } from '../lib/config'

type SinglePostTemplateProps = {
  recordMap: ExtendedRecordMap
  postProps: Post
  blockOptionsContext?: BlockOptionsContextType
  hideMeta?: boolean
}

// Note: If we change the breakpoint here, we have to change the breakpoint of showing TOC on
// small screens in component post-toc.tsx too.
const asideClass = cn('hidden 2xl:block flex-1', 'h-[calc(100vh-130px)] sticky top-[70px] pt-8')

export default function SinglePostTemplate(props: SinglePostTemplateProps) {
  const id = Object.keys(props.recordMap.block)[0]
  const block = props.recordMap.block[id]?.value
  const tocs = getPageTableOfContents(block as PageBlock, props.recordMap)
  return (
    <>
      <div className="animate-fadeIn">
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

          <Container className={containerNormal}>
            <PostBody
              recordMap={props.recordMap}
              blockOptions={{
                siteDomain: 'dinhanhthi.com',
                labelTocTitle: props.postProps?.blog ? 'In this post' : 'In this note',
                blockCodeCopiedText: 'Copied',
                blockCodeCopyText: 'Copy',
                headingScrollMarginTopClass: 'scroll-mt-[70px]',
                minNumHeadingsToShowToc: 4,
                maxDaysWinthin: get(defaultPostTypeOpts, 'maxDaysWinthin', 7),
                expandTocOnMobile: false
              }}
              useSimpleImage={true}
              showUpdatedIndicator={true}
              lastModifiedIdKey={process.env.NEXT_PUBLIC_ID_LAST_MODIFIED}
              createdIdKey={process.env.NEXT_PUBLIC_ID_CREATED_DATE}
              showBackToTopButton={true}
              showUpdateButtonClassName="tooltip-auto before:!left-auto before:!right-[55px] before:!top-[15px] before:!content-[attr(data-title)]"
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
              />
            </PostAside>
          </aside>
        </div>

        <Footer footerType="white" />
      </div>
    </>
  )
}
