import ImageComponent from '@/src/app/components/ImageComponent'
import { ImageType } from '@/src/lib/types'
import cn from 'classnames'

type HeadingAboutProps = {
  children: React.ReactNode
  headingId?: string
  headingClassName?: string
  className?: string
  icon?: ImageType
  iconClassName?: string
}

export default function HeadingAbout(props: HeadingAboutProps) {
  return (
    <div
      className={cn(
        `after:bg-repeating-dots relative mb-2 inline-block text-2xl after:absolute after:-right-2 after:-bottom-0 after:h-3 after:w-7 after:bg-[length:4px_4px] after:opacity-40`,
        props.className
      )}
    >
      <div className="flex items-center gap-2">
        {props.icon && (
          <div>
            <ImageComponent
              image={props.icon}
              alt="Heading icon"
              imageProps={{ width: 30, height: 30 }}
              className={props.iconClassName}
            />
          </div>
        )}
        <h2
          id={props.headingId}
          className={cn('font-heading font-semibold text-slate-800', props.headingClassName)}
        >
          {props.children}
        </h2>
      </div>
    </div>
  )
}
