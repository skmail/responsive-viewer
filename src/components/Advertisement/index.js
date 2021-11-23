import React, { useEffect } from 'react'
import './style.css'
const Advertisement = props => {
  useEffect(() => {
    const onLoad = function(message) {
      if (message.data.message !== '@ADS/LOADED') {
        return
      }

      const iframe = document.getElementById('bannerIframe')

      const height = Math.min(190, message.data.height)

      iframe.style.width = '100%'
      iframe.style.height = `${height}px`
    }

    window.addEventListener('message', onLoad)

    return () => {
      window.removeEventListener('message', onLoad)
    }
  }, [])
  return (
    <iframe
      title="Preview"
      src="https://preview.responsiveviewer.org/"
      scrolling="no"
      frameBorder="no"
      id="bannerIframe"
    ></iframe>
  )
}

export default Advertisement
