import cn from 'classnames'
import Container from './Container'

type HeaderProps = {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}

export default function Header(props: HeaderProps) {
  return (
    <div data-theme="dark" className={cn('mx-auto mb-12 bg-slate-800 px-4 py-10', props.className)}>
      <Container className={cn('text-white', props.containerClassName)}>{props.children}</Container>
    </div>
  )
}
