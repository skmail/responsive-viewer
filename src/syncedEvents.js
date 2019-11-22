import onDomReady from './utils/onDomReady'
import uuid from 'uuid'
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
          message: 'FRAME_SCROLL',
          frameId: frameID,
          scrollTop: document.documentElement.scrollTop,
          scrollLeft: document.documentElement.scrollLeft,
        },
        '*'
      )
    },
    false
  )

  window.addEventListener('message', event => {
    if (!event.data || event.data.message !== 'FRAME_SCROLL') {
      return
    }

    if (event.data.frameId === frameID) {
      return
    }

    userScroll = false

    window.scrollTo({
      top: event.data.scrollTop,
      left: event.data.scrollLeft,
    })
  })
})
