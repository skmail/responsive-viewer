import $ from 'jquery'
export default data => {
  $('body').css({
    'pointer-events': 'none',
  })

  window.top.postMessage(
    {
      message: '@APP/SCREENSHOT',
      frameId: window.frameID,
      screen: data.screen,
      type: data.type,
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
}

export const screenshotDone = data => {
  $('body').css({
    'pointer-events': 'inherit',
  })
}
