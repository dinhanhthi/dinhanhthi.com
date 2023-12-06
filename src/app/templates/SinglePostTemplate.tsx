import toTopImg from '@/public/to-top.webp'
import PostAside from '@/src/app/components/PostAside'
import PostHeader from '@/src/app/components/PostHeader'
import PostBody from '@notion-x/src/components/PostBody'
import PostToc from '@notion-x/src/components/PostToc'
import ScrollToTop from '@notion-x/src/components/ScrollToTop'
import { BlockOptionsContextType } from '@notion-x/src/lib/context'
import cn from 'classnames'
import { ExtendedRecordMap, PageBlock } from 'notion-types'
import { getPageTableOfContents } from 'notion-utils'

import Comments from '../components/Comments'
import Container from '../components/Container'
import Footer from '../components/Footer'
import { bodyPadding, containerNormal } from '../lib/config'

type SinglePostTemplateProps = {
  recordMap: ExtendedRecordMap
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
        <PostHeader recordMap={props.recordMap} hideMeta={props.hideMeta} />
        <div className={cn('flex justify-center', bodyPadding)}>
          <aside className={cn(asideClass)}>
            <PostAside position="left">
              <div className="hidden">Left aside</div>
            </PostAside>
          </aside>

          <Container className={containerNormal}>
            <article>
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
                showUpdatedIndicator={true}
              />
            </article>

            <Comments />
          </Container>

          <aside className={cn(asideClass)}>
            <PostAside position="right">
              <PostToc recordMap={props.recordMap} tocs={tocs} labelTocTitle="In this note" />
            </PostAside>
          </aside>
        </div>

        <Footer footerType="white" />
      </div>
      <ScrollToTop image={toTopImg} />
    </>
  )
}
