import cn from 'classnames'

import { BookmarkItem } from '../../../interface'
import SimpleImage from '../../components/SimpleImage'
import BsFillBookmarkHeartFill from '../../icons/BsFillBookmarkHeartFill'

type BookmarkItemProps = {
  mark: BookmarkItem
}

export default function BookmarkItemTemplate(props: BookmarkItemProps) {
  const { mark } = props
  return (
    <a
      key={mark.id}
      href={mark.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex flex-row gap-4 border border-slate-200 p-4 rounded-md bg-white',
        'hover:border-sky-300 group'
      )}
    >
      <div
        className={cn('rounded-md w-[120px] min-w-[120px] overflow-hidden border-slate-100 border')}
      >
        {mark?.coverUrl && (
          <SimpleImage
            src={mark.coverUrl!}
            width={120}
            className={cn('object-cover')}
            style={{ height: '100%' }}
            imagePlaceholder={ImagePlaceholder()}
          />
        )}
        {!mark?.coverUrl && (
          <div className={cn('p-4', 'flex items-center justify-center bg-slate-100')}>
            <BsFillBookmarkHeartFill className="text-2xl text-slate-300" />
          </div>
        )}
      </div>
      <div className="flex gap-2 flex-col">
        <div className="text-slate-900 text-[0.9rem] group-hover:m2it-link-hover">{mark.title}</div>
        <div className="text-slate-600 text-[0.8rem]">{mark.description}</div>
      </div>
    </a>
  )
}

const ImagePlaceholder = () => (
  <div
    style={{ width: 120 }}
    className={cn(
      'bg-gray-100 flex items-center justify-center animate-pulse rounded-md w-[120px] min-w-[120px]',
      'h-full'
    )}
  >
    <BsFillBookmarkHeartFill className="text-[25px] text-slate-400" />
  </div>
)
