import ImageComponent from '@/src/app/components/ImageComponent'
import PostList from '@/src/app/components/PostsList'
import { Tag } from '@/src/lib/types'

import { defaultPostTypeOpts, numPostsToShow, postSimpleListContainerClass } from '@/src/lib/config'
import { getPosts } from '@/src/lib/fetcher'
import { getFilterOf } from '@/src/lib/helpers'
import HeadingPage from '../../components/HeadingPage'

type NoteTopicSectionProps = {
  tag: Tag
  className?: string
}

export default async function NoteTopicSection(props: NoteTopicSectionProps) {
  const tag = props.tag
  const notes = await getPosts({
    filter: getFilterOf('tag', tag),
    pageSize: numPostsToShow,
    whoIsCalling: `(single-page)/notes/NoteTopicSection.tsx/NoteTopicSection/${tag.name}`
  })
  if (notes.length === 0) return null
  return (
    <div className="flex flex-col gap-3">
      <HeadingPage
        title={tag.longName || tag.name}
        href={tag.uri!}
        icon={
          <ImageComponent
            image={tag.icon}
            alt="Heading icon"
            imageProps={{ width: 40, height: 40 }}
          />
        }
      />
      <PostList
        posts={notes}
        postType="PostSimple"
        postTypeOpts={defaultPostTypeOpts}
        options={{
          className: postSimpleListContainerClass
        }}
      />
    </div>
  )
}
