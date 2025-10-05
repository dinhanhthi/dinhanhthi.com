import ImageComponent from '@/src/app/components/ImageComponent'
import PostList from '@/src/app/components/PostsList'
import { Tag } from '@/src/lib/types'
import cn from 'classnames'
import Link from 'next/link'

import { defaultPostTypeOpts, numPostsToShow, postSimpleListClass } from '@/src/lib/config'
import { getPosts } from '@/src/lib/fetcher'
import { getFilterOf } from '@/src/lib/helpers'

type NoteTopicSectionProps = {
  tag: Tag
  className?: string
}

export default async function NoteTopicSection(props: NoteTopicSectionProps) {
  const tag = props.tag
  const notes = await getPosts({
    filter: getFilterOf('tag', tag),
    pageSize: numPostsToShow
  })
  if (notes.length === 0) return null
  return (
    <div className="group flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div>
          <ImageComponent
            image={tag.icon}
            alt="Heading icon"
            imageProps={{ width: 40, height: 40 }}
          />
        </div>
        <h2
          id={tag.id}
          className="font-heading scroll-mt-[70px] text-2xl font-semibold text-slate-700"
        >
          <span>
            {tag.longName || tag.name} {tag.longName && <>({tag.name})</>}
          </span>
          {notes.length >= numPostsToShow && (
            <Link
              className={cn(
                'hover:m2it-link-hover ml-2 text-[70%] font-normal text-slate-600 italic'
              )}
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
            className: postSimpleListClass
          }}
        />
      </div>
    </div>
  )
}
