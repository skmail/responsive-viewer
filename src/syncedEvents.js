import $ from 'jquery'
import onDomReady from './utils/onDomReady'
import uuid from 'uuid'
import getDomPath from './utils/domPath'

const frameID = uuid.v4()

let userScroll = false
function mouseEvent(e) {
  userScroll = true
}

function disableScrollEvent() {
  userScroll = false
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
        const element = $(event.data.path)

        if (element.length) {
          const evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: false,
            view: window,
          })
          element[0].dispatchEvent(evt)
          console.log('FOUND', event.data.path)
        } else {
          console.log('NOT FOUND', event.data.path)
        }
        break
    }
  })
})
