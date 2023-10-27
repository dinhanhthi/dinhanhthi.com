/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'

const useScript = (params: any) => {
  const { url, theme, issueTerm, repo, ref } = params
  const [status, setStatus] = useState(url ? 'loading' : 'idle')

  useEffect(() => {
    if (!url) {
      setStatus('idle')
      return
    }

    const script = document.createElement('script')
    script.src = url
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('theme', theme)
    script.setAttribute('issue-term', issueTerm)
    script.setAttribute('repo', repo)

    // Check if the script is already in the document?
    const existingScript =
      !!document.getElementsByClassName('utterances')[0] || ref?.current?.firstChild

    if (existingScript) {
      setStatus('ready')
    } else {
      ref.current?.appendChild(script)
    }

    const setAttributeStatus = (event: any) => {
      setStatus(event.type === 'load' ? 'ready' : 'error')
    }

    script.addEventListener('load', setAttributeStatus)
    script.addEventListener('error', setAttributeStatus)

    return () => {
      if (script) {
        script.removeEventListener('load', setAttributeStatus)
        script.removeEventListener('error', setAttributeStatus)
      }
    }
  }, [url])
  return status
}

export default useScript
