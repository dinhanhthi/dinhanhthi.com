import { postSimpleListContainerClass } from '../../../../lib/config'
import { SkeletonPageOfPostsListTemplate } from '../../../templates/PageOfPostsListTemplate'

export default function LoadingCategoryPage() {
  return (
    <SkeletonPageOfPostsListTemplate
      postListContainerClassName={postSimpleListContainerClass}
      postType="PostBlogSimple"
      numPosts={4}
    />
  )
}
