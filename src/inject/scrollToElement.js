import $ from 'jquery'
import getDomPath from '../utils/domPath'

let inspectorAllTimer
const getInspectorElementSelector = () => `INSPECT_ELEMENT_${window.frameID}`
const getInspectedElementByMouseSelector = () =>
  `.MOUSE_ELEMENT_INSPECTOR_${window.frameID}`
const getInspectorTopOverlaySelector = () =>
  `.${getInspectorElementSelector()}-top-overlay`
const getInspectorleftOverlaySelector = () =>
  `.${getInspectorElementSelector()}-left-overlay`
const getInspectorRightOverlaySelector = () =>
  `.${getInspectorElementSelector()}-right-overlay`
const getInspectorBottomOverlaySelector = () =>
  `.${getInspectorElementSelector()}-bottom-overlay`

const clearInspector = () => {
  $(`.${getInspectorElementSelector()}`).remove()
  $(getInspectorTopOverlaySelector()).remove()
  $(getInspectorleftOverlaySelector()).remove()
  $(getInspectorRightOverlaySelector()).remove()
  $(getInspectorBottomOverlaySelector()).remove()
  $(getInspectedElementByMouseSelector()).remove()
}

const inspectByMouseClick = e => {
  const path = getDomPath(getMouseElement(e)[0])
  window.top.postMessage(
    {
      message: '@APP/SCROLL_TO_ELEMENT',
      frameId: window.frameID,
      path,
    },
    '*'
  )
}

const getMouseElement = e => {
  const elements = document.elementsFromPoint(e.clientX, e.clientY)

  let element = $(elements[1])

  const parentSvg = element.closest('svg')
  if (parentSvg.length) {
    element = parentSvg
  }
  return element
}

const inspectByMouseMove = e => {
  const element = getMouseElement(e)

  const elementWidth = element.outerWidth()
  const elementHeight = element.outerHeight()

  $('body')
    .findOrAppend(getInspectedElementByMouseSelector())
    .css({
      width: elementWidth,
      height: elementHeight,
      position: 'absolute',
      top: element.offset().top,
      left: element.offset().left,
      background: 'rgba(255, 196, 0,0.4)',
      zIndex: 9002,
      cursor: 'pointer',
    })
}

export const scrollToElement = data => {
  const inspectorElementSelector = getInspectorElementSelector()
  const inspectedElementByMouseSelector = getInspectedElementByMouseSelector()
  const inspectorTopOverlaySelector = getInspectorTopOverlaySelector()
  const inspectorleftOverlaySelector = getInspectorleftOverlaySelector()
  const inspectorRightOverlaySelector = getInspectorRightOverlaySelector()
  const inspectorBottomOverlaySelector = getInspectorBottomOverlaySelector()

  const element = $(data.path)

  $(inspectedElementByMouseSelector).remove()

  if (element.length) {
    const windowHeight = $(window).outerHeight()
    const elementHeight = element.outerHeight()

    let margin

    if (elementHeight > windowHeight / 2) {
      margin = 0
    } else {
      margin = windowHeight / 3 - elementHeight / 2
    }

    $([document.documentElement, document.body]).animate(
      {
        scrollTop: element.offset().top - margin,
      },
      800,
      () => {
        if (inspectorAllTimer) {
          clearTimeout(inspectorAllTimer)
        }

        const elementWidth = element.outerWidth()
        const elementHeight = element.outerHeight()

        const overlayBackground = 'rgba(255, 196, 0,0.2)'
        $('body')
          .findOrAppend(inspectorTopOverlaySelector)
          .css({
            width: '100%',
            height: element.offset().top,
            position: 'absolute',
            top: 0,
            left: 0,
            background: overlayBackground,
            zIndex: 9000,
          })
        $('body')
          .findOrAppend(inspectorleftOverlaySelector)
          .css({
            width: element.offset().left,
            height: elementHeight,
            position: 'absolute',
            top: element.offset().top,
            left: 0,
            background: overlayBackground,
            zIndex: 9000,
          })
        $('body')
          .findOrAppend(inspectorRightOverlaySelector)
          .css({
            width: `calc(100% - ${element.offset().left + elementWidth}px)`,
            height: elementHeight,
            position: 'absolute',
            top: element.offset().top,
            right: 0,
            background: overlayBackground,
            zIndex: 9000,
          })
        $('body')
          .findOrAppend(inspectorBottomOverlaySelector)
          .css({
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: element.offset().top + elementHeight,
            left: 0,
            background: overlayBackground,
            zIndex: 9000,
          })

        $('body')
          .findOrAppend(`.${inspectorElementSelector}`)
          .css({
            width: elementWidth,
            height: elementHeight,
            position: 'absolute',
            top: element.offset().top,
            left: element.offset().left,
            outline: `2px dashed #FFC400`,
            pointerEvents: 'none',
            zIndex: 9001,
          })

        $(
          [
            inspectorTopOverlaySelector,
            inspectorleftOverlaySelector,
            inspectorRightOverlaySelector,
            inspectorBottomOverlaySelector,
          ].join(', ')
        ).one('click', clearInspector)

        inspectorAllTimer = setTimeout(() => {
          clearInspector()
        }, 1500)
      }
    )
  }
}

export const enableMouseInspector = data => {
  $(document).on('mousemove', inspectByMouseMove)

  $(document).on('mouseleave', clearInspector)

  $('body').on(
    'click',
    getInspectedElementByMouseSelector(),
    inspectByMouseClick
  )
}

export const disableMouseInspector = data => {
  clearInspector()

  $(document).off('mouseleave', clearInspector)

  $(document).off('mousemove', inspectByMouseMove)

  $('body').off(
    'click',
    getInspectedElementByMouseSelector(),
    inspectByMouseClick
  )
}

export const mouseWheel = data => {
  const element = $(data.path)

  console.log('try to trigger', data)
  if (element.length) {
    const evt = new WheelEvent('mousewheel', {
      deltaMode: data.event.deltaMode,
      deltaZ: data.event.deltaZ,
      deltaY: data.event.deltaY,
      deltaX: data.event.deltaX,
      bubbles: true,
      cancelable: true,
      view: window,
    })

    element[0].dispatchEvent(evt)
  }
}
