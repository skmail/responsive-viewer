import React from 'react'
import './style.css'
const Advertisement = props => {
  const container = React.useRef()

  React.useEffect(() => {
    const id = '_carbonads_js'
    const serve = 'CE7DK5QY'
    const placement = 'githubcom'
    const src = `https://cdn.carbonads.com/carbon.js?serve=${serve}&placement=${placement}`
    const script = document.createElement('script')
    script.id = id

    container.current.appendChild(script)
    script.src = src
  }, [])

  return <div ref={container} />
}

export default Advertisement
