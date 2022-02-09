import getDomPath from '../../utils/domPath'

declare global {
  interface Window {
    userScroll: boolean
  }
  interface Document {
    onmousewheel: () => void
  }
}

window.userScroll = false
function mouseEvent() {
  window.userScroll = true
}

function disableScrollEvent() {
  window.userScroll = false
}

// https://stackoverflow.com/questions/7035896/detect-whether-scroll-event-was-created-by-user
document.addEventListener('keydown', e => {
  const scrollKeys = ['Space', 'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown']
  const withCtrlScrollKeys = ['Home', 'End']
  if (
    scrollKeys.includes(e.code) ||
    (e.ctrlKey && withCtrlScrollKeys.includes(e.code))
  ) {
    window.userScroll = true
  }
})

document.addEventListener('DOMMouseScroll', mouseEvent, false)

document.addEventListener('click', disableScrollEvent)

document.onmousewheel = mouseEvent

window.addEventListener(
  'scroll',
  e => {
    if (!window.top || !e.target) {
      return
    }
    if (window.userScroll === false) {
      return
    }
    window.top.postMessage(
      {
        message: '@APP/FRAME_SCROLL',
        frameId: window.frameID,
        scrollTop: document.documentElement.scrollTop,
        scrollLeft: document.documentElement.scrollLeft,
        path: getDomPath(e.target as HTMLElement),
      },
      '*'
    )
  },
  false
)

export default (data: { scrollTop: number; scrollLeft: number }) => {
  window.userScroll = false
  window.scrollTo({
    top: data.scrollTop,
    left: data.scrollLeft,
  })
}