import React, { useEffect, useRef } from 'react'

type Message = {
  data: {
    [key: string]: any
    message: string
  }
}
const Advertisement = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const onLoad = function(message: Message) {
      if (message.data.message !== '@ADS/LOADED') {
        return
      }

      if (!iframeRef.current) {
        return
      }

      const height = Math.min(190, message.data.height)

      iframeRef.current.style.flexShrink = '0'
      iframeRef.current.style.width = '100%'
      iframeRef.current.style.height = `${height}px`
    }

    window.addEventListener('message', onLoad)

    return () => {
      window.removeEventListener('message', onLoad)
    }
  }, [])
  return (
    <iframe
      ref={iframeRef}
      width={20}
      height={0}
      title="Preview"
      src="https://preview.responsiveviewer.org/"
      scrolling="no"
      frameBorder="no"
      id="bannerIframe"
    ></iframe>
  )
}

export default Advertisement
