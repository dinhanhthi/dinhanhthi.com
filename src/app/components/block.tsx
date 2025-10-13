import cn from 'classnames'
import { get } from 'lodash'
import * as types from 'notion-types'
import {
  getBlockIcon,
  getBlockParentPage,
  getPageTableOfContents,
  getTextContent,
  uuidToId
} from 'notion-utils'
import * as React from 'react'

import BsCheckSquare from '@/src/app/icons/BsCheckSquare'
import BsSquare from '@/src/app/icons/BsSquare'
import CiLink from '@/src/app/icons/CiLink'
import { usePostDateStatus } from '@/src/hooks/usePostDateStatus'
import { generateAnchor } from '@/src/lib/helpers'
import { useNotionContext } from '@/src/lib/notion/context'
import { cs, getListNumber, isUrl } from '@/src/lib/notion/utils'
import BlockCallout from './BlockCallout'
import BlockToggle from './BlockToggle'
import BlockVideo from './BlockVideo'
import BlockHeadingToggle from './ToggleHeading'
import { AssetWrapper } from './asset-wrapper'
import { Audio } from './audio'
import { EOI } from './eoi'
import { File } from './file'
import { GoogleDrive } from './google-drive'
import { LazyImage } from './lazy-image'
import { PageAside } from './page-aside'
import { PageIcon } from './page-icon'
import { PageTitle } from './page-title'
import { SyncPointerBlock } from './sync-pointer-block'
import { Text } from './text'
import TooltipX from './tooltip-x'

interface BlockProps {
  block: types.Block
  level: number

  showOnlyUpdatedBlocks: boolean
  setShowOnlyUpdatedBlocks: React.Dispatch<React.SetStateAction<boolean>>

  className?: string
  bodyClassName?: string

  header?: React.ReactNode
  footer?: React.ReactNode
  pageFooter?: React.ReactNode
  pageTitle?: React.ReactNode
  pageAside?: React.ReactNode
  pageCover?: React.ReactNode

  hideBlockId?: boolean
  disableHeader?: boolean

  children?: React.ReactNode
}

export const blockMargin = 'my-3'
const blockMarginMinus = 'md:-my-3'
const blockMarginBigger = '!my-4'
const blockMarginSmaller = '!my-2'

export const basicBlockGap = cn(blockMargin, 'relative')

const basicBlockGapBigger = `relative ${blockMarginBigger}`

// TODO: use react state instead of a global for this
const tocIndentLevelCache: {
  [blockId: string]: number
} = {}

const pageCoverStyleCache: Record<string, object> = {}

export const Block: React.FC<BlockProps> = props => {
  const ctx = useNotionContext()
  const {
    components,
    fullPage,
    darkMode,
    recordMap,
    mapPageUrl,
    mapImageUrl,
    showTableOfContents,
    minTableOfContentsItems,
    defaultPageIcon,
    defaultPageCoverPosition,
    blockOptions,
    customPreviewImage,
    useSimpleImage,
    postCreatedDate,
    postLastModifiedDate,
    simpleImageProps,
    showUpdatedIndicator,
    fontClass
  } = ctx

  const [activeSection, setActiveSection] = React.useState(null)

  const {
    block,
    children,
    level,
    className,
    bodyClassName,
    header,
    footer,
    pageFooter,
    pageAside,
    hideBlockId,
    disableHeader
  } = props

  const blockCreatedDate = postCreatedDate
    ? new Date(postCreatedDate) < new Date(block.created_time)
      ? postCreatedDate
      : block.created_time
    : block.created_time

  const blockLastModifiedDate = postLastModifiedDate
    ? new Date(postLastModifiedDate) < new Date(block.last_edited_time)
      ? postLastModifiedDate
      : block.last_edited_time
    : block.last_edited_time

  const status = usePostDateStatus(
    blockCreatedDate ? new Date(blockCreatedDate).toISOString() : undefined,
    blockLastModifiedDate ? new Date(blockLastModifiedDate).toISOString() : undefined,
    blockOptions?.maxDaysWinthin || 7
  )

  if (!block) {
    return null
  }

  // Remark: there are some settings in styles.scss too
  const showUpdated = status === 'updatedWithin' || status === 'new'
  const updatedBlock = (
    <>
      {
        // show only for top level blocks or a synced block
        (level === 1 || block.type === 'transclusion_container') &&
          showUpdated &&
          // Only show update indicator when toggle is true
          showUpdatedIndicator && (
            <>
              <button
                id={`updated-block-${block.id}`}
                onClick={() => props.setShowOnlyUpdatedBlocks(!props.showOnlyUpdatedBlocks)}
                className={cn(
                  'group button-indicator updated-block !absolute top-0 -left-4 !my-0 hidden h-full min-h-full w-2 shrink-0 md:block'
                )}
              >
                <div
                  className={cn(
                    'h-full w-[0.25px] bg-green-400 transition-all duration-100 group-hover:w-full'
                  )}
                ></div>
              </button>
              <TooltipX id={`#updated-block-${block.id}`}>
                {!props.showOnlyUpdatedBlocks
                  ? 'Highlight only updated blocks'
                  : 'Back to default display'}
              </TooltipX>
            </>
          )
      }
    </>
  )
  const blurBlockClassName = cn({
    'blur-sm': props.showOnlyUpdatedBlocks && !showUpdated
  })

  // ugly hack to make viewing raw collection views work properly
  // e.g., 6d886ca87ab94c21a16e3b82b43a57fb
  if (level === 0 && block.type === 'collection_view') {
    ;(block as any).type = 'collection_view_page'
  }

  const blockId = hideBlockId ? 'notion-block' : `notion-block-${uuidToId(block.id)}`

  switch (block.type) {
    case 'collection_view_page':
    // fallthrough
    case 'page':
      if (level === 0) {
        const {
          page_cover_position = defaultPageCoverPosition,
          page_full_width,
          page_small_text
        } = block.format || {}

        if (fullPage) {
          const coverPosition = (1 - (page_cover_position || 0.5)) * 100
          const pageCoverObjectPosition = `center ${coverPosition}%`
          let pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition]
          if (!pageCoverStyle) {
            pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition] = {
              objectPosition: pageCoverObjectPosition
            }
          }

          const pageIcon = getBlockIcon(block, recordMap) ?? defaultPageIcon
          const isPageIconUrl = pageIcon && isUrl(pageIcon)

          const tocs = getPageTableOfContents(block as types.PageBlock, recordMap)

          const hasToc = showTableOfContents && tocs.length >= minTableOfContentsItems
          const hasAside = (hasToc || pageAside) && !page_full_width

          return (
            <div
              className={cs(
                'notion',
                'notion-app',
                darkMode ? 'dark-mode' : 'light-mode',
                blockId,
                className
              )}
            >
              <div className="notion-viewport" />

              <div className="notion-frame">
                {!disableHeader && <components.Header block={block} />}
                {header}

                <div className="notion-page-scroller">
                  <main
                    className={cs(
                      'notion-page thi-prose',
                      isPageIconUrl ? 'notion-page-has-image-icon' : 'notion-page-has-text-icon',
                      'notion-full-page',
                      page_full_width && 'notion-full-width',
                      page_small_text && 'notion-small-text',
                      bodyClassName
                    )}
                  >
                    {block.type !== 'collection_view_page' && (
                      <div
                        className={cs(
                          'notion-page-content',
                          hasAside && ('notion-page-content-has-aside' as any),
                          hasToc && 'notion-page-content-has-toc'
                        )}
                      >
                        <article className={cn(fontClass, 'notion-page-content-inner')}>
                          {children}
                        </article>

                        {hasAside && (
                          <PageAside
                            toc={tocs}
                            activeSection={activeSection}
                            setActiveSection={setActiveSection as any}
                            hasToc={hasToc}
                            hasAside={hasAside}
                            pageAside={pageAside}
                          />
                        )}
                      </div>
                    )}

                    {pageFooter}
                  </main>

                  {footer}
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <main
              className={cs(
                'notion',
                darkMode ? 'dark-mode' : 'light-mode',
                'notion-page',
                page_full_width && 'notion-full-width',
                page_small_text && 'notion-small-text',
                blockId,
                className,
                bodyClassName
              )}
            >
              <div className="notion-viewport" />
              {pageFooter}
            </main>
          )
        }
      } else {
        const blockColor = block.format?.block_color

        return (
          <components.PageLink
            className={cs('notion-page-link', blockColor && `notion-${blockColor}`, blockId)}
            href={mapPageUrl(block.id)}
          >
            <PageTitle block={block} />
          </components.PageLink>
        )
      }

    case 'header':
    // fallthrough
    case 'sub_header':
    // fallthrough
    case 'sub_sub_header': {
      if (!block.properties) return null

      const blockColor = block.format?.block_color
      const id = uuidToId(block.id)
      const title = getTextContent(block.properties.title) || `Notion Header ${id}`
      const anchor = generateAnchor(id, title)

      // we use a cache here because constructing the ToC is non-trivial
      let indentLevel = tocIndentLevelCache[block.id]
      let indentLevelClass = ''

      if (indentLevel === undefined) {
        const page = getBlockParentPage(block, recordMap)

        if (page) {
          const toc = getPageTableOfContents(page, recordMap)
          const tocItem = toc.find(tocItem => tocItem.id === block.id)

          if (tocItem) {
            indentLevel = tocItem.indentLevel
            tocIndentLevelCache[block.id] = indentLevel
          }
        }
      }

      if (indentLevel !== undefined) {
        indentLevelClass = `notion-h-indent-${indentLevel}`
      }

      const isH1 = block.type === 'header'
      const isH2 = block.type === 'sub_header'
      const isH3 = block.type === 'sub_sub_header'

      const classNameStr = cs(
        isH1 && 'notion-h notion-h1',
        isH2 && 'notion-h notion-h2',
        isH3 && 'notion-h notion-h3',
        blockColor && `notion-${blockColor}`,
        indentLevelClass,
        blockId
      )

      const innerHeader = (
        <>
          <span className="notion-h-title leading-tight">
            <Text ignoreMarkup={['b']} value={block.properties.title} block={block} />
          </span>
          {!block.format?.toggleable && (
            <a
              className={cn('opacity-0 group-hover:opacity-100')}
              href={`#${anchor}`}
              title={title}
            >
              <CiLink />
            </a>
          )}
        </>
      )
      let headerBlock = <></>

      const headingCommonClasss = cn(
        'group !my-0 flex items-center gap-2',
        blockOptions?.headingScrollMarginTopClass ?? 'scroll-mt-[70px]'
      )

      if (isH1) {
        headerBlock = (
          <h1 id={anchor} className={cn(classNameStr, headingCommonClasss)} data-id={id}>
            {innerHeader}
          </h1>
        )
      } else if (isH2) {
        headerBlock = (
          <h2 id={anchor} className={cn(classNameStr, headingCommonClasss)} data-id={id}>
            {innerHeader}
          </h2>
        )
      } else {
        headerBlock = (
          <h3 id={anchor} className={cn(classNameStr, headingCommonClasss)} data-id={id}>
            {innerHeader}
          </h3>
        )
      }

      if (block.format?.toggleable) {
        return (
          <BlockHeadingToggle
            className={cn('heading-container relative', blurBlockClassName, {
              'rounded-l-sm border-l-[2px] border-sky-300 bg-gradient-to-r from-sky-50 to-white py-1 dark:border-sky-700':
                isH2,
              'mt-8': isH2 || isH1,
              'mt-6': isH3
            })}
            headingElement={headerBlock}
            updatedBlock={updatedBlock}
            headingType={isH3 ? 'h3' : isH1 ? 'h1' : 'h2'}
          >
            {children}
          </BlockHeadingToggle>
        )
      } else {
        return (
          <div
            className={cn('heading-container relative mb-4', blurBlockClassName, {
              'from-bg-hover to-bg rounded-l-sm border-l-[2px] border-sky-300 bg-gradient-to-r py-1 pl-2 dark:border-sky-700':
                isH2,
              'mt-8': isH2 || isH1,
              'mt-6': isH3
            })}
          >
            {updatedBlock}
            {headerBlock}
          </div>
        )
      }
    }

    case 'divider':
      return <hr className={cs('notion-hr', blockId)} />

    case 'text': {
      if (!block.properties && !block.content?.length) {
        return <div className={cs('notion-blank', blockId)}>&nbsp;</div>
      }

      const blockColor = block.format?.block_color

      return (
        <div
          className={cs(
            'notion-text',
            basicBlockGap,
            blurBlockClassName,
            blockColor && `notion-${blockColor}`,
            blockId
          )}
        >
          {updatedBlock}
          {block.properties?.title && <Text value={block.properties.title} block={block} />}

          {children && <div className="notion-text-children">{children}</div>}
        </div>
      )
    }

    case 'bulleted_list':
    // fallthrough
    case 'numbered_list': {
      const wrapList = (content: React.ReactNode, start?: number) =>
        block.type === 'bulleted_list' ? (
          <ul className={cs('notion-list notion-list-disc relative', blurBlockClassName, blockId)}>
            {updatedBlock}
            {content}
          </ul>
        ) : (
          <ol
            start={start}
            className={cs('notion-list notion-list-numbered relative', blurBlockClassName, blockId)}
          >
            {updatedBlock}
            {content}
          </ol>
        )

      let output: React.ReactElement | null = null

      if (block.content) {
        output = (
          <>
            {block.properties && (
              <li className={cn(blockMarginSmaller)}>
                <Text value={block.properties.title} block={block} />
              </li>
            )}
            {wrapList(children)}
          </>
        )
      } else {
        output = block.properties ? (
          <li className={cn(blockMarginSmaller)}>
            <Text value={block.properties.title} block={block} />
          </li>
        ) : null
      }

      const isTopLevel = block.type !== recordMap.block[block.parent_id]?.value?.type
      const start = getListNumber(block.id, recordMap.block)

      return isTopLevel ? wrapList(output, start) : output
    }

    case 'embed':
      return <components.Embed blockId={blockId} block={block} />
    // case 'replit':
    // fallthrough
    case 'tweet':
    // fallthrough
    case 'maps':
    // fallthrough
    case 'pdf':
    // fallthrough
    case 'figma':
    // fallthrough
    case 'typeform':
    // fallthrough
    case 'codepen':
    // fallthrough
    case 'excalidraw':
    // fallthrough
    case 'image':
    // fallthrough
    case 'gist':
      return (
        <AssetWrapper
          useSimpleImage={useSimpleImage}
          simpleImageProps={simpleImageProps}
          blockId={blockId}
          block={block}
          customPreviewImage={customPreviewImage}
          updatedBlock={updatedBlock}
          className={cn(basicBlockGapBigger, blurBlockClassName, 'relative')}
        />
      )

    case 'video':
      return (
        <BlockVideo
          className={cn(blockId, basicBlockGapBigger, blurBlockClassName, 'relative')}
          caption={<Text value={block.properties.caption!} block={block} />}
          videoUrl={block?.properties?.source?.[0]?.[0]}
          updatedBlock={updatedBlock}
        />
      )

    case 'drive': {
      const properties = block.format?.drive_properties
      if (!properties) {
        // check if this drive actually needs to be embeded ex. google sheets.
        if (block.format?.display_source) {
          return <AssetWrapper blockId={blockId} block={block} />
        }
      }

      return <GoogleDrive block={block as types.GoogleDriveBlock} className={blockId} />
    }

    case 'audio':
      return <Audio block={block as types.AudioBlock} className={blockId} />

    case 'file':
      return <File block={block as types.FileBlock} className={blockId} />

    case 'equation':
      return (
        <components.Equation
          block={block as types.EquationBlock}
          inline={false}
          className={cn(blockId, basicBlockGapBigger)}
          updatedBlock={updatedBlock}
          blurBlockClassName={blurBlockClassName}
        />
      )

    case 'code':
      return (
        <components.Code
          block={block as types.CodeBlock}
          updatedBlock={updatedBlock}
          className={cn(basicBlockGapBigger, blurBlockClassName)}
        />
      )

    case 'column_list': {
      return (
        <div
          className={cn(
            'block-column-list relative md:flex md:flex-nowrap md:gap-4',
            blockMarginMinus,
            blurBlockClassName,
            blockId
          )}
        >
          {updatedBlock}
          {children}
        </div>
      )
    }

    case 'column': {
      const ratio = block.format?.column_ratio
      const parent = recordMap.block[block.parent_id]?.value
      const nCols = parent?.content?.length || 1
      let width = '100%'
      if (!ratio || ratio === 1 || nCols >= 5) width = `${100 / nCols}%`
      else width = `${ratio * 100}%`

      return (
        <div className={cn('!min-w-full md:!min-w-0')} style={{ width }}>
          {children}
        </div>
      )
    }

    case 'quote': {
      if (!block.properties) return null

      const blockColor = block.format?.block_color

      return (
        <blockquote
          className={cn(
            'notion-quote border-t-none border-b-none relative',
            blurBlockClassName,
            {
              [`notion-${blockColor}`]: blockColor,
              'text-[115%]': get(block, 'format.quote_size') === 'large'
            },
            blockId
          )}
        >
          {updatedBlock}
          <div className={cn('quote-title')}>
            <Text value={block.properties.title} block={block} />
          </div>
          <div className="quote-children">{children}</div>
        </blockquote>
      )
    }

    // case 'collection_view':
    //   return <components.Collection block={block} className={blockId} ctx={ctx} />

    case 'callout':
      if (components.Callout) {
        return <components.Callout block={block} className={cn(blockId, blockMargin)} />
      } else {
        return (
          <BlockCallout
            className={cn(blockMargin, blurBlockClassName)}
            icon={<PageIcon block={block} />}
            text={<Text value={block.properties?.title} block={block} />}
            color={block.format?.block_color}
            updatedBlock={updatedBlock}
          >
            {!!block.content && <>{children}</>}
          </BlockCallout>
        )
      }

    case 'bookmark': {
      if (!block.properties) return null

      const link = block.properties.link
      if (!link || !link[0]?.[0]) return null

      let title = getTextContent(block.properties.title)
      if (!title) {
        title = getTextContent(link)
      }

      if (title) {
        if (title.startsWith('http')) {
          try {
            const url = new URL(title)
            title = url.hostname
          } catch (_err) {
            // ignore invalid links
          }
        }
      }

      return (
        <div className={cn(basicBlockGapBigger, blurBlockClassName)}>
          <a
            className={cn(
              'hover:border-link border-border-muted flex w-full gap-4 rounded-md border p-3 hover:cursor-pointer',
              blurBlockClassName
            )}
            href={link[0][0]}
            target="_blank"
            rel="noreferrer"
          >
            {updatedBlock}
            <div className="flex flex-[4_1_180px] flex-col justify-between gap-4 overflow-hidden">
              <div className="flex flex-col gap-1.5">
                {title && (
                  <div className="text-text truncate font-normal">
                    <Text value={[[title]]} block={block} />
                  </div>
                )}
                {block.properties?.description && (
                  <div className="!text-muted truncate text-[0.9em] font-normal">
                    <Text value={block.properties?.description} block={block} />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {block.format?.bookmark_icon && (
                  <div className="relative h-4 w-4 shrink-0">
                    <LazyImage
                      useSimpleImage={true}
                      simpleImageProps={{ style: { height: '100%', width: '100%' } }}
                      src={mapImageUrl(block.format?.bookmark_icon, block)}
                      alt={title}
                    />
                  </div>
                )}
                <div className="!text-muted truncate text-[0.9em] font-normal">
                  <Text value={link} block={block} />
                </div>
              </div>
            </div>
            {block.format?.bookmark_cover && (
              <div className="relative hidden flex-[1_1_100px] sm:block">
                <LazyImage
                  useSimpleImage={true}
                  simpleImageProps={{ style: { height: 100 } }}
                  src={mapImageUrl(block.format?.bookmark_cover, block)}
                  alt={getTextContent(block.properties?.title)}
                  style={{
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
          </a>
        </div>
      )
    }

    case 'toggle':
      return (
        <BlockToggle
          className={cn('relative', blurBlockClassName)}
          text={<Text value={block.properties?.title} block={block} />}
          color={get(block, 'format.block_color')}
          updatedBlock={updatedBlock}
        >
          {children}
        </BlockToggle>
      )

    case 'table_of_contents': {
      const page = getBlockParentPage(block, recordMap)
      if (!page) return null

      const toc = getPageTableOfContents(page, recordMap)
      const blockColor = block.format?.block_color

      return (
        <div
          className={cs('notion-table-of-contents', blockColor && `notion-${blockColor}`, blockId)}
        >
          {toc.map(tocItem => (
            <a
              key={tocItem.id}
              href={`#${uuidToId(tocItem.id)}`}
              className="notion-table-of-contents-item"
            >
              <span
                className="notion-table-of-contents-item-body"
                style={{
                  display: 'inline-block',
                  marginLeft: tocItem.indentLevel * 24
                }}
              >
                {tocItem.text}
              </span>
            </a>
          ))}
        </div>
      )
    }

    case 'to_do': {
      const isChecked = block.properties?.checked?.[0]?.[0] === 'Yes'

      return (
        <div className={cs('notion-to-do relative', blurBlockClassName, blockId)}>
          {updatedBlock}
          <div className={cn('flex items-start gap-2', blockMargin)}>
            <div className="mt-[3px] h-4 w-4">
              {isChecked && <BsCheckSquare className="text-slate-500 dark:text-slate-300" />}
              {!isChecked && <BsSquare className="mt-0.5" />}
            </div>
            <div>
              <Text value={block.properties?.title} block={block} />
            </div>
          </div>

          <div className="notion-to-do-children pl-6">{children}</div>
        </div>
      )
    }

    case 'transclusion_container':
      return (
        <div className={cs('notion-sync-block relative', blurBlockClassName, blockId)}>
          {updatedBlock}
          {children}
        </div>
      )

    case 'transclusion_reference':
      return <SyncPointerBlock blockObj={block} levelObj={level + 1} {...props} />

    case 'alias': {
      const blockPointerId = block?.format?.alias_pointer?.id
      const linkedBlock = recordMap.block[blockPointerId]?.value
      if (!linkedBlock) {
        console.log('"alias" missing block', blockPointerId)
        return null
      }

      return (
        <components.PageLink
          className={cs('notion-page-link', blockPointerId)}
          href={mapPageUrl(blockPointerId)}
        >
          <PageTitle block={linkedBlock} />
        </components.PageLink>
      )
    }

    case 'table':
      return (
        <div
          className={cn(
            basicBlockGapBigger,
            blurBlockClassName,
            'thi-scrollbar relative overflow-auto'
          )}
        >
          {updatedBlock}
          <table className={cs('notion-simple-table my-0 table-auto', blockId)}>
            <tbody
              className={cn({
                table_block_column_header: block?.format?.table_block_column_header,
                table_block_row_header: get(block, 'format.table_block_row_header', false)
              })}
            >
              {children}
            </tbody>
          </table>
        </div>
      )

    case 'table_row': {
      const tableBlock = recordMap.block[block.parent_id]?.value as types.TableBlock
      const order = tableBlock.format?.table_block_column_order
      const formatMap = tableBlock.format?.table_block_column_format
      const backgroundColor = block.format?.block_color

      if (!tableBlock || !order) {
        return null
      }

      return (
        <tr
          className={cs(
            'notion-simple-table-row',
            backgroundColor && `notion-${backgroundColor}`,
            blockId
          )}
        >
          {order.map(column => {
            const color = formatMap?.[column]?.color

            return (
              <td
                key={column}
                className={cn('border border-slate-300 !p-2', {
                  [`notion-${color}`]: color
                })}
              >
                <div className="notion-simple-table-cell">
                  <Text value={block.properties?.[column] || [['ㅤ']]} block={block} />
                </div>
              </td>
            )
          })}
        </tr>
      )
    }

    case 'external_object_instance': {
      return (
        <EOI
          block={block}
          className={cn(blockId, blurBlockClassName)}
          updatedBlock={updatedBlock}
        />
      )
    }

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log('Unsupported type ' + (block as any).type, JSON.stringify(block, null, 2))
      }

      return <div />
  }
}
