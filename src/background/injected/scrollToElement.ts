import getDomPath from '../../utils/domPath'
import scrollIntoView from 'scroll-into-view'

const animatedScrollTo = (
  element: HTMLElement,
  topOffset = 0,
  leftOffset = 0
) =>
  new Promise(resolve =>
    scrollIntoView(
      element,
      {
        time: 220,
        align: {
          top: 0,
          left: 0,
          topOffset,
          leftOffset,
        },
      },
      () => {
        resolve(true)
      }
    )
  )

let inspectorAllTimer: number

const getSelector = (name?: string, asSelector = false) =>
  `${asSelector ? '.' : ''}INSPECT_ELEMENT_${window.frameID}${
    name ? `-${name}` : ''
  }`

const removeElements = (selectors: string[]) => {
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(e => e.remove())
  })
}

const clearInspector = () => {
  removeElements([
    getSelector('mouse', true),
    getSelector('top', true),
    getSelector('left', true),
    getSelector('right', true),
    getSelector('bottom', true),
  ])
}

const inspectByMouseClick = (e: MouseEvent) => {
  if (!window.top) {
    return
  }
  const path = getDomPath(getMouseElement(e))
  window.top.postMessage(
    {
      message: '@APP/SCROLL_TO_ELEMENT',
      frameId: window.frameID,
      path,
    },
    '*'
  )
}

const getMouseElement = (e: MouseEvent) => {
  const elements = document.elementsFromPoint(e.clientX, e.clientY)

  let element = elements[1]

  // const parentSvg = element.closest('svg')
  // if (parentSvg.length) {
  //   element = parentSvg
  // }
  return element as HTMLElement
}
const createElement = (name: string, appendTo?: HTMLElement) => {
  const element = document.createElement('div')
  element.className = getSelector(name)

  if (appendTo) {
    appendTo.appendChild(element)
  }
  element.style.zIndex = '9002'
  element.style.cursor = 'pointer'
  element.style.position = 'absolute'

  return element
}

const withUnit = (value: number, unit = 'px') => `${value}${unit}`

const createInspectElement = (box: DOMRect) => {
  const root = createElement('root')
  const top = createElement('top', root)
  const left = createElement('left', root)
  const right = createElement('right', root)
  const bottom = createElement('bottom', root)
  const highlight = createElement('highlight', root)

  root.style.width = withUnit(box.width)
  root.style.height = withUnit(box.height)
  root.style.top = withUnit(box.y)
  root.style.left = withUnit(box.x)
  root.style.background = 'rgba(255, 196, 0,0.4)'

  return {
    root,
    left,
    top,
    bottom,
    right,
    highlight,
  }
}

const inspectByMouseMove = (e: MouseEvent) => {
  const element = getMouseElement(e)
  const box = element.getBoundingClientRect()
  createInspectElement(box)
}

export const scrollToElement = async (data: { path: string }) => {
  const element = document.querySelector(data.path) as HTMLElement

  if (!element) {
    return
  }

  const box = element.getBoundingClientRect()

  const inspectionElements = createInspectElement(box)

  let margin: number
  const windowHeight = window.outerHeight

  if (box.height > windowHeight / 2) {
    margin = 0
  } else {
    margin = windowHeight / 3 - box.height / 2
  }

  await animatedScrollTo(element)

  if (inspectorAllTimer) {
    clearTimeout(inspectorAllTimer)
  }

  if (inspectorAllTimer) {
    clearTimeout(inspectorAllTimer)
  }

  const overlayBackground = 'rgba(255, 196, 0,0.2)'

  inspectionElements.top.style.width = withUnit(box.left)
  inspectionElements.top.style.height = withUnit(box.height)
  inspectionElements.top.style.top = withUnit(box.top)
  inspectionElements.top.style.background = overlayBackground

  inspectionElements.left.style.width = '100%'
  inspectionElements.left.style.height = withUnit(box.top)
  inspectionElements.left.style.top = withUnit(0)
  inspectionElements.left.style.left = withUnit(0)
  inspectionElements.left.style.background = overlayBackground

  inspectionElements.right.style.width = `calc(100% - ${box.left +
    box.width}px)`
  inspectionElements.right.style.height = withUnit(box.height)
  inspectionElements.right.style.top = withUnit(box.top)
  inspectionElements.right.style.right = withUnit(0)
  inspectionElements.right.style.background = overlayBackground

  inspectionElements.bottom.style.width = `100%`
  inspectionElements.bottom.style.height = `100%`
  inspectionElements.bottom.style.top = withUnit(box.top + box.height)
  inspectionElements.bottom.style.left = withUnit(0)
  inspectionElements.bottom.style.background = overlayBackground

  inspectionElements.bottom.style.width = withUnit(box.width)
  inspectionElements.bottom.style.height = withUnit(box.height)
  inspectionElements.bottom.style.top = withUnit(box.top)
  inspectionElements.bottom.style.left = withUnit(box.left)
  inspectionElements.bottom.style.outline = '2px dashed #FFC400'
  inspectionElements.bottom.style.pointerEvents = 'none'

  const onRootClick = () => {
    inspectionElements.root.remove()
    inspectionElements.root.removeEventListener('click', onRootClick)
  }

  inspectionElements.root.addEventListener('click', onRootClick)

  inspectorAllTimer = window.setTimeout(clearInspector, 1500)
}

export const enableMouseInspector = () => {
  document.addEventListener('mousemove', inspectByMouseMove)

  document.addEventListener('mouseleave', clearInspector)

  document.addEventListener('click', inspectByMouseClick)
}

export const disableMouseInspector = () => {
  clearInspector()

  document.removeEventListener('mousemove', inspectByMouseMove)

  document.removeEventListener('mouseleave', clearInspector)

  document.removeEventListener('click', inspectByMouseClick)
}
