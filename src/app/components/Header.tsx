import cn from 'classnames'
import Container from './Container'

type HeaderProps = {
  children: React.ReactNode
  className?: string
}

export default function Header(props: HeaderProps) {
  return (
    <div className={cn('bg-bg border-border-muted mx-auto mb-12 border-b px-4 py-8')}>
      <Container className={props.className}>{props.children}</Container>
    </div>
  )
}
