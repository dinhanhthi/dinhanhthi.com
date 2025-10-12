import { Block, Decoration, ExternalObjectInstance } from 'notion-types'
import { parsePageId } from 'notion-utils'
import * as React from 'react'

import { mapNoteUri, removeBaseUrl } from '@/src/lib/helpers'
import { useNotionContext } from '@/src/lib/notion/context'
import { formatDate, getHashFragmentValue } from '@/src/lib/notion/utils'
import { NotionComponents } from '@/src/lib/types'
import BlockEquation from './BlockEquation'
import { EOI } from './eoi'
import { GracefulImage } from './graceful-image'
import { LazyImage } from './lazy-image'
import { PageTitle } from './page-title'

/**
 * Renders a single piece of Notion text, including basic rich text formatting.
 *
 * These represent the innermost leaf nodes of a Notion subtree.
 *
 * TODO: I think this implementation would be more correct if the reduce just added
 * attributes to the final element's style.
 */
export const Text: React.FC<{
  value: Decoration[]
  block: Block
  linkProps?: any
  linkProtocol?: string
  inline?: boolean // TODO: currently unused
  components?: Partial<NotionComponents>
  ignoreMarkup?: ('b' | '_' | 'a' | 'u' | 'h')[]
}> = ({ value, block, linkProps, linkProtocol, components: inputComponents, ignoreMarkup }) => {
  const {
    components: ctxComponents,
    recordMap,
    mapPageUrl,
    mapImageUrl,
    rootDomain,
    blockOptions
  } = useNotionContext()

  const components = React.useMemo(() => {
    return {
      ...ctxComponents,
      ...inputComponents
    }
  }, [ctxComponents, inputComponents])

  return (
    <React.Fragment>
      {value?.map(([text, decorations], index) => {
        // TODO: sometimes notion shows a max of N items to prevent overflow
        // if (trim && index > 18) {
        //   return null
        // }

        const newText = text.includes('\n') ? (
          <span dangerouslySetInnerHTML={{ __html: text.split('\n').join('<br />') }}></span>
        ) : (
          text
        )

        if (!decorations) {
          if (text === ',') {
            return <span key={index} style={{ padding: '0.5em' }} />
          } else {
            return <React.Fragment key={index}>{newText}</React.Fragment>
          }
        }

        const formatted = decorations.reduce(
          (element: React.ReactNode, decorator) => {
            switch (decorator[0]) {
              case 'p': {
                // link to an internal block (within the current workspace)
                const blockId = decorator[1]
                const linkedBlock = recordMap.block[blockId]?.value
                if (!linkedBlock) {
                  if (process.env.ENV_MODE === 'dev') console.log('"p" missing block', blockId)
                  return null
                }

                // console.log('p', blockId)

                const postSlug =
                  linkedBlock?.properties?.[
                    `${blockOptions?.slugKey ?? process.env.NEXT_PUBLIC_ID_SLUG}`
                  ]?.[0]?.[0]

                return (
                  <components.PageLink
                    className="notion-link"
                    href={mapNoteUri(postSlug, blockOptions?.notelabel)}
                  >
                    <PageTitle block={linkedBlock} hideIcon={true} />
                  </components.PageLink>
                )
              }

              case '‣': {
                // link to an external block (outside of the current workspace)
                const linkType = decorator[1][0]
                const id = decorator[1][1]

                switch (linkType) {
                  case 'u': {
                    const user = recordMap.notion_user[id]?.value

                    if (!user) {
                      console.log('"‣" missing user', id)
                      return null
                    }

                    const name = [user.given_name, user.family_name].filter(Boolean).join(' ')

                    return (
                      <GracefulImage
                        className="notion-user"
                        src={mapImageUrl(user.profile_photo, block)}
                        alt={name}
                      />
                    )
                  }

                  default: {
                    const linkedBlock = recordMap.block[id]?.value
                    if (!linkedBlock) {
                      console.log('"‣" missing block', linkType, id)
                      return null
                    }

                    return (
                      <components.PageLink
                        className="notion-link"
                        href={mapPageUrl(id)}
                        {...linkProps}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <PageTitle block={linkedBlock} />
                      </components.PageLink>
                    )
                  }
                }
              }

              case 'h':
                if (ignoreMarkup?.includes('h')) return element
                return <span className={`notion-${decorator[1]}`}>{element}</span>

              case 'c':
                return <code className="border border-gray-200">{element}</code>

              case 'b': {
                if (ignoreMarkup?.includes('b')) return element
                return <strong>{element}</strong>
              }

              case 'i':
                return <em className="italic">{element}</em>

              case 's':
                return <s>{element}</s>

              case '_': {
                if (ignoreMarkup?.includes('_')) return element
                return (
                  <span className="underline decoration-slate-500 underline-offset-4">
                    {element}
                  </span>
                )
              }

              case 'e':
                return <BlockEquation math={decorator[1]} inline />

              case 'm':
                // comment / discussion
                return element // still need to return the base element

              case 'a': {
                if (ignoreMarkup?.includes('_')) return element
                const v = decorator[1]
                const pathname = v.substr(1)
                const id = parsePageId(pathname, { uuid: true })

                if ((v[0] === '/' || v.includes(rootDomain!)) && id) {
                  const href = v.includes(rootDomain!)
                    ? v
                    : `${mapPageUrl(id)}${getHashFragmentValue(v)}`

                  return (
                    <components.PageLink className="notion-link" href={href} {...linkProps}>
                      {element}
                    </components.PageLink>
                  )
                } else {
                  let hostName = ''
                  try {
                    hostName = new URL(decorator[1]).hostname
                  } catch (_) {
                    hostName = ''
                  }
                  if (
                    hostName === 'localhost' ||
                    hostName?.includes(blockOptions?.siteDomain || 'cannotBeIncluded')
                  ) {
                    return (
                      <components.PageLink
                        className="notion-link"
                        href={removeBaseUrl(decorator[1])}
                      >
                        {element}
                      </components.PageLink>
                    )
                  }

                  return (
                    <components.Link
                      className="notion-link"
                      href={linkProtocol ? `${linkProtocol}:${decorator[1]}` : decorator[1]}
                      {...linkProps}
                    >
                      {element}
                    </components.Link>
                  )
                }
              }

              case 'd': {
                const v = decorator[1]
                const type = v?.type

                if (type === 'date') {
                  // Example: Jul 31, 2010
                  const startDate = v.start_date

                  return formatDate(startDate)
                } else if (type === 'datetime') {
                  // Example: Jul 31, 2010 20:00
                  const startDate = v.start_date
                  const startTime = v.start_time

                  return `${formatDate(startDate)} ${startTime}`
                } else if (type === 'daterange') {
                  // Example: Jul 31, 2010 → Jul 31, 2020
                  const startDate = v.start_date
                  const endDate = v.end_date

                  return `${formatDate(startDate)} → ${formatDate(endDate!)}`
                } else {
                  return element
                }
              }

              case 'u': {
                if (ignoreMarkup?.includes('_')) return element
                const userId = decorator[1]
                const user = recordMap.notion_user[userId]?.value

                if (!user) {
                  console.log('missing user', userId)
                  return null
                }

                const name = [user.given_name, user.family_name].filter(Boolean).join(' ')

                return (
                  <GracefulImage
                    className="notion-user"
                    src={mapImageUrl(user.profile_photo, block)}
                    alt={name}
                  />
                )
              }

              // Github mention
              case 'eoi': {
                const blockId = decorator[1]
                const externalObjectInstance = recordMap.block[blockId]
                  ?.value as ExternalObjectInstance

                return <EOI block={externalObjectInstance} inline={true} />
              }

              // Mention format
              case 'lm' as any: {
                const href = (decorator[1] as any)?.href
                const title = (decorator[1] as any)?.title
                const iconUrl = (decorator[1] as any)?.icon_url
                return (
                  <a
                    className="not-prose group inline-flex flex-row items-start gap-1.5 px-1 hover:cursor-pointer hover:border-sky-300"
                    target="_blank"
                    href={href}
                    rel="noopener noreferrer"
                  >
                    {iconUrl && (
                      <LazyImage
                        className="mt-[1px]"
                        useSimpleImage={true}
                        simpleImageProps={{ style: { height: 15, width: 15 } }}
                        src={iconUrl}
                        alt={'URL icon'}
                      />
                    )}
                    <div className="m2it-link group-hover:m2it-link-hover border-b border-slate-300 text-[1em] leading-[1.1]">
                      {title}
                    </div>
                  </a>
                )
              }

              default:
                if (process.env.NODE_ENV !== 'production') {
                  console.log('unsupported text format', decorator)
                }

                return element
            }
          },
          <>{newText}</>
        )

        return <React.Fragment key={index}>{formatted}</React.Fragment>
      })}
    </React.Fragment>
  )
}
