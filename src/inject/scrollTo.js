window.userScroll = false
function mouseEvent(e) {
  window.userScroll = true
}

function disableScrollEvent() {
  window.userScroll = false
}

// https://stackoverflow.com/questions/7035896/detect-whether-scroll-event-was-created-by-user
document.addEventListener('keydown', e => {
  if (
    e.which === 33 || // page up
    e.which === 34 || // page dn
    e.which === 32 || // spacebar
    e.which === 38 || // up
    e.which === 40 || // down
    (e.ctrlKey && e.which === 36) || // ctrl + home
    (e.ctrlKey && e.which === 35) // ctrl + end
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
    if (window.userScroll === false) {
      return
    }
    window.top.postMessage(
      {
        message: '@APP/FRAME_SCROLL',
        frameId: window.frameID,
        scrollTop: document.documentElement.scrollTop,
        scrollLeft: document.documentElement.scrollLeft,
      },
      '*'
    )
  },
  false
)

export default data => {
  window.userScroll = false
  window.scrollTo({
    top: data.scrollTop,
    left: data.scrollLeft,
  })
}
