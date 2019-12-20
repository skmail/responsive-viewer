import $ from 'jquery'
import onDomReady from './utils/onDomReady'
import uuid from 'uuid'
import getDomPath from './utils/domPath'

const frameID = uuid.v4()
const inspectorElementSelector = `INSPECT_ELEMENT_${frameID}`
const inspectedElementByMouseSelector = `.MOUSE_ELEMENT_INSPECTOR_${frameID}`
const inspectorTopOverlaySelector = `.${inspectorElementSelector}-top-overlay`
const inspectorleftOverlaySelector = `.${inspectorElementSelector}-left-overlay`
const inspectorRightOverlaySelector = `.${inspectorElementSelector}-right-overlay`
const inspectorBottomOverlaySelector = `.${inspectorElementSelector}-bottom-overlay`

let userScroll = false
let inspectorAllTimer
function mouseEvent(e) {
  userScroll = true
}

function disableScrollEvent() {
  userScroll = false
}

$.fn.findOrAppend = function(selector) {
  var elements = this.find(selector)
  return elements.length
    ? elements
    : $(`<div class="${selector.replace('.', '')}">`).appendTo(this)
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
const clearInspector = () => {
  $(`.${inspectorElementSelector}`).remove()
  $(inspectorTopOverlaySelector).remove()
  $(inspectorleftOverlaySelector).remove()
  $(inspectorRightOverlaySelector).remove()
  $(inspectorBottomOverlaySelector).remove()
  $(inspectedElementByMouseSelector).remove()
}

const inspectByMouseMove = e => {
  const element = getMouseElement(e)

  const elementWidth = element.outerWidth()
  const elementHeight = element.outerHeight()

  $('body')
    .findOrAppend(inspectedElementByMouseSelector)
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
const inspectByMouseClick = e => {
  const path = getDomPath(getMouseElement(e)[0])

  window.top.postMessage(
    {
      message: '@APP/SCROLL_TO_ELEMENT',
      frameId: frameID,
      path,
    },
    '*'
  )
}

onDomReady(() => {
  // https://stackoverflow.com/questions/7035896/detect-whether-scroll-event-was-created-by-user
  document.addEventListener('keydown', e => {
    if (
      e.which == 33 || // page up
      e.which == 34 || // page dn
      e.which == 32 || // spacebar
      e.which == 38 || // up
      e.which == 40 || // down
      (e.ctrlKey && e.which == 36) || // ctrl + home
      (e.ctrlKey && e.which == 35) // ctrl + end
    ) {
      userScroll = true
    }
  })

  document.addEventListener('DOMMouseScroll', mouseEvent, false)

  document.addEventListener('click', disableScrollEvent)

  document.onmousewheel = mouseEvent

  window.addEventListener(
    'scroll',
    e => {
      if (userScroll === false) {
        return
      }
      window.top.postMessage(
        {
          message: '@APP/FRAME_SCROLL',
          frameId: frameID,
          scrollTop: document.documentElement.scrollTop,
          scrollLeft: document.documentElement.scrollLeft,
        },
        '*'
      )
    },
    false
  )

  document.addEventListener('click', e => {
    if (!e.isTrusted) {
      return true
    }

    const path = getDomPath(e.target)

    window.top.postMessage(
      {
        message: '@APP/CLICK',
        frameId: frameID,
        path,
      },
      '*'
    )
  })

  window.addEventListener('message', event => {
    if (!event.data || !String(event.data.message).startsWith('@APP')) {
      return
    }

    if (event.data.frameId === frameID) {
      return
    }

    switch (event.data.message) {
      case '@APP/FRAME_SCROLL':
        userScroll = false
        window.scrollTo({
          top: event.data.scrollTop,
          left: event.data.scrollLeft,
        })
        break

      case '@APP/CLICK':
        {
          const element = $(event.data.path)

          if (element.length) {
            const evt = new MouseEvent('click', {
              bubbles: true,
              cancelable: false,
              view: window,
            })
            element[0].dispatchEvent(evt)
          } else {
          }
        }

        break
      case '@APP/SCROLL_TO_ELEMENT':
        {
          const element = $(event.data.path)
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
                    width: `calc(100% - ${element.offset().left +
                      elementWidth}px)`,
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
        break

      case '@APP/ENABLE_MOUSE_INSPECTOR':
        $(document).on('mousemove', inspectByMouseMove)

        $(document).on('mouseleave', clearInspector)

        $('body').on(
          'click',
          inspectedElementByMouseSelector,
          inspectByMouseClick
        )
        break

      case '@APP/DISABLE_MOUSE_INSPECTOR':
        clearInspector()

        $(document).off('mouseleave', clearInspector)

        $(document).off('mousemove', inspectByMouseMove)

        $('body').off(
          'click',
          inspectedElementByMouseSelector,
          inspectByMouseClick
        )
        break

      case '@APP/SCREENSHOT':
        window.top.postMessage(
          {
            message: '@APP/SCREENSHOT',
            frameId: frameID,
            screen: event.data.screen,
            height: Math.max(
              document.body.scrollHeight,
              document.documentElement.scrollHeight,
              document.body.offsetHeight,
              document.documentElement.offsetHeight,
              document.body.clientHeight,
              document.documentElement.clientHeight
            ),
            width: Math.max(
              document.body.scrollWidth,
              document.documentElement.scrollWidth,
              document.body.offsetWidth,
              document.documentElement.offsetWidth,
              document.body.clientWidth,
              document.documentElement.clientWidth
            ),
          },

          '*'
        )
        break
    }
  })
})
