import throttle from 'lodash/throttle'
import domPath from '../../utils/domPath'
import findElement, { findWrappingSvg } from '../../utils/findElement'
import { sendMessage } from './sendMessage'

let highlightTimer: number

export const clearInspector = () => {
  if (!highlightElement) {
    return
  }
  highlightElement.parentElement?.removeChild(highlightElement)
}

const onMouseLeave = () => {
  clearInspector()

  sendMessage('CLEAR_INSPECT_ELEMENT')
}

const onClick = (e: MouseEvent) => {
  sendMessage('FINISH_INSPECT_ELEMENT')
}

const getMouseElement = (e: MouseEvent) => {
  const element = document
    .elementsFromPoint(e.clientX, e.clientY)
    .find(element => element !== highlightElement) as HTMLElement

  const parentSvg = findWrappingSvg(element)

  return parentSvg ? parentSvg : element
}

let highlightElement: HTMLElement

const renderHighlight = (rect: DOMRect) => {
  if (!highlightElement) {
    highlightElement = document.createElement('div')
  }

  highlightElement.style.width = withUnit(rect.width)
  highlightElement.style.height = withUnit(rect.height)
  highlightElement.style.top = withUnit(rect.top)
  highlightElement.style.left = withUnit(rect.left)
  highlightElement.style.outline = '2px dashed #FFC400'
  highlightElement.style.background = 'rgba(255, 196, 0,0.4)'
  highlightElement.style.position = 'fixed'
  highlightElement.style.zIndex = '9002'

  if (!highlightElement.parentElement) {
    document.body.appendChild(highlightElement)
  }

  return highlightElement
}

const withUnit = (value: number, unit = 'px') => `${value}${unit}`

const inspectByMouseMove = throttle((e: MouseEvent) => {
  const element = getMouseElement(e)

  if (!element) {
    return
  }

  const rect = element.getBoundingClientRect()

  renderHighlight(rect)

  sendMessage('INSPECT_ELEMENT', {
    path: domPath(element),
  })
}, 200)

function inViewport(rect: DOMRect) {
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export const inspectByEvent = async (data: { path: string }) => {
  const element = findElement(data.path) as HTMLElement

  if (!element) {
    return
  }

  const rect = element.getBoundingClientRect()

  if (!inViewport(rect)) {
    window.scrollTo({
      top: rect.y,
      left: rect.x,
    })
  }

  if (highlightTimer) {
    clearTimeout(highlightTimer)
  }

  renderHighlight(rect)

  highlightTimer = window.setTimeout(clearInspector, 1500)
}

export const enableMouseInspector = () => {
  document.addEventListener('mousemove', inspectByMouseMove)

  document.addEventListener('mouseleave', onMouseLeave)

  document.addEventListener('click', onClick)
}

export const disableMouseInspector = () => {
  clearInspector()

  document.removeEventListener('mousemove', inspectByMouseMove)

  document.removeEventListener('mouseleave', onMouseLeave)

  document.removeEventListener('click', onClick)
}
