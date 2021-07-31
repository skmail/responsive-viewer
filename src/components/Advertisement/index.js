import React, { useEffect } from 'react'
import './style.css'
const Advertisement = props => {
  useEffect(() => {
    const onLoad = function(message) {
      if (message.data.message !== '@ADS/LOADED') {
        return
      }

      console.log('messsage', message.data)
      const iframe = document.getElementById('advertismentIframe')

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
      title="Advertisment"
      src="https://responsive-viewer-ads.netlify.app/"
      scrolling="no"
      frameBorder="no"
      id="advertismentIframe"
    ></iframe>
  )
}

export default Advertisement
