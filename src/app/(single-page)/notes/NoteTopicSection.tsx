import ImageComponent from '@/src/app/components/ImageComponent'
import PostList from '@/src/app/components/PostsList'
import { Post, Tag } from '@/src/lib/types'

import { defaultPostTypeOpts, postSimpleListContainerClass } from '@/src/lib/config'
import HeadingPage from '../../components/HeadingPage'

type NoteTopicSectionProps = {
  tag: Tag
  posts: Post[]
  className?: string
}

export default function NoteTopicSection(props: NoteTopicSectionProps) {
  const { tag, posts } = props
  if (posts.length === 0) return null
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
        posts={posts}
        postType="PostSimple"
        postTypeOpts={defaultPostTypeOpts}
        options={{
          className: postSimpleListContainerClass
        }}
      />
    </div>
  )
}
