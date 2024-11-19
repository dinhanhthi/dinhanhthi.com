import { SkeletonPageOfPostsListTemplate } from '../../../templates/PageOfPostsListTemplate'

export default function LoadingCategoryPage() {
  return (
    <SkeletonPageOfPostsListTemplate
      postListContainerClassName="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
      postType="PostCardWave"
      numPosts={8}
    />
  )
}
