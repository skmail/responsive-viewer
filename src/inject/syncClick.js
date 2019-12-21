import getDomPath from '../utils/domPath'
import $ from 'jquery'

export default () => {
  document.addEventListener('click', e => {
    if (!e.isTrusted) {
      return true
    }
    const path = getDomPath(e.target)

    window.top.postMessage(
      {
        message: '@APP/CLICK',
        frameId: window.frameID,
        path,
      },
      '*'
    )
  })
}

export const simulateClick = data => {
  const element = $(data.path)
  if (element.length) {
    const evt = new MouseEvent('click', {
      bubbles: true,
      cancelable: false,
      view: window,
    })
    element[0].dispatchEvent(evt)
  }
}
