import cn from 'classnames'

type ContainerProps = {
  children: React.ReactNode
  className?: string
}
export default function Container(props: ContainerProps) {
  const { children, className } = props
  return <div className={cn('container mx-auto px-5 xl:max-w-6xl', className)}>{children}</div>
}
