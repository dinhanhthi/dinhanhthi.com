import React from 'react'

export default function GrCircleInformation(props: { className?: string }) {
  return (
    <svg
      className={props.className}
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        stroke="#000"
        strokeWidth="2"
        d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,10 L12,18 M12,6 L12,8"
      ></path>
    </svg>
  )
}
