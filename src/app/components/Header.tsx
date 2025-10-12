import cn from 'classnames'
import { sectionOuterClass } from '../../lib/config'

type HeaderProps = {
  children: React.ReactNode
  className?: string
}

export default function Header(props: HeaderProps) {
  return (
    <div
      className={cn(
        'mx-auto mb-12 p-4',
        sectionOuterClass,
        'border-4 border-double',
        props.className
      )}
    >
      {props.children}
    </div>
  )
}
