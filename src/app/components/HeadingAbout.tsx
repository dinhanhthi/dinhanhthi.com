import ImageComponent from '@/src/components/notion/ImageComponent'
import { ImageType } from '@/src/lib/notion/interface'
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
        `relative mb-2 inline-block after:absolute after:-bottom-0 after:-right-2 after:h-3 after:w-7 after:bg-repeating-dots after:bg-[length:4px_4px] after:opacity-40 text-2xl`,
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
          className={cn('text-slate-800 font-heading font-semibold', props.headingClassName)}
        >
          {props.children}
        </h2>
      </div>
    </div>
  )
}
