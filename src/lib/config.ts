import { PostTypeOpts } from '@/src/app/components/PostsList'
import { PreviewImage } from 'notion-types'

import { DiscreteColsType } from '@/src/app/components/PostBody'
import { cn } from './utils'

export const numPostsToShow = 12

export const defaultBlurDataURL =
  'data:image/webp;base64,UklGRu4CAABXRUJQVlA4WAoAAAAgAAAA+wAApwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggAAEAAHAPAJ0BKvwAqAA+7Xa3VqmnJSOgKAEwHYlpbt1fqZxA/IArN2vFych77iezf2IwQKTtQI/RqjOdjq6pcOr5lpldrCjSn5FYIDAK5T0+7vcmKybbL6g6tSn7tWOv2ZxfWQNgEU/JeCq/k9zzuPl8W5gNqTbm15NB3zOe+XPb6vkmRHm8AAD+7o9aHj3aLa14yWQgMZs8TuamPLH5rZylxChra4B5dWHgwOps5SFJeulgIDP3UYKDX745YTtU1tek9VoKCM1AtUiD8IcS+R9XAhJ4zdKfFy6pI6GocwBeHqw2Ccx6spAjE6DfRuYxQAa1Low2YbwG8MRsesGFW6AAAAA='

export const defaultCustomPreviewImage: PreviewImage = {
  originalWidth: 252,
  originalHeight: 168,
  dataURIBase64: defaultBlurDataURL
}

export const bodyPadding = 'py-12'

export const defaultPostTitle = 'Untitled'

// Display the discrete notes in 1 column or 2-3 columns?
export const discreteColsType: DiscreteColsType = 'single'

export const defaultPostDate = new Date().toISOString().split('T')[0]

export const defaultPostTypeOpts: PostTypeOpts = {
  fontClassName: 'font-sans text-[0.95rem]',
  newLabel: 'new',
  updatedLabel: 'updated',
  humanizeDate: true,
  maxDaysWinthin: 14,
  autoHideAddedDate: true,
  hideOldDate: true
}

export const sectionOuterClass = cn(
  'overflow-hidden rounded-lg border border-slate-200 bg-white p-4'
)

export const postSimpleListContainerClass = cn(
  'flex flex-col divide-y divide-slate-200 overflow-hidden',
  sectionOuterClass
)

export const postFontClassName = 'font-quicksand'
