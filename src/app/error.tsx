'use client'

export default function ErrorAppPage({
  error: _error,
  reset: _reset
}: {
  error: Error
  reset: () => void
}) {
  return <div className="">Error</div>
}
