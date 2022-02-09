export default (data = {}) => {
  if (!window.top) {
    return
  }
  window.top.postMessage(
    {
      ...data,
      message: '@APP/DIMENSIONS',
      frameId: window.frameID,
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
