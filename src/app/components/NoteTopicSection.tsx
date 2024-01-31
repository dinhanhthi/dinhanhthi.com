import ImageComponent from '@notion-x/src/components/ImageComponent'
import PostList from '@notion-x/src/components/PostsList'
import { Tag } from '@notion-x/src/interface'
import cn from 'classnames'
import Link from 'next/link'

import { defaultPostTypeOpts } from '../lib/config'
import { getPosts } from '../lib/fetcher'
import { getFilterOf } from '../lib/helpers'

type NoteTopicSectionProps = {
  tag: Tag
  className?: string
}

export default async function NoteTopicSection(props: NoteTopicSectionProps) {
  const numToDisplay = 8
  const tag = props.tag
  const notes = await getPosts({
    filter: getFilterOf('tag', tag),
    pageSize: numToDisplay
  })
  if (notes.length === 0) return null
  return (
    <div className="group flex flex-col gap-3">
      <div className="flex gap-2 items-center">
        <div>
          <ImageComponent
            image={tag.icon}
            alt="Heading icon"
            imageProps={{ width: 40, height: 40 }}
          />
        </div>
        <h2
          id={tag.id}
          className={cn('font-heading text-2xl font-semibold text-slate-700 scroll-mt-[70px]')}
        >
          <span>{tag.name}</span>
          {notes.length >= numToDisplay && (
            <Link
              className="text-[80%] ml-2 italic text-slate-600 font-normal hover:m2it-link-hover"
              href={tag.uri!}
            >
              ...more
            </Link>
          )}
        </h2>
      </div>
      <div className="thi-box-code overflow-hidden">
        <PostList
          posts={notes}
          postType="PostSimple"
          postTypeOpts={defaultPostTypeOpts}
          options={{
            className: 'flex flex-col divide-y'
          }}
        />
      </div>
    </div>
  )
}
