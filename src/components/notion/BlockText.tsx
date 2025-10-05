import {
  MentionRichTextItemResponse,
  TextRichTextItemResponse
} from '@notionhq/client/build/src/api-endpoints'
import cn from 'classnames'
import { get } from 'lodash'
import Link from 'next/link'
import React from 'react'

import { AnnotationIgnoreField, TextIgnoreField } from '@/src/lib/notion/interface'
import { generateTextAnnotationClasses } from '@/src/lib/helpers'

type TextProps = {
  richText: TextRichTextItemResponse | MentionRichTextItemResponse
  ignore?: TextIgnoreField[]
}

export default function BlockText(props: TextProps) {
  if (props.richText.plain_text.includes('\n')) {
    const lines = props.richText.plain_text.split('\n')
    return (
      <>
        {lines.map((line, index) => (
          <span key={index}>
            {line}
            {index !== lines.length - 1 && <br />}
          </span>
        ))}
      </>
    )
  }

  // Hyperlink
  if (
    props.richText.type === 'text' &&
    !props.ignore?.includes('hyperlink') &&
    props.richText.href &&
    isValidUrl(props.richText.href)
  ) {
    // Link contains "domain.com" and does not contain "@
    // This is the link coming from the current version of domain, not the old ones
    if (
      new URL(props.richText.href).hostname.includes(
        process.env.NEXT_PUBLIC_SITE_DOMAIN as string
      ) &&
      !props.richText.href.includes('@')
    ) {
      const uri = getUriFromUrl(props.richText.href, process.env.NEXT_PUBLIC_SITE_DOMAIN as string)
      return (
        <Link
          className={generateTextAnnotationClasses(
            props.richText.annotations,
            props.ignore as AnnotationIgnoreField[]
          )}
          href={uri}
        >
          {props.richText.plain_text}
        </Link>
      )
    } else {
      return (
        <a
          className={cn(
            'm2it-link',
            generateTextAnnotationClasses(
              props.richText.annotations,
              props.ignore as AnnotationIgnoreField[]
            )
          )}
          href={props.richText.href}
          target="_blank"
          rel="noreferrer"
        >
          {props.richText.plain_text}
        </a>
      )
    }
  }

  // Mention a page
  if (
    !props.ignore?.includes('hyperlink') &&
    props.richText.type === 'mention' &&
    props.richText.mention?.type === 'page' &&
    get(props.richText, 'mention.page.uri') // "uri" is a custom property
  ) {
    return (
      <Link
        className={generateTextAnnotationClasses(
          props.richText.annotations,
          props.ignore as AnnotationIgnoreField[]
        )}
        href={get(props.richText, 'mention.page.uri', '/')}
      >
        {props.richText.plain_text}
      </Link>
    )
  }

  // Mention a date
  if (props.richText.type === 'mention' && props.richText.mention?.type === 'date') {
    return (
      <span
        className={generateTextAnnotationClasses(
          props.richText.annotations,
          props.ignore as AnnotationIgnoreField[]
        )}
      >
        {formatDate(props.richText.plain_text)}
      </span>
    )
  }

  const noDecoration =
    !props.richText.annotations.bold &&
    !props.richText.annotations.italic &&
    !props.richText.annotations.underline &&
    !props.richText.annotations.strikethrough &&
    !props.richText.annotations.code &&
    props.richText.annotations.color === 'default' &&
    !props.richText.href

  if (noDecoration) return props.richText.plain_text

  return (
    <span
      className={generateTextAnnotationClasses(
        props.richText.annotations,
        props.ignore as AnnotationIgnoreField[]
      )}
    >
      {props.richText.plain_text}
    </span>
  )
}

function getUriFromUrl(url: string, siteDomain: string) {
  // Remove the protocol (http:// or https://)
  const withoutProtocol = url.replace(/^(https?:\/\/)/, '')

  // Remove "www" if present
  const withoutWWW = withoutProtocol.replace(/^www\./, '')

  // Remove trailing slashes
  const withoutTrailingSlashes = withoutWWW.replace(/\/+$/, '')

  // Remove siteDomain if present
  const withoutDomain = withoutTrailingSlashes.replace(new RegExp(`^${siteDomain}`), '')

  // Remove localhost:3000 if present
  const withoutLocalhost = withoutDomain.replace(/^localhost:3000/, '')

  // Add "/" at the beginning and the end
  const slug = `${withoutLocalhost}`

  return slug
}

function formatDate(inputString: string) {
  // Split the input string by the hyphen '-'
  const [year, month, day] = inputString.split('-')

  // Concatenate the day, month, and year with forward slashes '/'
  const formattedDate = `${day}/${month}/${year}`

  return formattedDate
}

// Check if the string is a valid URL
function isValidUrl(string: string) {
  try {
    new URL(string)
  } catch (_) {
    return false
  }
  return true
}
