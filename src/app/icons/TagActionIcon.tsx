import { SVGProps } from 'react'

export function TagActionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <circle cx="20.01" cy="20.01" r="3" fill="currentColor"></circle>
      <path
        fill="currentColor"
        d="M18 3H6.83a3 3 0 1 0 0 2H18a3 3 0 0 1 0 6h-3.17a3 3 0 0 0-5.64 0H6a5 5 0 0 0 0 10h6v3l4-4l-4-4v3H6a3 3 0 1 1 0-6h3.2a3 3 0 0 0 5.63 0H18a5 5 0 0 0 0-10"
      ></path>
    </svg>
  )
}
