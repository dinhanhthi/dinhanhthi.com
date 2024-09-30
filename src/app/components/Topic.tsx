'use client'

import ImageComponent from '@notion-x/src/components/ImageComponent'
import SimpleImage from '@notion-x/src/components/SimpleImage'
import TooltipX from '@notion-x/src/components/tooltip-x'
import { makeSlugText } from '@notion-x/src/lib/helpers'
import cn from 'classnames'
import Link from 'next/link'
import { Tag } from '../../interface'
import { getUri } from '../lib/helpers'

type TopicProps = {
  type?: 'simple' | 'detailed'
  tag: Tag
  imagePlaceholder?: React.ReactNode
}

export default function Topic(props: TopicProps) {
  const { tag, type = 'detailed' } = props
  return (
    <>
      {type === 'detailed' && (
        <Link
          id={`topic-${tag.id}`}
          href={tag.uri!}
          key={tag.id}
          className={cn(
            'thi-box-code flex items-center gap-2 p-4 transition duration-200 ease-in-out hover:-translate-y-0.5'
          )}
        >
          {tag.icon && (
            <div>
              <SimpleImage
                src={tag.icon.sourceUrl!}
                alt={tag.name}
                width={30}
                height={30}
                imagePlaceholder={props.imagePlaceholder}
              />
            </div>
          )}
          <div>{tag.longName || tag.name}</div>
        </Link>
      )}
      {type === 'simple' && (
        <Link
          id={`topic-${tag.id}`}
          href={getUri('tag', makeSlugText(tag.name))!}
          key={makeSlugText(tag.name)}
          className={cn(
            'flex items-center gap-1 p-2 thi-box-code',
            'transition duration-200 ease-in-out hover:-translate-y-0.5'
          )}
        >
          {tag.icon && (
            <div>
              <ImageComponent
                image={tag.icon}
                alt={tag.name}
                imageProps={{ width: 20, height: 20, placeholder: 'empty' }}
              />
            </div>
          )}
          <div>{tag.longName || tag.name}</div>
        </Link>
      )}
      <TooltipX id={`#topic-${tag.id}`}>{tag.description}</TooltipX>
    </>
  )
}
