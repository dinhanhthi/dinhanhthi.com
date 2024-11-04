import { PostTypeOpts } from '@notion-x/src/components/PostsList'
import { PreviewImage } from 'notion-types'

import { DiscreteColsType } from '@notion-x/src/components/PostBody'
import { questrial } from './fonts'

export const numPostsToShow = 12

export const defaultBlurDataURL =
  'data:image/webp;base64,UklGRu4CAABXRUJQVlA4WAoAAAAgAAAA+wAApwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggAAEAAHAPAJ0BKvwAqAA+7Xa3VqmnJSOgKAEwHYlpbt1fqZxA/IArN2vFych77iezf2IwQKTtQI/RqjOdjq6pcOr5lpldrCjSn5FYIDAK5T0+7vcmKybbL6g6tSn7tWOv2ZxfWQNgEU/JeCq/k9zzuPl8W5gNqTbm15NB3zOe+XPb6vkmRHm8AAD+7o9aHj3aLa14yWQgMZs8TuamPLH5rZylxChra4B5dWHgwOps5SFJeulgIDP3UYKDX745YTtU1tek9VoKCM1AtUiD8IcS+R9XAhJ4zdKfFy6pI6GocwBeHqw2Ccx6spAjE6DfRuYxQAa1Low2YbwG8MRsesGFW6AAAAA='

export const defaultCustomPreviewImage: PreviewImage = {
  originalWidth: 252,
  originalHeight: 168,
  dataURIBase64: defaultBlurDataURL
}

export const containerNormal = 'max-w-4xl'
export const containerWide = 'xl:max-w-6xl'
export const bodyPadding = 'py-12'

export const defaultPostTitle = 'Untitled'

// Display the discrete notes in 1 column or 2-3 columns?
export const discreteColsType: DiscreteColsType = 'single'

export const defaultPostDate = new Date().toISOString().split('T')[0]

export const defaultPostTypeOpts: PostTypeOpts = {
  fontClassName: `${questrial.className} leading-[1.35] !text-[1.05rem]`,
  newLabel: 'new',
  updatedLabel: 'updated',
  humanizeDate: true,
  maxDaysWinthin: 14
}
