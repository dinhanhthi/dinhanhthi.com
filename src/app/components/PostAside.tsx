import cn from 'classnames'

type PostAsideRightProps = {
  position: 'right' | 'left'
  children: React.ReactNode
  className?: string
}

export default function PostAside(props: PostAsideRightProps) {
  return (
    <div
      className={cn(props.className, 'flex h-full pr-4 pl-8', {
        'justify-start': props.position === 'right',
        'justify-end': props.position === 'left'
      })}
    >
      <div className="max-w-[400px] min-w-[256px]">{props.children}</div>
    </div>
  )
}
