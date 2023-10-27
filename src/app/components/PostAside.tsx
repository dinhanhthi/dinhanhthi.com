import cn from 'classnames'

type PostAsideRightProps = {
  position: 'right' | 'left'
  children: React.ReactNode
  className?: string
}

export default function PostAside(props: PostAsideRightProps) {
  return (
    <div
      className={cn(props.className, 'flex h-full pl-8 pr-4', {
        'justify-start': props.position === 'right',
        'justify-end': props.position === 'left'
      })}
    >
      <div className={cn('max-w-[400px] min-w-[256px]')}>{props.children}</div>
    </div>
  )
}
