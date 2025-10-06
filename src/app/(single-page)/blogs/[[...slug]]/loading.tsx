import { SkeletonPageOfPostsListTemplate } from '../../../templates/PageOfPostsListTemplate'

export default function LoadingCategoryPage() {
  return (
    <SkeletonPageOfPostsListTemplate
      postListContainerClassName="bg-white rounded-xl overflow-hidden border border-slate-200 flex flex-col divide-y divide-slate-200"
      postType="PostBlogSimple"
      numPosts={4}
    />
  )
}
