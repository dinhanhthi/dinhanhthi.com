import { BookOpenText } from 'lucide-react'

export const DefaultPageIcon = (props: any) => {
  const { className, ...rest } = props
  return <BookOpenText className={className} {...rest} />
}
